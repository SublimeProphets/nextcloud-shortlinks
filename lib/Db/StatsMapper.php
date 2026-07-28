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

	/** @return array{totalLinks:int,activeLinks:int,totalClicks:int} */
	public function overview(string $ownerUid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->selectAlias($qb->func()->sum('click_count'), 'total_clicks')->addSelect($qb->func()->count('id', 'total_links'))->from('shortlinks_links')->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->andWhere($qb->expr()->isNull('deleted_at'));
		$row = $qb->executeQuery()->fetch() ?: [];
		$active = $this->db->getQueryBuilder();
		$active->select($active->func()->count('id', 'count'))->from('shortlinks_links')->where($active->expr()->eq('owner_uid', $active->createNamedParameter($ownerUid)))->andWhere($active->expr()->eq('is_active', $active->createNamedParameter(true, IQueryBuilder::PARAM_BOOL)))->andWhere($active->expr()->isNull('deleted_at'));
		return ['totalLinks' => (int)($row['total_links'] ?? 0), 'activeLinks' => (int)$active->executeQuery()->fetchOne(), 'totalClicks' => (int)($row['total_clicks'] ?? 0)];
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

	/** @return list<array<string,mixed>> */
	public function eventsForDay(int $from, int $to, int $limit, int $offset): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('link_id', 'visitor_hash', 'referrer_domain', 'browser', 'os', 'device_type', 'country', 'region', 'is_bot', 'user_uid')->from('shortlinks_clicks')->where($qb->expr()->gte('clicked_at', $qb->createNamedParameter($from, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->lt('clicked_at', $qb->createNamedParameter($to, IQueryBuilder::PARAM_INT)))->orderBy('id', 'ASC')->setMaxResults($limit)->setFirstResult($offset);
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
		$delete = $this->db->getQueryBuilder();
		$delete->delete('shortlinks_daily_stats')->where($delete->expr()->eq('day', $delete->createNamedParameter($day)))->executeStatement();
		foreach ($buckets as $key => $bucket) {
			[$linkId, $dimension, $value] = explode('|', $key, 3);
			$qb = $this->db->getQueryBuilder();
			$qb->insert('shortlinks_daily_stats')->values(['link_id' => $qb->createNamedParameter((int)$linkId, IQueryBuilder::PARAM_INT), 'day' => $qb->createNamedParameter($day), 'dimension' => $qb->createNamedParameter($dimension), 'dimension_value' => $qb->createNamedParameter(substr($value, 0, 255)), 'clicks' => $qb->createNamedParameter($bucket['clicks'], IQueryBuilder::PARAM_INT), 'unique_visitors' => $qb->createNamedParameter(count($bucket['visitors']), IQueryBuilder::PARAM_INT)])->executeStatement();
		}
	}

	public function deleteAggregatesBefore(string $day): int {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('shortlinks_daily_stats')->where($qb->expr()->lt('day', $qb->createNamedParameter($day)));
		return $qb->executeStatement();
	}
}
