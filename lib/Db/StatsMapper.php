<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

final class StatsMapper {
	public function __construct(
		private readonly IDBConnection $db,
	) {
	}

	/**
	 * Return bounded, privacy-safe activity signals used for ranking links.
	 *
	 * @param list<int> $linkIds
	 * @return array<int,array{last24:int,last7:int,previous7:int,last30:int}>
	 */
	public function rankingSignals(array $linkIds, int $now): array {
		$linkIds = array_values(array_unique(array_filter(array_map('intval', $linkIds), static fn (int $id): bool => $id > 0)));
		$signals = [];
		foreach ($linkIds as $id) {
			$signals[$id] = ['last24' => 0, 'last7' => 0, 'previous7' => 0, 'last30' => 0];
		}
		$periods = [
			'last24' => [$now - 86400, $now],
			'last7' => [$now - 7 * 86400, $now],
			'previous7' => [$now - 14 * 86400, $now - 7 * 86400],
			'last30' => [$now - 30 * 86400, $now],
		];
		foreach (array_chunk($linkIds, 500) as $chunk) {
			foreach ($periods as $key => [$from, $to]) {
				$qb = $this->db->getQueryBuilder();
				$qb->select('link_id')->selectAlias($qb->func()->count('id'), 'clicks')
					->from('shortlinks_clicks')
					->where($qb->expr()->in('link_id', $qb->createNamedParameter($chunk, IQueryBuilder::PARAM_INT_ARRAY)))
					->andWhere($qb->expr()->gte('clicked_at', $qb->createNamedParameter(max(0, $from), IQueryBuilder::PARAM_INT)))
					->andWhere($qb->expr()->lt('clicked_at', $qb->createNamedParameter(max(0, $to), IQueryBuilder::PARAM_INT)))
					->groupBy('link_id');
				$result = $qb->executeQuery();
				while (($row = $result->fetch()) !== false) {
					$signals[(int)$row['link_id']][$key] = (int)$row['clicks'];
				}
				$result->closeCursor();
			}
		}
		return $signals;
	}

	/** @return array<string,mixed> */
	public function overview(string $ownerUid, int $from, int $to, int $now): array {
		$qb = $this->db->getQueryBuilder();
		$qb->selectAlias($qb->func()->sum('click_count'), 'total_clicks')->addSelect($qb->func()->count('id', 'total_links'))->from('shortlinks_links')->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->andWhere($qb->expr()->isNull('deleted_at'));
		$row = $qb->executeQuery()->fetch() ?: [];
		$active = $this->db->getQueryBuilder();
		$active->select($active->func()->count('id', 'count'))->from('shortlinks_links')->where($active->expr()->eq('owner_uid', $active->createNamedParameter($ownerUid)))->andWhere($active->expr()->eq('is_active', $active->createNamedParameter(true, IQueryBuilder::PARAM_BOOL)))->andWhere($active->expr()->isNull('deleted_at'));
		return [
			'totalLinks' => (int)($row['total_links'] ?? 0),
			'activeLinks' => (int)$active->executeQuery()->fetchOne(),
			'totalClicks' => (int)($row['total_clicks'] ?? 0),
			'uniqueVisitors' => $this->uniqueVisitors($ownerUid, $from, $to),
			'clicksToday' => $this->countClicks($ownerUid, $now - ($now % 86400), $now),
			'clicks7Days' => $this->countClicks($ownerUid, $now - 7 * 86400, $now),
			'clicks30Days' => $this->countClicks($ownerUid, $now - 30 * 86400, $now),
			'periodClicks' => $this->countClicks($ownerUid, $from, $to),
			'topLinks' => $this->rankedLinks($ownerUid, 'DESC'),
			'leastUsedLinks' => $this->rankedLinks($ownerUid, 'ASC'),
			'newestLinks' => $this->newestLinks($ownerUid),
			'dimensions' => [
				'referrer' => $this->topDimension($ownerUid, 'referrer', $from, $to),
				'country' => $this->topDimension($ownerUid, 'country', $from, $to),
				'region' => $this->topDimension($ownerUid, 'region', $from, $to),
				'browser' => $this->topDimension($ownerUid, 'browser', $from, $to),
				'os' => $this->topDimension($ownerUid, 'os', $from, $to),
				'device' => $this->topDimension($ownerUid, 'device', $from, $to),
				'authentication' => $this->topDimension($ownerUid, 'authentication', $from, $to),
				'bot' => $this->topDimension($ownerUid, 'bot', $from, $to),
			],
		];
	}

	private function uniqueVisitors(string $ownerUid, int $from, int $to): int {
		$qb = $this->db->getQueryBuilder();
		$qb->selectDistinct('c.visitor_hash')->from('shortlinks_clicks', 'c')
			->innerJoin('c', 'shortlinks_links', 'l', $qb->expr()->eq('l.id', 'c.link_id'))
			->where($qb->expr()->eq('l.owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->gte('c.clicked_at', $qb->createNamedParameter(max(0, $from), IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->lte('c.clicked_at', $qb->createNamedParameter(max($from, $to), IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->isNotNull('c.visitor_hash'))
			->andWhere($qb->expr()->neq('c.visitor_hash', $qb->createNamedParameter('')));
		$result = $qb->executeQuery();
		$count = 0;
		while ($result->fetchOne() !== false) {
			++$count;
		}
		$result->closeCursor();
		return $count;
	}

	/** @return list<array{value:string,clicks:int}> */
	private function topDimension(string $ownerUid, string $dimension, int $from, int $to): array {
		$qb = $this->db->getQueryBuilder();
		$qb->selectAlias($qb->func()->sum('d.clicks'), 'clicks')
			->addSelect('d.dimension_value')
			->from('shortlinks_daily_stats', 'd')
			->innerJoin('d', 'shortlinks_links', 'l', $qb->expr()->eq('l.id', 'd.link_id'))
			->where($qb->expr()->eq('l.owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->eq('d.dimension', $qb->createNamedParameter($dimension)))
			->andWhere($qb->expr()->gte('d.day', $qb->createNamedParameter(gmdate('Y-m-d', max(0, $from)))))
			->andWhere($qb->expr()->lte('d.day', $qb->createNamedParameter(gmdate('Y-m-d', max($from, $to)))))
			->groupBy('d.dimension_value')
			->orderBy('clicks', 'DESC')
			->setMaxResults(10);
		$result = $qb->executeQuery();
		$rows = [];
		while (($row = $result->fetch()) !== false) {
			$rows[] = ['value' => (string)$row['dimension_value'], 'clicks' => (int)$row['clicks']];
		}
		$result->closeCursor();
		return $rows;
	}

	private function countClicks(string $ownerUid, int $from, int $to): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('c.id', 'count'))->from('shortlinks_clicks', 'c')
			->innerJoin('c', 'shortlinks_links', 'l', $qb->expr()->eq('l.id', 'c.link_id'))
			->where($qb->expr()->eq('l.owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->gte('c.clicked_at', $qb->createNamedParameter(max(0, $from), IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->lte('c.clicked_at', $qb->createNamedParameter(max($from, $to), IQueryBuilder::PARAM_INT)));
		return (int)$qb->executeQuery()->fetchOne();
	}

	/** @return list<array<string,mixed>> */
	private function rankedLinks(string $ownerUid, string $direction): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('id', 'slug', 'title', 'click_count')->from('shortlinks_links')
			->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->isNull('deleted_at'))
			->orderBy('click_count', $direction)->addOrderBy('updated_at', 'DESC')->setMaxResults(10);
		return $this->linkRows($qb);
	}

	/** @return list<array<string,mixed>> */
	private function newestLinks(string $ownerUid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('id', 'slug', 'title', 'click_count')->from('shortlinks_links')
			->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->isNull('deleted_at'))
			->orderBy('created_at', 'DESC')->setMaxResults(10);
		return $this->linkRows($qb);
	}

	/** @return list<array<string,mixed>> */
	private function linkRows(IQueryBuilder $qb): array {
		$result = $qb->executeQuery();
		$rows = [];
		while (($row = $result->fetch()) !== false) {
			$rows[] = ['id' => (int)$row['id'], 'slug' => (string)$row['slug'], 'title' => (string)$row['title'], 'clicks' => (int)$row['click_count']];
		}
		$result->closeCursor();
		return $rows;
	}

	/** @return list<array<string,mixed>> */
	public function daily(int $linkId, string $fromDay, string $toDay, string $dimension = 'total'): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('day', 'dimension_value', 'clicks', 'unique_visitors')->from('shortlinks_daily_stats')->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('dimension', $qb->createNamedParameter($dimension)))->andWhere($qb->expr()->gte('day', $qb->createNamedParameter($fromDay)))->andWhere($qb->expr()->lte('day', $qb->createNamedParameter($toDay)))->orderBy('day', 'ASC')->addOrderBy('clicks', 'DESC');
		$result = $qb->executeQuery();
		$rows = [];
		while (($row = $result->fetch()) !== false) {
			$rows[] = ['day' => (string)$row['day'], 'value' => (string)$row['dimension_value'], 'clicks' => (int)$row['clicks'], 'uniqueVisitors' => (int)$row['unique_visitors']];
		}
		$result->closeCursor();
		return $rows;
	}

	/** @return list<array{value:string,clicks:int,uniqueVisitors:int}> */
	public function dimensionForLink(int $linkId, string $fromDay, string $toDay, string $dimension): array {
		$qb = $this->db->getQueryBuilder();
		$qb->selectAlias($qb->func()->sum('clicks'), 'clicks')
			->addSelect('dimension_value')
			->from('shortlinks_daily_stats')
			->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('dimension', $qb->createNamedParameter($dimension)))
			->andWhere($qb->expr()->gte('day', $qb->createNamedParameter($fromDay)))
			->andWhere($qb->expr()->lte('day', $qb->createNamedParameter($toDay)))
			->groupBy('dimension_value')
			->orderBy('clicks', 'DESC')
			->setMaxResults(100);
		$result = $qb->executeQuery();
		$rows = [];
		while (($row = $result->fetch()) !== false) {
			$value = (string)$row['dimension_value'];
			$rows[$value] = ['value' => $value, 'clicks' => (int)$row['clicks'], 'uniqueVisitors' => 0];
		}
		$result->closeCursor();
		$unique = $this->db->getQueryBuilder();
		$unique->selectAlias($unique->func()->sum('unique_visitors'), 'unique_visitors')
			->addSelect('dimension_value')
			->from('shortlinks_daily_stats')
			->where($unique->expr()->eq('link_id', $unique->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
			->andWhere($unique->expr()->eq('dimension', $unique->createNamedParameter($dimension)))
			->andWhere($unique->expr()->gte('day', $unique->createNamedParameter($fromDay)))
			->andWhere($unique->expr()->lte('day', $unique->createNamedParameter($toDay)))
			->groupBy('dimension_value')
			->setMaxResults(100);
		$uniqueResult = $unique->executeQuery();
		while (($row = $uniqueResult->fetch()) !== false) {
			$value = (string)$row['dimension_value'];
			if (isset($rows[$value])) {
				$rows[$value]['uniqueVisitors'] = (int)$row['unique_visitors'];
			}
		}
		$uniqueResult->closeCursor();
		return array_values($rows);
	}

	public function uniqueVisitorsForLink(int $linkId, int $from, int $to): int {
		$qb = $this->db->getQueryBuilder();
		$qb->selectDistinct('visitor_hash')->from('shortlinks_clicks')
			->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->gte('clicked_at', $qb->createNamedParameter(max(0, $from), IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->lte('clicked_at', $qb->createNamedParameter(max($from, $to), IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->isNotNull('visitor_hash'))
			->andWhere($qb->expr()->neq('visitor_hash', $qb->createNamedParameter('')));
		$result = $qb->executeQuery();
		$count = 0;
		while ($result->fetchOne() !== false) {
			++$count;
		}
		$result->closeCursor();
		return $count;
	}

	/** @return list<array<string,mixed>> */
	public function eventsForDay(int $from, int $to, int $limit, int $offset): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('link_id', 'visitor_hash', 'referrer_domain', 'browser', 'os', 'device_type', 'country', 'region', 'is_bot', 'user_uid', 'outcome')->from('shortlinks_clicks')->where($qb->expr()->gte('clicked_at', $qb->createNamedParameter($from, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->lt('clicked_at', $qb->createNamedParameter($to, IQueryBuilder::PARAM_INT)))->orderBy('id', 'ASC')->setMaxResults($limit)->setFirstResult($offset);
		$result = $qb->executeQuery();
		$rows = [];
		while (($row = $result->fetch()) !== false) {
			$rows[] = $row;
		}
		$result->closeCursor();
		return $rows;
	}

	/** @param array<string,array{clicks:int,visitors:array<string,true>}> $buckets */
	public function replaceDay(string $day, array $buckets): void {
		$this->db->beginTransaction();
		try {
			$delete = $this->db->getQueryBuilder();
			$delete->delete('shortlinks_daily_stats')->where($delete->expr()->eq('day', $delete->createNamedParameter($day)))->executeStatement();
			foreach ($buckets as $key => $bucket) {
				[$linkId, $dimension, $value] = explode('|', $key, 3);
				$qb = $this->db->getQueryBuilder();
				$qb->insert('shortlinks_daily_stats')->values(['link_id' => $qb->createNamedParameter((int)$linkId, IQueryBuilder::PARAM_INT), 'day' => $qb->createNamedParameter($day), 'dimension' => $qb->createNamedParameter($dimension), 'dimension_value' => $qb->createNamedParameter(substr($value, 0, 255)), 'clicks' => $qb->createNamedParameter($bucket['clicks'], IQueryBuilder::PARAM_INT), 'unique_visitors' => $qb->createNamedParameter(count($bucket['visitors']), IQueryBuilder::PARAM_INT)])->executeStatement();
			}
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
	}

	public function deleteAggregatesBefore(string $day): int {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('shortlinks_daily_stats')->where($qb->expr()->lt('day', $qb->createNamedParameter($day)));
		return $qb->executeStatement();
	}
}
