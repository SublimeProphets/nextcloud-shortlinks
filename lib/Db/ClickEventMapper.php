<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<ClickEvent> */
final class ClickEventMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_clicks', ClickEvent::class);
	}

	/** @return list<ClickEvent> */
	public function findForLink(int $linkId, int $from, int $to, int $limit, int $offset): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->gte('clicked_at', $qb->createNamedParameter($from, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->lte('clicked_at', $qb->createNamedParameter($to, IQueryBuilder::PARAM_INT)))->orderBy('clicked_at', 'DESC')->setMaxResults($limit)->setFirstResult($offset);
		/** @var list<ClickEvent> */
		return $this->findEntities($qb);
	}

	public function deleteOlderThan(int $timestamp, int $limit): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select('id')->from($this->tableName)->where($qb->expr()->lt('clicked_at', $qb->createNamedParameter($timestamp, IQueryBuilder::PARAM_INT)))->setMaxResults($limit);
		$ids = [];
		$result = $qb->executeQuery();
		while (($id = $result->fetchOne()) !== false) {
			$ids[] = (int)$id;
		}
		$result->closeCursor();
		if ($ids === []) {
			return 0;
		}
		$delete = $this->db->getQueryBuilder();
		$delete->delete($this->tableName)->where($delete->expr()->in('id', $delete->createNamedParameter($ids, IQueryBuilder::PARAM_INT_ARRAY)));
		return $delete->executeStatement();
	}
}
