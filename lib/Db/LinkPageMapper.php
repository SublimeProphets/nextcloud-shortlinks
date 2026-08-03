<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<LinkPage> */
final class LinkPageMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_pages', LinkPage::class);
	}

	/** @throws DoesNotExistException */
	public function find(int $id): LinkPage {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		/** @var LinkPage */
		return $this->findEntity($qb);
	}

	/** @throws DoesNotExistException */
	public function findBySlug(string $slug): LinkPage {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('slug_hash', $qb->createNamedParameter(hash('sha256', $slug))));
		/** @var LinkPage */
		return $this->findEntity($qb);
	}

	public function slugExists(string $slug, ?int $exceptId = null): bool {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('id', 'count'))->from($this->tableName)->where($qb->expr()->eq('slug_hash', $qb->createNamedParameter(hash('sha256', $slug))));
		if ($exceptId !== null) {
			$qb->andWhere($qb->expr()->neq('id', $qb->createNamedParameter($exceptId, IQueryBuilder::PARAM_INT)));
		}
		return (int)$qb->executeQuery()->fetchOne() > 0;
	}

	/** @return list<LinkPage> */
	public function findForOwner(string $ownerUid, string $filter, int $limit, int $offset): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)));
		if ($filter === 'trash') {
			$qb->andWhere($qb->expr()->isNotNull('deleted_at'));
		} else {
			$qb->andWhere($qb->expr()->isNull('deleted_at'));
		}
		if ($filter === 'public') {
			$qb->andWhere($qb->expr()->eq('access_mode', $qb->createNamedParameter('public')));
		} elseif ($filter === 'protected') {
			$qb->andWhere($qb->expr()->in('access_mode', $qb->createNamedParameter(['password', 'restricted'], IQueryBuilder::PARAM_STR_ARRAY)));
		} elseif ($filter === 'inactive') {
			$qb->andWhere($qb->expr()->eq('is_active', $qb->createNamedParameter(false, IQueryBuilder::PARAM_BOOL)));
		}
		$qb->orderBy('updated_at', 'DESC')->setMaxResults($limit)->setFirstResult($offset);
		/** @var list<LinkPage> */
		return $this->findEntities($qb);
	}
}
