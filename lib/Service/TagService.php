<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\Tag;
use OCA\Shortlinks\Db\TagMapper;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\Exception;
use OCP\IDBConnection;

final class TagService {
	public function __construct(
		private readonly TagMapper $tags,
		private readonly LinkPolicy $policy,
		private readonly ITimeFactory $time,
		private readonly AuditService $audit,
		private readonly IDBConnection $db,
	) {
	}

	/** @return list<array<string,mixed>> */
	public function list(): array {
		return array_map(fn (Tag $tag): array => $tag->toArray($this->tags->countLinks($tag->getId())), $this->tags->findAllForOwner($this->policy->currentUid()));
	}

	/** @return array<string,mixed> */
	public function create(string $name, ?string $color): array {
		$uid = $this->policy->currentUid();
		[$name, $color] = $this->validate($name, $color);
		$now = $this->time->getTime();
		$tag = new Tag();
		$tag->setOwnerUid($uid);
		$tag->setName($name);
		$tag->setNormalizedName(mb_strtolower($name));
		$tag->setColor($color);
		$tag->setCreatedAt($now);
		$tag->setUpdatedAt($now);
		try {
			$tag = $this->tags->insert($tag);
		} catch (Exception $e) {
			if ($e->getReason() === Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ConflictException('Tag already exists');
			} throw $e;
		}
		$this->audit->record('tag_created', $uid, null, ['tagId' => $tag->getId(), 'name' => $name]);
		return $tag->toArray();
	}

	/** @return array<string,mixed> */
	public function update(int $id, string $name, ?string $color): array {
		$uid = $this->policy->currentUid();
		$tag = $this->find($id, $uid);
		[$name, $color] = $this->validate($name, $color);
		$tag->setName($name);
		$tag->setNormalizedName(mb_strtolower($name));
		$tag->setColor($color);
		$tag->setUpdatedAt($this->time->getTime());
		try {
			$this->tags->update($tag);
		} catch (Exception $e) {
			if ($e->getReason() === Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ConflictException('Tag already exists');
			} throw $e;
		}
		$this->audit->record('tag_updated', $uid, null, ['tagId' => $id]);
		return $tag->toArray($this->tags->countLinks($id));
	}

	public function merge(int $sourceId, int $targetId): void {
		$uid = $this->policy->currentUid();
		$source = $this->find($sourceId, $uid);
		$this->find($targetId, $uid);
		if ($sourceId === $targetId) {
			throw new ValidationException('Cannot merge a tag into itself', ['targetId' => 'invalid']);
		}
		$this->db->beginTransaction();
		try {
			$this->tags->merge($sourceId, $targetId);
			$this->tags->deleteAssociations($sourceId);
			$this->tags->delete($source);
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$this->audit->record('tag_merged', $uid, null, ['sourceId' => $sourceId, 'targetId' => $targetId]);
	}

	public function delete(int $id): void {
		$uid = $this->policy->currentUid();
		$tag = $this->find($id, $uid);
		$this->db->beginTransaction();
		try {
			$this->tags->deleteAssociations($id);
			$this->tags->delete($tag);
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$this->audit->record('tag_deleted', $uid, null, ['tagId' => $id]);
	}

	/** @return array{string,?string} */
	private function validate(string $name, ?string $color): array {
		$name = trim($name);
		if ($name === '' || mb_strlen($name) > 64 || preg_match('/[\x00-\x1f\x7f]/u', $name)) {
			throw new ValidationException('Tag name is invalid', ['name' => 'invalid']);
		}
		if ($color !== null && preg_match('/^#[0-9A-Fa-f]{6}$/D', $color) !== 1) {
			throw new ValidationException('Tag color must be a six-digit hex color', ['color' => 'invalid']);
		}
		return [$name, $color];
	}

	private function find(int $id, string $uid): Tag {
		try {
			return $this->tags->findForOwner($id, $uid);
		} catch (DoesNotExistException) {
			throw new NotFoundException('Tag not found');
		}
	}
}
