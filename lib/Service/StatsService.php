<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ClickEvent;
use OCA\Shortlinks\Db\ClickEventMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\StatsMapper;
use OCA\Shortlinks\Event\BeforeClickRecordedEvent;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use OCA\Shortlinks\Provider\UserAgent\UserAgentParserInterface;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IRequest;
use OCP\IUserSession;

final class StatsService {
	public function __construct(
		private readonly ClickEventMapper $clicks,
		private readonly StatsMapper $stats,
		private readonly StatsSeriesService $series,
		private readonly ShortLinkMapper $links,
		private readonly LinkPolicy $policy,
		private readonly SettingsService $settings,
		private readonly VisitorHasher $hasher,
		private readonly ReferrerSanitizer $referrers,
		private readonly UserAgentParserInterface $userAgents,
		private readonly GeoResolverInterface $geo,
		private readonly IUserSession $userSession,
		private readonly ITimeFactory $time,
		private readonly IEventDispatcher $events,
	) {
	}

	public function record(ShortLink $link, IRequest $request, string $outcome = 'redirected'): void {
		if (!$this->settings->bool('stats_enabled')) {
			return;
		}
		$now = $this->time->getTime();
		$detailsSuppressed = $this->settings->string('privacy_mode') === 'counts'
			|| ($this->settings->bool('respect_dnt') && ($request->getHeader('DNT') === '1' || $request->getHeader('Sec-GPC') === '1'));
		if ($detailsSuppressed) {
			$event = new ClickEvent();
			$event->setLinkId($link->getId());
			$event->setClickedAt($now);
			$event->setOutcome('counted');
			$this->events->dispatchTyped(new BeforeClickRecordedEvent($event));
			$this->clicks->insert($event);
			return;
		}
		$uaRaw = $request->getHeader('User-Agent');
		$ua = $this->userAgents->parse($uaRaw);
		if ($ua['isBot'] && !$this->settings->bool('record_bots')) {
			return;
		}
		$referrer = $this->referrers->sanitize($request->getHeader('Referer'), $request->getHeader('Host'), $this->settings->string('referrer_mode'));
		$ip = $request->getRemoteAddress();
		$geo = $this->geo->resolve($ip);
		$event = new ClickEvent();
		$event->setLinkId($link->getId());
		$event->setClickedAt($now);
		$event->setUserUid($this->settings->bool('log_authenticated_users') ? $this->userSession->getUser()?->getUID() : null);
		$event->setVisitorHash($this->hasher->hash($link->getId(), $now, $ip, $uaRaw));
		$event->setReferrerType($referrer['type']);
		$event->setReferrerDomain($referrer['domain']);
		$event->setReferrerUrl($referrer['url']);
		$event->setBrowser($ua['browser']);
		$event->setBrowserVersion($ua['browserVersion']);
		$event->setOs($ua['os']);
		$event->setOsVersion($ua['osVersion']);
		$event->setDeviceType($ua['deviceType']);
		$event->setIsBot($ua['isBot']);
		$event->setCountry($geo['country']);
		$event->setRegion($geo['region']);
		$event->setOutcome($outcome);
		$this->events->dispatchTyped(new BeforeClickRecordedEvent($event));
		$this->clicks->insert($event);
	}

	/** @return array<string,mixed> */
	public function overview(int $from, int $to): array {
		$uid = $this->policy->currentUid();
		$now = $this->time->getTime();
		$from = max(0, $from);
		$to = max($from, min($to, $now));
		$overview = $this->stats->overview($uid, $from, $to, $now);
		$overview['from'] = $from;
		$overview['to'] = $to;
		return $overview;
	}

	/** @return array<string,mixed> */
	public function forLink(int $id, int $from, int $to, string $granularity = 'day', bool $compare = true): array {
		$link = $this->link($id);
		$this->policy->requireView($link);
		$from = max(0, $from);
		$to = max($from, min($to, $this->time->getTime()));
		$fromDay = gmdate('Y-m-d', $from);
		$toDay = gmdate('Y-m-d', $to);
		$dimensions = [];
		foreach (['referrer', 'browser', 'os', 'device', 'country', 'region', 'bot', 'authentication'] as $dimension) {
			$dimensions[$dimension] = $this->stats->dimensionForLink($id, $fromDay, $toDay, $dimension);
		}
		$timeSeries = $granularity === 'hour'
			? $this->hourlySeries($id, $from, $to)
			: $this->series->groupDaily($this->stats->daily($id, $fromDay, $toDay), $granularity);
		$totalClicks = array_sum(array_column($timeSeries, 'clicks'));
		$comparison = null;
		if ($compare) {
			$duration = max(1, $to - $from + 1);
			$previousTo = max(0, $from - 1);
			$previousFrom = max(0, $previousTo - $duration + 1);
			$previousRows = $this->stats->daily($id, gmdate('Y-m-d', $previousFrom), gmdate('Y-m-d', $previousTo));
			$previousClicks = array_sum(array_column($previousRows, 'clicks'));
			$comparison = ['from' => $previousFrom, 'to' => $previousTo, 'clicks' => $previousClicks, 'changePercent' => $previousClicks === 0 ? null : round((($totalClicks - $previousClicks) / $previousClicks) * 100, 1)];
		}
		return ['linkId' => $id, 'from' => $from, 'to' => $to, 'granularity' => $granularity, 'totalClicks' => $totalClicks, 'lifetimeClicks' => $link->getClickCount(), 'uniqueVisitors' => $this->stats->uniqueVisitorsForLink($id, $from, $to), 'timeSeries' => $timeSeries, 'dimensions' => $dimensions, 'comparison' => $comparison];
	}

	/** @return array{filename:string,mimeType:string,content:string} */
	public function exportForLink(int $id, int $from, int $to, string $format, string $granularity = 'day'): array {
		$data = $this->forLink($id, $from, $to, $granularity);
		if ($format === 'json') {
			return ['filename' => 'shortlink-' . $id . '-statistics.json', 'mimeType' => 'application/json', 'content' => json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)];
		}
		if ($format !== 'csv') {
			throw new ValidationException('Statistics export format must be csv or json', ['format' => 'invalid']);
		}
		$stream = fopen('php://temp', 'w+');
		if ($stream === false) {
			throw new \RuntimeException('Could not create statistics export');
		}
		fputcsv($stream, ['section', 'period_or_dimension', 'value', 'clicks', 'unique_visitors']);
		foreach ((array)$data['timeSeries'] as $row) {
			fputcsv($stream, ['time_series', $this->csvSafe((string)$row['day']), 'all', (int)$row['clicks'], (int)$row['uniqueVisitors']]);
		}
		foreach ((array)$data['dimensions'] as $dimension => $rows) {
			foreach ((array)$rows as $row) {
				fputcsv($stream, ['dimension', $this->csvSafe((string)$dimension), $this->csvSafe((string)$row['value']), (int)$row['clicks'], (int)$row['uniqueVisitors']]);
			}
		}
		rewind($stream);
		$content = stream_get_contents($stream);
		fclose($stream);
		return ['filename' => 'shortlink-' . $id . '-statistics.csv', 'mimeType' => 'text/csv; charset=utf-8', 'content' => $content === false ? '' : $content];
	}

	private function csvSafe(string $value): string {
		return preg_match('/^[=+\-@\t\r]/', $value) === 1 ? "'" . $value : $value;
	}

	/** @return list<array{day:string,value:string,clicks:int,uniqueVisitors:int}> */
	private function hourlySeries(int $id, int $from, int $to): array {
		if ($to - $from > 7 * 86400) {
			throw new ValidationException('Hourly statistics are limited to seven days', ['granularity' => 'range_too_large']);
		}
		$buckets = [];
		$offset = 0;
		do {
			$events = $this->clicks->findForLink($id, $from, $to, 5000, $offset);
			foreach ($events as $event) {
				$key = gmdate('Y-m-d\\TH:00:00\\Z', $event->getClickedAt());
				$buckets[$key] ??= ['day' => $key, 'value' => 'all', 'clicks' => 0, 'visitors' => []];
				++$buckets[$key]['clicks'];
				if ($event->getVisitorHash() !== null && $event->getVisitorHash() !== '') {
					$buckets[$key]['visitors'][$event->getVisitorHash()] = true;
				}
			}
			$offset += count($events);
			if ($offset >= 100000 && count($events) === 5000) {
				throw new ValidationException('Hourly statistics contain too many events; use daily granularity', ['granularity' => 'too_many_events']);
			}
		} while (count($events) === 5000);
		ksort($buckets);
		return array_values(array_map(static fn (array $bucket): array => ['day' => $bucket['day'], 'value' => 'all', 'clicks' => $bucket['clicks'], 'uniqueVisitors' => count($bucket['visitors'])], $buckets));
	}

	/** @return array{items:list<array<string,mixed>>,pagination:array<string,int>} */
	public function clickLog(int $id, int $from, int $to, int $page, int $perPage, ?bool $bot = null): array {
		$link = $this->link($id);
		$this->policy->requireView($link);
		if ($this->settings->string('privacy_mode') === 'counts') {
			return ['items' => [], 'pagination' => ['page' => 1, 'perPage' => max(1, min(200, $perPage)), 'hasMore' => 0]];
		}
		$perPage = max(1, min(200, $perPage));
		$page = max(1, $page);
		$items = $this->clicks->findForLink($id, $from, $to, $perPage + 1, ($page - 1) * $perPage, true, $bot);
		$hasMore = count($items) > $perPage;
		$showUsers = $this->settings->bool('log_authenticated_users');
		$serialized = array_map(static function (ClickEvent $event) use ($showUsers): array {
			$row = $event->toArray();
			if (!$showUsers) {
				$row['userUid'] = null;
			}
			return $row;
		}, array_slice($items, 0, $perPage));
		return ['items' => $serialized, 'pagination' => ['page' => $page, 'perPage' => $perPage, 'hasMore' => $hasMore ? 1 : 0]];
	}

	public function aggregateDay(string $day): int {
		$from = strtotime($day . ' 00:00:00 UTC');
		if ($from === false) {
			return 0;
		} $to = $from + 86400;
		$offset = 0;
		$buckets = [];
		do {
			$rows = $this->stats->eventsForDay($from, $to, 5000, $offset);
			foreach ($rows as $row) {
				$linkId = (int)$row['link_id'];
				$visitor = (string)($row['visitor_hash'] ?? '');
				$dimensions = ['total' => 'all'];
				if (($row['outcome'] ?? '') !== 'counted') {
					$dimensions += ['referrer' => (string)($row['referrer_domain'] ?? '(direct)'), 'browser' => (string)$row['browser'], 'os' => (string)$row['os'], 'device' => (string)$row['device_type'], 'country' => (string)($row['country'] ?? 'Unknown'), 'region' => (string)($row['region'] ?? 'Unknown'), 'bot' => ((bool)$row['is_bot'] ? 'bot' : 'human'), 'authentication' => ($row['user_uid'] === null ? 'anonymous' : 'authenticated')];
				}
				foreach ($dimensions as $dimension => $value) {
					$key = $linkId . '|' . $dimension . '|' . str_replace('|', '/', $value);
					$buckets[$key] ??= ['clicks' => 0, 'visitors' => []];
					++$buckets[$key]['clicks'];
					if ($visitor !== '') {
						$buckets[$key]['visitors'][$visitor] = true;
					}
				}
			}
			$offset += count($rows);
		} while (count($rows) === 5000);
		$this->stats->replaceDay($day, $buckets);
		return $offset;
	}

	/** @return array{clicks:int,audit:int,aggregates:int,trash:int} */
	public function cleanup(\OCA\Shortlinks\Db\AuditLogMapper $audit): array {
		$now = $this->time->getTime();
		$clicks = $this->clicks->deleteOlderThan($now - $this->settings->int('click_retention_days') * 86400, 10000);
		$auditCount = $audit->deleteOlderThan($now - $this->settings->int('audit_retention_days') * 86400, 10000);
		$aggregates = $this->stats->deleteAggregatesBefore(gmdate('Y-m-d', $now - $this->settings->int('aggregate_retention_days') * 86400));
		$trash = $this->links->hardDeleteOlderThan($now - $this->settings->int('trash_retention_days') * 86400, 1000);
		return compact('clicks', 'aggregates', 'trash') + ['audit' => $auditCount];
	}

	private function link(int $id): ShortLink {
		try {
			return $this->links->find($id);
		} catch (DoesNotExistException) {
			throw new NotFoundException();
		}
	}
}
