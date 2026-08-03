<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<LinkPageVersion> */
final class LinkPageVersionMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_page_versions', LinkPageVersion::class);
	}

	/** @return list<LinkPageVersion> */
	public function findForPage(int $pageId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)
			->where($qb->expr()->eq('page_id', $qb->createNamedParameter($pageId, IQueryBuilder::PARAM_INT)))
			->orderBy('version_number', 'DESC');
		/** @var list<LinkPageVersion> */
		return $this->findEntities($qb);
	}

	/** @throws DoesNotExistException */
	public function findVersion(int $pageId, int $versionNumber): LinkPageVersion {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)
			->where($qb->expr()->eq('page_id', $qb->createNamedParameter($pageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('version_number', $qb->createNamedParameter($versionNumber, IQueryBuilder::PARAM_INT)));
		/** @var LinkPageVersion */
		return $this->findEntity($qb);
	}

	public function maxVersion(int $pageId): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->max('version_number'))->from($this->tableName)
			->where($qb->expr()->eq('page_id', $qb->createNamedParameter($pageId, IQueryBuilder::PARAM_INT)));
		return (int)($qb->executeQuery()->fetchOne() ?: 0);
	}

	public function deleteAfter(int $pageId, int $versionNumber): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->tableName)
			->where($qb->expr()->eq('page_id', $qb->createNamedParameter($pageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->gt('version_number', $qb->createNamedParameter($versionNumber, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}

	public function deleteForPage(int $pageId): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->tableName)
			->where($qb->expr()->eq('page_id', $qb->createNamedParameter($pageId, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}
}
