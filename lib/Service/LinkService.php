<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\FolderMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\TagMapper;
use OCA\Shortlinks\Enum\AccessMode;
use OCA\Shortlinks\Event\BeforeLinkCreatedEvent;
use OCA\Shortlinks\Event\BeforeLinkUpdatedEvent;
use OCA\Shortlinks\Event\LinkCreatedEvent;
use OCA\Shortlinks\Event\LinkUpdatedEvent;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\ForbiddenException;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Provider\Alias\AliasGeneratorInterface;
use OCA\Shortlinks\Validator\SlugValidator;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\Exception;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IDBConnection;

final class LinkService {
	private const REDIRECT_STATUSES = [301, 302, 307, 308];

	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly FolderMapper $folders,
		private readonly TagMapper $tags,
		private readonly LinkPolicy $policy,
		private readonly SlugValidator $slugValidator,
		private readonly TargetUrlValidatorInterface $urlValidator,
		private readonly AliasGeneratorInterface $aliasGenerator,
		private readonly LinkUrlService $linkUrls,
		private readonly SettingsService $settings,
		private readonly AuditService $audit,
		private readonly IEventDispatcher $events,
		private readonly ITimeFactory $time,
		private readonly IDBConnection $db,
	) {
	}

	/** @param array<string, mixed> $filters @return array{items:list<array<string,mixed>>,pagination:array<string,int>} */
	public function list(array $filters, int $page, int $perPage): array {
		$uid = $this->policy->currentUid();
		$filters['now'] = $this->time->getTime();
		$perPage = max(1, min(200, $perPage));
		$page = max(1, $page);
		$entities = $this->links->findVisible($uid, $this->policy->currentGroupIds(), $filters, $perPage + 1, ($page - 1) * $perPage, $this->policy->canManageAll());
		$hasMore = count($entities) > $perPage;
		$entities = array_slice($entities, 0, $perPage);
		return ['items' => array_map(fn (ShortLink $link): array => $this->serialize($link), $entities), 'pagination' => ['page' => $page, 'perPage' => $perPage, 'hasMore' => $hasMore ? 1 : 0]];
	}

	/** @param array<string, mixed> $data @return array<string, mixed> */
	public function create(array $data): array {
		$ownerUid = $this->policy->currentUid();
		$creationGroups = $this->settings->array('creation_groups');
		if ($creationGroups !== [] && array_intersect($creationGroups, $this->policy->currentGroupIds()) === [] && !$this->policy->isAdmin()) {
			throw new ForbiddenException('Your groups are not allowed to create short links');
		}
		return $this->createForOwner($data, $ownerUid);
	}

	/** @param array<string, mixed> $data @return array<string, mixed> */
	public function createForOwner(array $data, string $ownerUid): array {
		if (!$this->settings->bool('enabled')) {
			throw new ValidationException('Shortlinks is disabled by the administrator');
		}
		if ($this->links->countForOwner($ownerUid) >= $this->settings->int('max_links_per_user')) {
			throw new ConflictException('Link quota reached');
		}
		$event = new BeforeLinkCreatedEvent($data, $ownerUid);
		$this->events->dispatchTyped($event);
		$data = $event->data;
		$targetUrl = $this->urlValidator->validate((string)($data['targetUrl'] ?? ''));
		$targetHash = hash('sha256', $targetUrl);
		if (!$this->settings->bool('allow_duplicate_targets')) {
			$existing = $this->links->findOwnerTarget($ownerUid, $targetHash);
			if ($existing !== null) {
				return $this->serialize($existing);
			}
		}
		$folderId = isset($data['folderId']) && $data['folderId'] !== null ? (int)$data['folderId'] : null;
		if ($folderId !== null) {
			try {
				$this->folders->findForOwner($folderId, $ownerUid);
			} catch (DoesNotExistException) {
				throw new ValidationException('Folder not found', ['folderId' => 'not_found']);
			}
		}
		$tagIds = $this->validatedTagIds((array)($data['tagIds'] ?? []), $ownerUid);
		$customSlug = trim((string)($data['slug'] ?? ''));
		$lastException = null;
		for ($attempt = 0; $attempt < 10; ++$attempt) {
			$slug = $this->slugValidator->normalize($customSlug !== '' ? $customSlug : $this->aliasGenerator->generate());
			if ($this->links->slugExists($slug)) {
				if ($customSlug !== '') {
					throw new ConflictException('Alias is already in use');
				}
				continue;
			}
			$link = $this->newEntity($data, $ownerUid, $folderId, $slug, $targetUrl, $targetHash);
			$this->db->beginTransaction();
			try {
				$link = $this->links->insert($link);
				$this->tags->replaceForLink($link->getId(), $tagIds);
				$this->db->commit();
				$this->audit->record('created', $ownerUid, $link);
				$this->events->dispatchTyped(new LinkCreatedEvent($link));
				return $this->serialize($link);
			} catch (Exception $e) {
				$this->db->rollBack();
				$lastException = $e;
				if ($customSlug !== '' || $e->getReason() !== Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
					throw new ConflictException('Could not reserve alias');
				}
			}
		}
		throw new ConflictException($lastException === null ? 'Could not generate a unique alias' : 'Alias generation exhausted after collisions');
	}

	/** @return array<string, mixed> */
	public function get(int $id): array {
		$link = $this->find($id);
		$this->policy->requireView($link);
		return $this->serialize($link);
	}

	/** @return array{slug:string,targetUrl:string,shortUrl:string} */
	public function expand(string $slug): array {
		$slug = $this->slugValidator->normalize($slug);
		try {
			$link = $this->links->findBySlug($slug);
		} catch (DoesNotExistException) {
			throw new NotFoundException();
		}
		$this->policy->requireView($link);
		return ['slug' => $link->getSlug(), 'targetUrl' => $link->getTargetUrl(), 'shortUrl' => $this->linkUrls->forSlug($link->getSlug())];
	}

	/** @param array<string, mixed> $data @return array<string, mixed> */
	public function update(int $id, array $data): array {
		$link = $this->find($id);
		$this->policy->requireEdit($link);
		$event = new BeforeLinkUpdatedEvent($link, $data);
		$this->events->dispatchTyped($event);
		$data = $event->data;
		$expectedVersion = (int)($data['version'] ?? 0);
		if ($expectedVersion !== $link->getEntityVersion()) {
			throw new ConflictException('Link changed since it was loaded');
		}
		$ownerUid = $link->getOwnerUid();
		if ($this->policy->currentUid() !== $ownerUid && !$this->policy->canManageAll() && (array_key_exists('folderId', $data) || array_key_exists('tagIds', $data))) {
			throw new ForbiddenException('Only the owner can change folders or tags');
		}
		if (array_key_exists('targetUrl', $data)) {
			$url = $this->urlValidator->validate((string)$data['targetUrl']);
			$link->setTargetUrl($url);
			$link->setTargetHash(hash('sha256', $url));
		}
		if (array_key_exists('slug', $data)) {
			$slug = $this->slugValidator->normalize((string)$data['slug']);
			if ($this->links->slugExists($slug, $id)) {
				throw new ConflictException('Alias is already in use');
			}
			$link->setSlug($slug);
			$link->setSlugHash(hash('sha256', $slug));
		}
		$this->applyMutableFields($link, $data, $ownerUid);
		$link->setUpdatedAt($this->time->getTime());
		$link->setEntityVersion($expectedVersion + 1);
		$this->db->beginTransaction();
		try {
			if (!$this->links->updateWithVersion($link, $expectedVersion)) {
				throw new ConflictException('Link changed concurrently');
			}
			if (array_key_exists('tagIds', $data)) {
				$this->tags->replaceForLink($id, $this->validatedTagIds((array)$data['tagIds'], $ownerUid));
			}
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$this->audit->record('updated', $ownerUid, $link);
		$updated = $this->find($id);
		$this->events->dispatchTyped(new LinkUpdatedEvent($updated));
		return $this->serialize($updated);
	}

	public function delete(int $id, bool $permanent = false): void {
		$link = $this->find($id);
		$this->policy->requireEdit($link);
		if ($permanent) {
			if ($link->getDeletedAt() === null) {
				throw new ConflictException('Move the link to trash before permanent deletion');
			}
			$this->db->beginTransaction();
			try {
				$this->links->purgeRelations($id);
				$this->links->delete($link);
				$this->db->commit();
			} catch (\Throwable $e) {
				$this->db->rollBack();
				throw $e;
			}
			$this->audit->record('permanently_deleted', $link->getOwnerUid(), null, ['linkId' => $id, 'slug' => $link->getSlug()]);
			return;
		}
		$this->links->softDelete($link, $this->time->getTime());
		$this->audit->record('deleted', $link->getOwnerUid(), $link);
	}

	/** @return array<string, mixed> */
	public function restore(int $id): array {
		$link = $this->find($id);
		$this->policy->requireEdit($link);
		$link->setDeletedAt(null);
		$link->setUpdatedAt($this->time->getTime());
		$link->setEntityVersion($link->getEntityVersion() + 1);
		$this->links->update($link);
		$this->audit->record('restored', $link->getOwnerUid(), $link);
		return $this->serialize($link);
	}

	/** @return array<string, mixed> */
	public function cloneLink(int $id): array {
		$link = $this->find($id);
		$this->policy->requireView($link);
		$data = ['targetUrl' => $link->getTargetUrl(), 'title' => $link->getTitle() . ' (copy)', 'description' => $link->getDescription(), 'redirectStatus' => $link->getRedirectStatus(), 'accessMode' => 'public'];
		if ($link->getOwnerUid() === $this->policy->currentUid()) {
			$data['folderId'] = $link->getFolderId();
			$data['tagIds'] = array_map(static fn ($tag): int => $tag->getId(), $this->tags->findForLink($id));
		}
		return $this->create($data);
	}

	/** @param list<int> $ids @param array<string,mixed> $changes @return array{updated:int,errors:list<array{id:int,error:string}>} */
	public function bulk(array $ids, array $changes): array {
		$allowed = ['folderId', 'tagIds', 'favorite', 'active', 'startsAt', 'expiresAt', 'clickLimit', 'redirectStatus', 'accessMode', 'action'];
		$unexpected = array_diff(array_keys($changes), $allowed);
		if ($unexpected !== []) {
			throw new ValidationException('Unexpected bulk fields', array_fill_keys($unexpected, 'unexpected'));
		}
		$updated = 0;
		$errors = [];
		foreach (array_slice(array_unique(array_map('intval', $ids)), 0, 200) as $id) {
			try {
				$link = $this->find($id);
				$this->policy->requireEdit($link);
				$action = (string)($changes['action'] ?? 'update');
				if ($action === 'trash') {
					$this->delete($id);
				} elseif ($action === 'restore') {
					$this->restore($id);
				} elseif ($action === 'permanent-delete') {
					$this->delete($id, true);
				} elseif ($action === 'update') {
					$update = $changes;
					unset($update['action']);
					$this->update($id, array_merge($update, ['version' => $link->getEntityVersion()]));
				} else {
					throw new ValidationException('Invalid bulk action', ['action' => 'invalid']);
				}
				++$updated;
			} catch (\Throwable $e) {
				$errors[] = ['id' => $id, 'error' => $e->getMessage()];
			}
		}
		return ['updated' => $updated, 'errors' => $errors];
	}

	public function isAliasAvailable(string $slug): bool {
		$slug = $this->slugValidator->normalize($slug);
		return !$this->links->slugExists($slug);
	}

	private function find(int $id): ShortLink {
		try {
			return $this->links->find($id);
		} catch (DoesNotExistException) {
			throw new NotFoundException();
		}
	}

	/** @param array<string,mixed> $data */
	private function newEntity(array $data, string $ownerUid, ?int $folderId, string $slug, string $targetUrl, string $targetHash): ShortLink {
		$now = $this->time->getTime();
		$link = new ShortLink();
		$link->setOwnerUid($ownerUid);
		$link->setFolderId($folderId);
		$link->setSlug($slug);
		$link->setSlugHash(hash('sha256', $slug));
		$link->setTargetUrl($targetUrl);
		$link->setTargetHash($targetHash);
		$link->setClickCount(0);
		$link->setCreatedAt($now);
		$link->setUpdatedAt($now);
		$link->setEntityVersion(1);
		$this->applyMutableFields($link, $data, $ownerUid);
		return $link;
	}

	/** @param array<string,mixed> $data */
	private function applyMutableFields(ShortLink $link, array $data, string $ownerUid): void {
		if (array_key_exists('title', $data)) {
			$link->setTitle(substr(trim((string)$data['title']), 0, 255));
		}
		if (array_key_exists('description', $data)) {
			$link->setDescription($data['description'] === null ? null : substr((string)$data['description'], 0, 10000));
		}
		if (array_key_exists('favorite', $data)) {
			$link->setIsFavorite((bool)$data['favorite']);
		}
		if (array_key_exists('active', $data)) {
			$link->setIsActive((bool)$data['active']);
		}
		if (array_key_exists('folderId', $data)) {
			$folderId = $data['folderId'] === null ? null : (int)$data['folderId'];
			if ($folderId !== null) {
				try {
					$this->folders->findForOwner($folderId, $ownerUid);
				} catch (DoesNotExistException) {
					throw new ValidationException('Folder not found', ['folderId' => 'not_found']);
				}
			}
			$link->setFolderId($folderId);
		}
		if (array_key_exists('redirectStatus', $data)) {
			$status = (int)$data['redirectStatus'];
			if (!in_array($status, self::REDIRECT_STATUSES, true)) {
				throw new ValidationException('Invalid redirect status', ['redirectStatus' => 'invalid']);
			}
			$link->setRedirectStatus($status);
		}
		if (array_key_exists('accessMode', $data)) {
			$mode = AccessMode::tryFrom((string)$data['accessMode']);
			if ($mode === null) {
				throw new ValidationException('Invalid access mode', ['accessMode' => 'invalid']);
			}
			$link->setAccessMode($mode->value);
		}
		if (array_key_exists('password', $data)) {
			$password = (string)$data['password'];
			$link->setPasswordHash($password === '' ? null : password_hash($password, PASSWORD_DEFAULT));
		}
		foreach (['startsAt' => 'setStartsAt', 'expiresAt' => 'setExpiresAt', 'clickLimit' => 'setClickLimit'] as $key => $setter) {
			if (array_key_exists($key, $data)) {
				$link->$setter($data[$key] === null ? null : (int)$data[$key]);
			}
		}
		if ($link->getStartsAt() !== null && $link->getExpiresAt() !== null && $link->getStartsAt() >= $link->getExpiresAt()) {
			throw new ValidationException('Start time must precede expiry', ['expiresAt' => 'invalid']);
		}
		if ($link->getClickLimit() !== null && $link->getClickLimit() < 1) {
			throw new ValidationException('Click limit must be positive', ['clickLimit' => 'invalid']);
		}
	}

	/** @param list<mixed> $ids @return list<int> */
	private function validatedTagIds(array $ids, string $ownerUid): array {
		$result = [];
		foreach (array_slice(array_unique(array_map('intval', $ids)), 0, 50) as $id) {
			try {
				$this->tags->findForOwner($id, $ownerUid);
			} catch (DoesNotExistException) {
				throw new ValidationException('Tag not found', ['tagIds' => 'not_found']);
			}
			$result[] = $id;
		}
		return $result;
	}

	/** @return array<string,mixed> */
	private function serialize(ShortLink $link): array {
		$tags = array_map(static fn ($tag): array => $tag->toArray(), $this->tags->findForLink($link->getId()));
		$result = $link->toArray($this->linkUrls->forSlug($link->getSlug()), $tags);
		if ($link->getOwnerUid() !== $this->policy->currentUid() && !$this->policy->canManageAll()) {
			$result['folderId'] = null;
		}
		return $result;
	}
}
