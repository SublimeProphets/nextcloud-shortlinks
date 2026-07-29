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
	private const ICONS = ['archive', 'folder', 'personal', 'projects', 'star', 'work'];

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
	public function create(string $name, ?int $parentId, int $position = 0, string $icon = 'folder'): array {
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
		$folder->setIcon($this->validateIcon($icon));
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
	public function update(int $id, ?string $name, ?int $parentId, bool $parentProvided, ?int $position, ?string $icon = null): array {
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
		if ($icon !== null) {
			$folder->setIcon($this->validateIcon($icon));
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

	/** @param list<int> $ids @return list<array<string,mixed>> */
	public function reorder(?int $parentId, array $ids): array {
		$uid = $this->policy->currentUid();
		$all = $this->folders->findAllForOwner($uid);
		$siblingIds = array_values(array_map(
			static fn (Folder $folder): int => $folder->getId(),
			array_filter($all, static fn (Folder $folder): bool => $folder->getParentId() === $parentId),
		));
		$ids = array_values(array_unique(array_map('intval', $ids)));
		$expected = $siblingIds;
		$provided = $ids;
		sort($expected);
		sort($provided);
		if ($ids === [] || $expected !== $provided) {
			throw new ValidationException('Folder order must contain every sibling exactly once', ['ids' => 'invalid']);
		}
		$this->db->beginTransaction();
		try {
			foreach ($ids as $position => $id) {
				$this->folders->updatePositionForOwner($id, $uid, $position);
			}
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$this->audit->record('folders_reordered', $uid, null, ['parentId' => $parentId, 'ids' => implode(',', $ids)]);
		return $this->list();
	}

	private function validateName(string $name): string {
		$name = trim($name);
		if ($name === '' || mb_strlen($name) > 128 || preg_match('/[\x00-\x1f\x7f]/u', $name)) {
			throw new ValidationException('Folder name is invalid', ['name' => 'invalid']);
		}
		return $name;
	}

	private function validateIcon(string $icon): string {
		$icon = strtolower(trim($icon));
		if (!in_array($icon, self::ICONS, true)) {
			throw new ValidationException('Folder icon is invalid', ['icon' => 'invalid']);
		}
		return $icon;
	}

	private function find(int $id, string $uid): Folder {
		try {
			return $this->folders->findForOwner($id, $uid);
		} catch (DoesNotExistException) {
			throw new NotFoundException('Folder not found');
		}
	}

	private function assertParent(string $uid, ?int $id, ?int $parentId): void {
		$nodeDepth = 1;
		$currentId = $parentId;
		$visited = [];
		while ($currentId !== null) {
			if ($currentId === $id || isset($visited[$currentId])) {
				throw new ValidationException('Folder cycle detected', ['parentId' => 'cycle']);
			}
			$visited[$currentId] = true;
			$parent = $this->find($currentId, $uid);
			$currentId = $parent->getParentId();
			if (++$nodeDepth > self::MAX_DEPTH) {
				throw new ValidationException('Maximum folder depth exceeded', ['parentId' => 'depth']);
			}
		}
		if ($id !== null) {
			$subtreeHeight = $this->subtreeHeight($id, $this->folders->findAllForOwner($uid));
			if ($nodeDepth + $subtreeHeight - 1 > self::MAX_DEPTH) {
				throw new ValidationException('Maximum folder depth exceeded', ['parentId' => 'depth']);
			}
		}
	}

	/** @param list<Folder> $all */
	private function subtreeHeight(int $rootId, array $all): int {
		$depths = [$rootId => 1];
		$height = 1;
		for ($depth = 1; $depth <= self::MAX_DEPTH; ++$depth) {
			$found = false;
			foreach ($all as $folder) {
				$parentId = $folder->getParentId();
				if ($parentId !== null && ($depths[$parentId] ?? 0) === $depth && !isset($depths[$folder->getId()])) {
					$depths[$folder->getId()] = $depth + 1;
					$height = max($height, $depth + 1);
					$found = true;
				}
			}
			if (!$found) {
				break;
			}
		}
		return $height;
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
