<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ClickEvent;
use OCA\Shortlinks\Db\ClickEventMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\StatsMapper;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Event\BeforeClickRecordedEvent;
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
		if (!$this->settings->bool('stats_enabled') || $this->settings->string('privacy_mode') === 'counts') {
			return;
		}
		if ($this->settings->bool('respect_dnt') && ($request->getHeader('DNT') === '1' || $request->getHeader('Sec-GPC') === '1')) {
			return;
		}
		$now = $this->time->getTime();
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
		$overview = $this->stats->overview($uid);
		$overview['from'] = $from;
		$overview['to'] = $to;
		return $overview;
	}

	/** @return array<string,mixed> */
	public function forLink(int $id, int $from, int $to): array {
		$link = $this->link($id);
		$this->policy->requireView($link);
		$from = max(0, $from);
		$to = max($from, $to);
		$fromDay = gmdate('Y-m-d', $from);
		$toDay = gmdate('Y-m-d', $to);
		$dimensions = [];
		foreach (['referrer', 'browser', 'os', 'device', 'country', 'region', 'bot', 'authentication'] as $dimension) {
			$dimensions[$dimension] = $this->stats->daily($id, $fromDay, $toDay, $dimension);
		}
		return ['linkId' => $id, 'from' => $from, 'to' => $to, 'totalClicks' => $link->getClickCount(), 'timeSeries' => $this->stats->daily($id, $fromDay, $toDay), 'dimensions' => $dimensions];
	}

	/** @return array{items:list<array<string,mixed>>,pagination:array<string,int>} */
	public function clickLog(int $id, int $from, int $to, int $page, int $perPage): array {
		$link = $this->link($id);
		$this->policy->requireView($link);
		$perPage = max(1, min(200, $perPage));
		$page = max(1, $page);
		$items = $this->clicks->findForLink($id, $from, $to, $perPage + 1, ($page - 1) * $perPage);
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
				$dimensions = ['total' => 'all', 'referrer' => (string)($row['referrer_domain'] ?? '(direct)'), 'browser' => (string)$row['browser'], 'os' => (string)$row['os'], 'device' => (string)$row['device_type'], 'country' => (string)($row['country'] ?? 'Unknown'), 'region' => (string)($row['region'] ?? 'Unknown'), 'bot' => ((bool)$row['is_bot'] ? 'bot' : 'human'), 'authentication' => ($row['user_uid'] === null ? 'anonymous' : 'authenticated')];
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
