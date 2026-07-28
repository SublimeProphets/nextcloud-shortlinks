<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/** @extends QBMapper<Tag> */
final class TagMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'shortlinks_tags', Tag::class);
	}

	/** @throws DoesNotExistException */
	public function findForOwner(int $id, string $ownerUid): Tag {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)))->andWhere($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)));
		/** @var Tag */
		return $this->findEntity($qb);
	}

	/** @return list<Tag> */
	public function findAllForOwner(string $ownerUid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->tableName)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($ownerUid)))->orderBy('name', 'ASC');
		/** @var list<Tag> */
		return $this->findEntities($qb);
	}

	/** @return list<Tag> */
	public function findForLink(int $linkId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('t.*')->from($this->tableName, 't')->innerJoin('t', 'shortlinks_link_tags', 'lt', $qb->expr()->eq('lt.tag_id', 't.id'))->where($qb->expr()->eq('lt.link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->orderBy('t.name', 'ASC');
		/** @var list<Tag> */
		return $this->findEntities($qb);
	}

	/** @param list<int> $tagIds */
	public function replaceForLink(int $linkId, array $tagIds): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('shortlinks_link_tags')->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->executeStatement();
		foreach (array_values(array_unique($tagIds)) as $tagId) {
			$qb = $this->db->getQueryBuilder();
			$qb->insert('shortlinks_link_tags')->values(['link_id' => $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT), 'tag_id' => $qb->createNamedParameter($tagId, IQueryBuilder::PARAM_INT)])->executeStatement();
		}
	}

	public function merge(int $sourceId, int $targetId): void {
		$qb = $this->db->getQueryBuilder();
		$qb->select('link_id')->from('shortlinks_link_tags')->where($qb->expr()->eq('tag_id', $qb->createNamedParameter($sourceId, IQueryBuilder::PARAM_INT)));
		$result = $qb->executeQuery();
		$linkIds = [];
		while (($linkId = $result->fetchOne()) !== false) {
			$linkIds[] = (int)$linkId;
		}
		$result->closeCursor();
		foreach ($linkIds as $linkId) {
			$exists = $this->db->getQueryBuilder();
			$exists->select($exists->func()->count('link_id', 'count'))->from('shortlinks_link_tags')
				->where($exists->expr()->eq('link_id', $exists->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))
				->andWhere($exists->expr()->eq('tag_id', $exists->createNamedParameter($targetId, IQueryBuilder::PARAM_INT)));
			if ((int)$exists->executeQuery()->fetchOne() > 0) {
				continue;
			}
			$insert = $this->db->getQueryBuilder();
			$insert->insert('shortlinks_link_tags')->values(['link_id' => $insert->createNamedParameter($linkId, IQueryBuilder::PARAM_INT), 'tag_id' => $insert->createNamedParameter($targetId, IQueryBuilder::PARAM_INT)])->executeStatement();
		}
	}

	public function deleteAssociations(int $tagId): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('shortlinks_link_tags')->where($qb->expr()->eq('tag_id', $qb->createNamedParameter($tagId, IQueryBuilder::PARAM_INT)))->executeStatement();
	}

	public function countLinks(int $tagId): int {
		$qb = $this->db->getQueryBuilder();
		$qb->select($qb->func()->count('link_id', 'count'))->from('shortlinks_link_tags')->where($qb->expr()->eq('tag_id', $qb->createNamedParameter($tagId, IQueryBuilder::PARAM_INT)));
		return (int)$qb->executeQuery()->fetchOne();
	}
}
