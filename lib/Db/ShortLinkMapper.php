<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<ShortLink> */
final class ShortLinkMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_links', ShortLink::class);
	}

	/** @throws DoesNotExistException */
	public function find(int $id): ShortLink {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		/** @var ShortLink */
		return $this->findEntity($qb);
	}

	/** @throws DoesNotExistException */
	public function findBySlug(string $slug): ShortLink {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('slug_hash', $qb->createNamedParameter(hash('sha256', $slug))));
		/** @var ShortLink */
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

	public function countForOwner(string $ownerUid): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('id', 'count'))->from($this->tableName)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->andWhere($qb->expr()->isNull('deleted_at'));
		return (int)$qb->executeQuery()->fetchOne();
	}

	/** @return list<ShortLink> */
	public function findOwnedByFolder(int $folderId, string $ownerUid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)
			->where($qb->expr()->eq('folder_id', $qb->createNamedParameter($folderId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))
			->andWhere($qb->expr()->isNull('deleted_at'))
			->orderBy('created_at', 'ASC');
		/** @var list<ShortLink> */
		return $this->findEntities($qb);
	}

	public function purgeRelations(int $linkId): void {
		foreach (['shortlinks_link_tags', 'shortlinks_permissions', 'shortlinks_clicks', 'shortlinks_daily_stats'] as $table) {
			$qb = $this->db->getQueryBuilder();
			$qb->delete($table)
				->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
				->executeStatement();
		}
		$qb = $this->db->getQueryBuilder();
		$qb->update('shortlinks_audit')
			->set('link_id', $qb->createNamedParameter(null, IQueryBuilder::PARAM_NULL))
			->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}

	public function findOwnerTarget(string $ownerUid, string $targetHash, ?int $exceptId = null): ?ShortLink {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->andWhere($qb->expr()->eq('target_hash', $qb->createNamedParameter($targetHash)))->andWhere($qb->expr()->isNull('deleted_at'))->setMaxResults(1);
		if ($exceptId !== null) {
			$qb->andWhere($qb->expr()->neq('id', $qb->createNamedParameter($exceptId, IQueryBuilder::PARAM_INT)));
		}
		try {
			/** @var ShortLink */
			return $this->findEntity($qb);
		} catch (DoesNotExistException) {
			return null;
		}
	}

	public function incrementClick(int $id, ?int $limit, int $now): bool {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName)
			->set('click_count', $qb->func()->add('click_count', $qb->createNamedParameter(1, IQueryBuilder::PARAM_INT)))
			->set('last_clicked_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('is_active', $qb->createNamedParameter(true, IQueryBuilder::PARAM_BOOL)))
			->andWhere($qb->expr()->isNull('deleted_at'));
		if ($limit !== null) {
			$qb->andWhere($qb->expr()->lt('click_count', $qb->createNamedParameter($limit, IQueryBuilder::PARAM_INT)));
		}
		return $qb->executeStatement() === 1;
	}

	public function updateWithVersion(ShortLink $link, int $expectedVersion): bool {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName);
		$values = [
			'folder_id' => [$link->getFolderId(), IQueryBuilder::PARAM_INT], 'slug' => [$link->getSlug(), IQueryBuilder::PARAM_STR],
			'slug_hash' => [$link->getSlugHash(), IQueryBuilder::PARAM_STR], 'target_url' => [$link->getTargetUrl(), IQueryBuilder::PARAM_STR],
			'target_hash' => [$link->getTargetHash(), IQueryBuilder::PARAM_STR], 'title' => [$link->getTitle(), IQueryBuilder::PARAM_STR],
			'description' => [$link->getDescription(), IQueryBuilder::PARAM_STR], 'is_favorite' => [$link->getIsFavorite(), IQueryBuilder::PARAM_BOOL],
			'is_active' => [$link->getIsActive(), IQueryBuilder::PARAM_BOOL], 'access_mode' => [$link->getAccessMode(), IQueryBuilder::PARAM_STR],
			'password_hash' => [$link->getPasswordHash(), IQueryBuilder::PARAM_STR], 'redirect_status' => [$link->getRedirectStatus(), IQueryBuilder::PARAM_INT],
			'starts_at' => [$link->getStartsAt(), IQueryBuilder::PARAM_INT], 'expires_at' => [$link->getExpiresAt(), IQueryBuilder::PARAM_INT],
			'click_limit' => [$link->getClickLimit(), IQueryBuilder::PARAM_INT], 'updated_at' => [$link->getUpdatedAt(), IQueryBuilder::PARAM_INT],
			'deleted_at' => [$link->getDeletedAt(), IQueryBuilder::PARAM_INT], 'entity_version' => [$link->getEntityVersion(), IQueryBuilder::PARAM_INT],
		];
		foreach ($values as $column => [$value, $type]) {
			$qb->set($column, $qb->createNamedParameter($value, $value === null ? IQueryBuilder::PARAM_NULL : $type));
		}
		$qb->where($qb->expr()->eq('id', $qb->createNamedParameter($link->getId(), IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('entity_version', $qb->createNamedParameter($expectedVersion, IQueryBuilder::PARAM_INT)));
		return $qb->executeStatement() === 1;
	}

	public function transferOwner(string $fromUid, string $toUid): int {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName)->set('owner_uid', $qb->createNamedParameter($toUid))->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($fromUid)));
		return $qb->executeStatement();
	}

	/**
	 * @param list<string> $groupIds
	 * @param array<string, mixed> $filters
	 * @return list<ShortLink>
	 */
	public function findVisible(string $uid, array $groupIds, array $filters, int $limit, int $offset, bool $all = false): array {
		$qb = $this->db->getQueryBuilder();
		$qb->selectDistinct('l.*')->from($this->tableName, 'l')
			->leftJoin('l', 'shortlinks_permissions', 'p', $qb->expr()->andX($qb->expr()->eq('p.link_id', 'l.id'), $qb->expr()->eq('p.purpose', $qb->createNamedParameter('management'))));
		$visibility = [$qb->expr()->eq('l.owner_uid', $qb->createNamedParameter($uid)), $qb->expr()->andX(
			$qb->expr()->eq('p.principal_type', $qb->createNamedParameter('user')),
			$qb->expr()->eq('p.principal_id', $qb->createNamedParameter($uid)),
		)];
		if ($groupIds !== []) {
			$visibility[] = $qb->expr()->andX(
				$qb->expr()->eq('p.principal_type', $qb->createNamedParameter('group')),
				$qb->expr()->in('p.principal_id', $qb->createNamedParameter($groupIds, IQueryBuilder::PARAM_STR_ARRAY)),
			);
		}
		if (!$all) {
			$qb->where($qb->expr()->orX(...$visibility));
		}
		$system = (string)($filters['system'] ?? 'all');
		if ($system === 'personal') {
			$qb->andWhere($qb->expr()->eq('l.owner_uid', $qb->createNamedParameter($uid)));
		} elseif ($system === 'shared') {
			$qb->andWhere($qb->expr()->neq('l.owner_uid', $qb->createNamedParameter($uid)));
		}
		$this->applyFilters($qb, $filters);
		$sort = in_array(($filters['sort'] ?? ''), ['created_at', 'updated_at', 'last_clicked_at', 'click_count', 'title', 'slug'], true) ? (string)$filters['sort'] : 'updated_at';
		if ($system === 'recent') {
			$sort = 'created_at';
		} elseif ($system === 'used') {
			$sort = 'last_clicked_at';
		}
		$direction = strtoupper((string)($filters['direction'] ?? 'DESC')) === 'ASC' ? 'ASC' : 'DESC';
		$qb->orderBy('l.' . $sort, $direction)->setMaxResults($limit)->setFirstResult($offset);
		/** @var list<ShortLink> */
		return $this->findEntities($qb);
	}

	/** @param array<string, mixed> $filters */
	private function applyFilters(IQueryBuilder $qb, array $filters): void {
		$system = (string)($filters['system'] ?? 'all');
		if (isset($filters['ownerUid']) && (string)$filters['ownerUid'] !== '') {
			$qb->andWhere($qb->expr()->eq('l.owner_uid', $qb->createNamedParameter((string)$filters['ownerUid'])));
		}
		if ($system === 'trash') {
			$qb->andWhere($qb->expr()->isNotNull('l.deleted_at'));
		} else {
			$qb->andWhere($qb->expr()->isNull('l.deleted_at'));
		}
		if ($system === 'favorites') {
			$qb->andWhere($qb->expr()->eq('l.is_favorite', $qb->createNamedParameter(true, IQueryBuilder::PARAM_BOOL)));
		} elseif ($system === 'inactive') {
			$qb->andWhere($qb->expr()->eq('l.is_active', $qb->createNamedParameter(false, IQueryBuilder::PARAM_BOOL)));
		} elseif ($system === 'expired') {
			$qb->andWhere($qb->expr()->isNotNull('l.expires_at'))->andWhere($qb->expr()->lt('l.expires_at', $qb->createNamedParameter((int)($filters['now'] ?? 0), IQueryBuilder::PARAM_INT)));
		} elseif ($system === 'used') {
			$qb->andWhere($qb->expr()->isNotNull('l.last_clicked_at'));
		}
		$linkIds = array_values(array_slice(array_unique(array_filter(array_map('intval', (array)($filters['linkIds'] ?? [])), static fn (int $id): bool => $id > 0)), 0, 200));
		if ($linkIds !== []) {
			$qb->andWhere($qb->expr()->in('l.id', $qb->createNamedParameter($linkIds, IQueryBuilder::PARAM_INT_ARRAY)));
		}
		$folderIds = array_values(array_slice(array_unique(array_filter(array_map('intval', (array)($filters['folderIds'] ?? [])), static fn (int $id): bool => $id > 0)), 0, 200));
		if ($folderIds !== []) {
			$qb->andWhere($qb->expr()->in('l.folder_id', $qb->createNamedParameter($folderIds, IQueryBuilder::PARAM_INT_ARRAY)));
		} elseif (isset($filters['folderId']) && $filters['folderId'] !== '') {
			$qb->andWhere($qb->expr()->eq('l.folder_id', $qb->createNamedParameter((int)$filters['folderId'], IQueryBuilder::PARAM_INT)));
		}
		if (isset($filters['createdFrom'])) {
			$qb->andWhere($qb->expr()->gte('l.created_at', $qb->createNamedParameter(max(0, (int)$filters['createdFrom']), IQueryBuilder::PARAM_INT)));
		}
		if (isset($filters['createdTo'])) {
			$qb->andWhere($qb->expr()->lte('l.created_at', $qb->createNamedParameter(max(0, (int)$filters['createdTo']), IQueryBuilder::PARAM_INT)));
		}
		if (isset($filters['active']) && is_bool($filters['active'])) {
			$qb->andWhere($qb->expr()->eq('l.is_active', $qb->createNamedParameter($filters['active'], IQueryBuilder::PARAM_BOOL)));
		}
		$tagIds = array_values(array_slice(array_unique(array_filter(array_map('intval', (array)($filters['tagIds'] ?? [])), static fn (int $id): bool => $id > 0)), 0, 10));
		if ($tagIds !== []) {
			if (($filters['tagMode'] ?? 'and') === 'or') {
				$qb->innerJoin('l', 'shortlinks_link_tags', 'filter_tags', $qb->expr()->andX(
					$qb->expr()->eq('filter_tags.link_id', 'l.id'),
					$qb->expr()->in('filter_tags.tag_id', $qb->createNamedParameter($tagIds, IQueryBuilder::PARAM_INT_ARRAY)),
				));
			} else {
				foreach ($tagIds as $index => $tagId) {
					$alias = 'filter_tag_' . $index;
					$qb->innerJoin('l', 'shortlinks_link_tags', $alias, $qb->expr()->andX(
						$qb->expr()->eq($alias . '.link_id', 'l.id'),
						$qb->expr()->eq($alias . '.tag_id', $qb->createNamedParameter($tagId, IQueryBuilder::PARAM_INT)),
					));
				}
			}
		}
		$search = trim((string)($filters['search'] ?? ''));
		if ($search !== '') {
			$pattern = '%' . $this->db->escapeLikeParameter($search) . '%';
			$qb->andWhere($qb->expr()->orX(
				$qb->expr()->iLike('l.title', $qb->createNamedParameter($pattern)),
				$qb->expr()->iLike('l.slug', $qb->createNamedParameter($pattern)),
				$qb->expr()->iLike('l.target_url', $qb->createNamedParameter($pattern)),
			));
		}
	}

	public function softDelete(ShortLink $link, int $now): ShortLink {
		$link->setDeletedAt($now);
		$link->setUpdatedAt($now);
		$link->setEntityVersion($link->getEntityVersion() + 1);
		return $this->update($link);
	}

	public function hardDeleteOlderThan(int $timestamp, int $limit): int {
		$ids = $this->idsDeletedBefore($timestamp, $limit);
		if ($ids === []) {
			return 0;
		}
		$this->db->beginTransaction();
		try {
			foreach ($ids as $id) {
				$this->purgeRelations($id);
			}
			$qb = $this->db->getQueryBuilder();
			$qb->delete($this->tableName)->where($qb->expr()->in('id', $qb->createNamedParameter($ids, IQueryBuilder::PARAM_INT_ARRAY)));
			$count = $qb->executeStatement();
			$this->db->commit();
			return $count;
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
	}

	/** @return list<int> */
	private function idsDeletedBefore(int $timestamp, int $limit): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('id')->from($this->tableName)->where($qb->expr()->lt('deleted_at', $qb->createNamedParameter($timestamp, IQueryBuilder::PARAM_INT)))->setMaxResults($limit);
		$result = $qb->executeQuery();
		$ids = [];
		while (($id = $result->fetchOne()) !== false) {
			$ids[] = (int)$id;
		}
		$result->closeCursor();
		return $ids;
	}
}
