<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLinkMapper;
use OCP\IDBConnection;
use OCP\IUserManager;

final class OwnerTransferService {
	public function __construct(
		private readonly IDBConnection $db,
		private readonly ShortLinkMapper $links,
		private readonly IUserManager $users,
	) {
	}

	public function transfer(string $fromUid, string $toUid): int {
		if ($fromUid === '' || $this->users->get($toUid) === null) {
			throw new \InvalidArgumentException('The source UID must be set and the target user must exist');
		}
		$this->db->beginTransaction();
		try {
			$count = $this->links->transferOwner($fromUid, $toUid);
			foreach (['shortlinks_folders', 'shortlinks_tags', 'shortlinks_audit', 'shortlinks_api_tokens', 'shortlinks_import_jobs'] as $table) {
				$qb = $this->db->getQueryBuilder();
				$qb->update($table)->set('owner_uid', $qb->createNamedParameter($toUid))->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($fromUid)))->executeStatement();
			}
			$this->db->commit();
			return $count;
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
	}
}
