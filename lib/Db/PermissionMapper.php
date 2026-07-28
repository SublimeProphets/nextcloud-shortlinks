<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<Permission> */
final class PermissionMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_permissions', Permission::class);
	}

	/** @return list<Permission> */
	public function findForLink(int $linkId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->orderBy('principal_type', 'ASC')->addOrderBy('principal_id', 'ASC');
		/** @var list<Permission> */
		return $this->findEntities($qb);
	}

	/** @param list<string> $groups */
	public function permissionFor(int $linkId, string $uid, array $groups): ?string {
		$qb = $this->db->getQueryBuilder();
		$conditions = [$qb->expr()->andX($qb->expr()->eq('principal_type', $qb->createNamedParameter('user')), $qb->expr()->eq('principal_id', $qb->createNamedParameter($uid)))];
		if ($groups !== []) {
			$conditions[] = $qb->expr()->andX($qb->expr()->eq('principal_type', $qb->createNamedParameter('group')), $qb->expr()->in('principal_id', $qb->createNamedParameter($groups, IQueryBuilder::PARAM_STR_ARRAY)));
		}
		$qb->select('permission')->from($this->tableName)->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->orX(...$conditions))->orderBy('permission', 'ASC');
		$qb->andWhere($qb->expr()->eq('purpose', $qb->createNamedParameter('management')));
		$value = $qb->executeQuery()->fetchOne();
		return $value === false ? null : (string)$value;
	}

	/** @param list<string> $groups */
	public function hasRedirectAccess(int $linkId, string $mode, string $uid, array $groups): bool {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('id', 'count'))
			->from($this->tableName)
			->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('purpose', $qb->createNamedParameter('access')));
		if ($mode === 'users') {
			$qb->andWhere($qb->expr()->eq('principal_type', $qb->createNamedParameter('user')))
				->andWhere($qb->expr()->eq('principal_id', $qb->createNamedParameter($uid)));
		} elseif ($mode === 'groups' && $groups !== []) {
			$qb->andWhere($qb->expr()->eq('principal_type', $qb->createNamedParameter('group')))
				->andWhere($qb->expr()->in('principal_id', $qb->createNamedParameter($groups, IQueryBuilder::PARAM_STR_ARRAY)));
		} else {
			return false;
		}
		return (int)$qb->executeQuery()->fetchOne() > 0;
	}

	public function deleteForLink(int $linkId): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->tableName)->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->executeStatement();
	}

	public function findOne(int $id, int $linkId): ?Permission {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)));
		try {
			/** @var Permission */
			return $this->findEntity($qb);
		} catch (\OCP\AppFramework\Db\DoesNotExistException) {
			return null;
		}
	}
}
