<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<Folder> */
final class FolderMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_folders', Folder::class);
	}

	/** @throws DoesNotExistException */
	public function findForOwner(int $id, string $ownerUid): Folder {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)));
		/** @var Folder */
		return $this->findEntity($qb);
	}

	/** @return list<Folder> */
	public function findAllForOwner(string $ownerUid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->orderBy('position', 'ASC')->addOrderBy('name', 'ASC');
		/** @var list<Folder> */
		return $this->findEntities($qb);
	}

	public function countLinks(int $folderId, string $ownerUid): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('id', 'count'))->from('shortlinks_links')->where($qb->expr()->eq('folder_id', $qb->createNamedParameter($folderId, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->andWhere($qb->expr()->isNull('deleted_at'));
		return (int)$qb->executeQuery()->fetchOne();
	}

	public function detachLinks(int $folderId, bool $delete, int $now): void {
		$qb = $this->db->getQueryBuilder();
		$qb->update('shortlinks_links')->where($qb->expr()->eq('folder_id', $qb->createNamedParameter($folderId, IQueryBuilder::PARAM_INT)));
		if ($delete) {
			$qb->set('deleted_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT));
		} else {
			$qb->set('folder_id', $qb->createNamedParameter(null, IQueryBuilder::PARAM_NULL));
		}
		$qb->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))->executeStatement();
	}

	public function deleteById(int $id): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))->executeStatement();
	}

	public function updatePositionForOwner(int $id, string $ownerUid, int $position): void {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName)
			->set('position', $qb->createNamedParameter($position, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))
			->executeStatement();
	}
}
