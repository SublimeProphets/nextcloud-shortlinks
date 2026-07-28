<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\Folder;
use OCA\Shortlinks\Db\FolderMapper;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\Exception;
use OCP\IDBConnection;

final class FolderService {
	private const MAX_DEPTH = 10;

	public function __construct(
		private readonly FolderMapper $folders,
		private readonly LinkPolicy $policy,
		private readonly ITimeFactory $time,
		private readonly AuditService $audit,
		private readonly IDBConnection $db,
	) {
	}

	/** @return list<array<string,mixed>> */
	public function list(): array {
		$uid = $this->policy->currentUid();
		return array_map(fn (Folder $folder): array => $folder->toArray($this->folders->countLinks($folder->getId(), $uid)), $this->folders->findAllForOwner($uid));
	}

	/** @return array<string,mixed> */
	public function create(string $name, ?int $parentId, int $position = 0): array {
		$uid = $this->policy->currentUid();
		$name = $this->validateName($name);
		$this->assertParent($uid, null, $parentId);
		$now = $this->time->getTime();
		$folder = new Folder();
		$folder->setOwnerUid($uid);
		$folder->setParentId($parentId);
		$folder->setParentKey($parentId ?? 0);
		$folder->setName($name);
		$folder->setNormalizedName(mb_strtolower($name));
		$folder->setPosition(max(0, $position));
		$folder->setCreatedAt($now);
		$folder->setUpdatedAt($now);
		try {
			$folder = $this->folders->insert($folder);
		} catch (Exception $e) {
			if ($e->getReason() === Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ConflictException('A folder with this name already exists here');
			}
			throw $e;
		}
		$this->audit->record('folder_created', $uid, null, ['folderId' => $folder->getId(), 'name' => $name]);
		return $folder->toArray();
	}

	/** @return array<string,mixed> */
	public function update(int $id, ?string $name, ?int $parentId, bool $parentProvided, ?int $position): array {
		$uid = $this->policy->currentUid();
		$folder = $this->find($id, $uid);
		if ($parentProvided) {
			$this->assertParent($uid, $id, $parentId);
		}
		if ($name !== null) {
			$name = $this->validateName($name);
			$folder->setName($name);
			$folder->setNormalizedName(mb_strtolower($name));
		}
		if ($parentProvided) {
			$folder->setParentId($parentId);
			$folder->setParentKey($parentId ?? 0);
		}
		if ($position !== null) {
			$folder->setPosition(max(0, $position));
		}
		$folder->setUpdatedAt($this->time->getTime());
		try {
			$this->folders->update($folder);
		} catch (Exception $e) {
			if ($e->getReason() === Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ConflictException('A folder with this name already exists here');
			} throw $e;
		}
		$this->audit->record('folder_updated', $uid, null, ['folderId' => $id]);
		return $folder->toArray($this->folders->countLinks($id, $uid));
	}

	public function delete(int $id, bool $deleteLinks): void {
		$uid = $this->policy->currentUid();
		$this->find($id, $uid);
		$all = $this->folders->findAllForOwner($uid);
		$ids = $this->subtreeIds($id, $all);
		$now = $this->time->getTime();
		$this->db->beginTransaction();
		try {
			foreach ($ids as $folderId) {
				$this->folders->detachLinks($folderId, $deleteLinks, $now);
			}
			foreach (array_reverse($ids) as $folderId) {
				$this->folders->deleteById($folderId);
			}
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$this->audit->record('folder_deleted', $uid, null, ['folderId' => $id, 'linksDeleted' => $deleteLinks]);
	}

	private function validateName(string $name): string {
		$name = trim($name);
		if ($name === '' || mb_strlen($name) > 128 || preg_match('/[\x00-\x1f\x7f]/u', $name)) {
			throw new ValidationException('Folder name is invalid', ['name' => 'invalid']);
		}
		return $name;
	}

	private function find(int $id, string $uid): Folder {
		try {
			return $this->folders->findForOwner($id, $uid);
		} catch (DoesNotExistException) {
			throw new NotFoundException('Folder not found');
		}
	}

	private function assertParent(string $uid, ?int $id, ?int $parentId): void {
		if ($parentId === null) {
			return;
		}
		if ($id === $parentId) {
			throw new ValidationException('A folder cannot be its own parent', ['parentId' => 'cycle']);
		}
		$parent = $this->find($parentId, $uid);
		$depth = 1;
		while ($parent->getParentId() !== null) {
			if ($parent->getParentId() === $id) {
				throw new ValidationException('Folder cycle detected', ['parentId' => 'cycle']);
			}
			$parent = $this->find($parent->getParentId(), $uid);
			if (++$depth >= self::MAX_DEPTH) {
				throw new ValidationException('Maximum folder depth exceeded', ['parentId' => 'depth']);
			}
		}
	}

	/** @param list<Folder> $all @return list<int> */
	private function subtreeIds(int $rootId, array $all): array {
		$result = [$rootId];
		for ($i = 0; $i < count($result); ++$i) {
			foreach ($all as $folder) {
				if ($folder->getParentId() === $result[$i]) {
					$result[] = $folder->getId();
				}
			}
		}
		return array_values(array_unique($result));
	}
}
