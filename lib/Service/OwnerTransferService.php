<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLinkMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\IUserManager;

final class OwnerTransferService {
	public function __construct(
		private readonly IDBConnection $db,
		private readonly ShortLinkMapper $links,
		private readonly IUserManager $users,
		private readonly AuditService $audit,
	) {
	}

	public function transfer(string $fromUid, string $toUid): int {
		if ($fromUid === '' || $this->users->get($toUid) === null) {
			throw new \InvalidArgumentException('The source UID must be set and the target user must exist');
		}
		$this->db->beginTransaction();
		try {
			$this->renameConflictingRootFolders($fromUid, $toUid);
			$this->mergeConflictingTags($fromUid, $toUid);
			$count = $this->links->transferOwner($fromUid, $toUid);
			foreach (['shortlinks_folders', 'shortlinks_tags', 'shortlinks_audit', 'shortlinks_api_tokens', 'shortlinks_import_jobs'] as $table) {
				$qb = $this->db->getQueryBuilder();
				$qb->update($table)->set('owner_uid', $qb->createNamedParameter($toUid))->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($fromUid)))->executeStatement();
			}
			$this->audit->record('owner_changed', $toUid, null, ['fromUid' => $fromUid, 'toUid' => $toUid, 'linkCount' => $count]);
			$this->db->commit();
			return $count;
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
	}

	private function renameConflictingRootFolders(string $fromUid, string $toUid): void {
		$existing = $this->rootFolderNames($toUid);
		$select = $this->db->getQueryBuilder();
		$select->select('id', 'name', 'normalized_name')->from('shortlinks_folders')
			->where($select->expr()->eq('owner_uid', $select->createNamedParameter($fromUid)))
			->andWhere($select->expr()->isNull('parent_id'));
		$result = $select->executeQuery();
		while (($folder = $result->fetch()) !== false) {
			$normalized = (string)$folder['normalized_name'];
			if (!isset($existing[$normalized])) {
				$existing[$normalized] = true;
				continue;
			}
			$counter = 1;
			do {
				$suffix = $counter === 1 ? ' (transferred)' : ' (transferred ' . $counter . ')';
				$name = mb_substr((string)$folder['name'], 0, 128 - mb_strlen($suffix)) . $suffix;
				$normalized = mb_strtolower($name);
				++$counter;
			} while (isset($existing[$normalized]));
			$existing[$normalized] = true;
			$update = $this->db->getQueryBuilder();
			$update->update('shortlinks_folders')
				->set('name', $update->createNamedParameter($name))
				->set('normalized_name', $update->createNamedParameter($normalized))
				->where($update->expr()->eq('id', $update->createNamedParameter((int)$folder['id'], IQueryBuilder::PARAM_INT)))
				->executeStatement();
		}
		$result->closeCursor();
	}

	/** @return array<string,true> */
	private function rootFolderNames(string $ownerUid): array {
		$select = $this->db->getQueryBuilder();
		$select->select('normalized_name')->from('shortlinks_folders')
			->where($select->expr()->eq('owner_uid', $select->createNamedParameter($ownerUid)))
			->andWhere($select->expr()->isNull('parent_id'));
		$result = $select->executeQuery();
		$names = [];
		while (($name = $result->fetchOne()) !== false) {
			$names[(string)$name] = true;
		}
		$result->closeCursor();
		return $names;
	}

	private function mergeConflictingTags(string $fromUid, string $toUid): void {
		$target = $this->tagNames($toUid);
		$source = $this->db->getQueryBuilder();
		$source->select('id', 'normalized_name')->from('shortlinks_tags')
			->where($source->expr()->eq('owner_uid', $source->createNamedParameter($fromUid)));
		$result = $source->executeQuery();
		while (($tag = $result->fetch()) !== false) {
			$targetId = $target[(string)$tag['normalized_name']] ?? null;
			if ($targetId !== null) {
				$this->replaceTag((int)$tag['id'], $targetId);
			}
		}
		$result->closeCursor();
	}

	/** @return array<string,int> */
	private function tagNames(string $ownerUid): array {
		$select = $this->db->getQueryBuilder();
		$select->select('id', 'normalized_name')->from('shortlinks_tags')
			->where($select->expr()->eq('owner_uid', $select->createNamedParameter($ownerUid)));
		$result = $select->executeQuery();
		$names = [];
		while (($tag = $result->fetch()) !== false) {
			$names[(string)$tag['normalized_name']] = (int)$tag['id'];
		}
		$result->closeCursor();
		return $names;
	}

	private function replaceTag(int $sourceId, int $targetId): void {
		$select = $this->db->getQueryBuilder();
		$select->select('link_id')->from('shortlinks_link_tags')
			->where($select->expr()->eq('tag_id', $select->createNamedParameter($sourceId, IQueryBuilder::PARAM_INT)));
		$result = $select->executeQuery();
		while (($linkId = $result->fetchOne()) !== false) {
			$exists = $this->db->getQueryBuilder();
			$exists->select($exists->func()->count('link_id', 'count'))->from('shortlinks_link_tags')
				->where($exists->expr()->eq('link_id', $exists->createNamedParameter((int)$linkId, IQueryBuilder::PARAM_INT)))
				->andWhere($exists->expr()->eq('tag_id', $exists->createNamedParameter($targetId, IQueryBuilder::PARAM_INT)));
			if ((int)$exists->executeQuery()->fetchOne() === 0) {
				$insert = $this->db->getQueryBuilder();
				$insert->insert('shortlinks_link_tags')->values([
					'link_id' => $insert->createNamedParameter((int)$linkId, IQueryBuilder::PARAM_INT),
					'tag_id' => $insert->createNamedParameter($targetId, IQueryBuilder::PARAM_INT),
				])->executeStatement();
			}
		}
		$result->closeCursor();
		$deleteRelations = $this->db->getQueryBuilder();
		$deleteRelations->delete('shortlinks_link_tags')->where($deleteRelations->expr()->eq('tag_id', $deleteRelations->createNamedParameter($sourceId, IQueryBuilder::PARAM_INT)))->executeStatement();
		$deleteTag = $this->db->getQueryBuilder();
		$deleteTag->delete('shortlinks_tags')->where($deleteTag->expr()->eq('id', $deleteTag->createNamedParameter($sourceId, IQueryBuilder::PARAM_INT)))->executeStatement();
	}
}
