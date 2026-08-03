<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\FolderMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\StatsMapper;
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
use OCA\Shortlinks\Validator\SlugValidator;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\Exception;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IDBConnection;

final class LinkService {
	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly FolderMapper $folders,
		private readonly TagMapper $tags,
		private readonly LinkPolicy $policy,
		private readonly SlugValidator $slugValidator,
		private readonly TargetUrlValidatorInterface $urlValidator,
		private readonly AliasSuggestionService $aliasSuggestions,
		private readonly LinkUrlService $linkUrls,
		private readonly ThumbnailService $thumbnails,
		private readonly LinkMediaService $media,
		private readonly SettingsService $settings,
		private readonly UserSettingsService $userSettings,
		private readonly StatsMapper $stats,
		private readonly LinkRankingService $ranking,
		private readonly AuditService $audit,
		private readonly IEventDispatcher $events,
		private readonly ITimeFactory $time,
		private readonly IDBConnection $db,
	) {
	}

	/** @param array<string, mixed> $filters @return array{items:list<array<string,mixed>>,pagination:array<string,int>} */
	public function list(array $filters, int $page, int $perPage): array {
		$uid = $this->policy->currentUid();
		$now = $this->time->getTime();
		$filters['now'] = $now;
		$perPage = max(1, min(200, $perPage));
		$page = max(1, $page);
		$rankingMode = (string)($filters['system'] ?? 'all');
		if (in_array($rankingMode, ['trending', 'top'], true)) {
			$filters['system'] = 'all';
			$filters['sort'] = 'click_count';
			$filters['direction'] = 'DESC';
			$candidates = $this->links->findVisible($uid, $this->policy->currentGroupIds(), $filters, 2000, 0, $this->policy->canManageAll());
			$signals = $this->stats->rankingSignals(array_map(static fn (ShortLink $link): int => $link->getId(), $candidates), $now);
			$entities = $this->ranking->rank($candidates, $signals, $rankingMode, $now);
			$offset = ($page - 1) * $perPage;
			$hasMore = count($entities) > $offset + $perPage;
			$entities = array_slice($entities, $offset, $perPage);
			return ['items' => array_map(fn (ShortLink $link): array => $this->serialize($link), $entities), 'pagination' => ['page' => $page, 'perPage' => $perPage, 'hasMore' => $hasMore ? 1 : 0]];
		}
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
	public function createForOwner(array $data, string $ownerUid, bool $allowDuplicateTarget = false): array {
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
		$thumbnailProvided = array_key_exists('thumbnailUrl', $data);
		$thumbnailUrl = $thumbnailProvided ? $this->validatedThumbnailUrl($data['thumbnailUrl']) : null;
		$targetHash = hash('sha256', $targetUrl);
		if (!$allowDuplicateTarget && !$this->settings->bool('allow_duplicate_targets')) {
			$existing = $this->links->findOwnerTarget($ownerUid, $targetHash);
			if ($existing !== null) {
				if ($thumbnailProvided) {
					$this->thumbnails->storeDiscovered($existing, $thumbnailUrl);
				} elseif ($existing->getThumbnailRefreshedAt() === null && $this->userSettings->allowsMetadataAutocomplete($ownerUid)) {
					$this->thumbnails->refresh($existing);
				}
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
		for ($attempt = 0; $attempt < 40; ++$attempt) {
			$slug = $this->slugValidator->normalize($customSlug !== '' ? $customSlug : $this->aliasSuggestions->candidate($ownerUid, (string)($data['title'] ?? ''), $targetUrl, $attempt));
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
				$this->audit->record('created', $ownerUid, $link);
				$this->db->commit();
				$this->events->dispatchTyped(new LinkCreatedEvent($link));
				if ($thumbnailProvided) {
					$this->thumbnails->storeDiscovered($link, $thumbnailUrl);
				} elseif ($this->userSettings->allowsMetadataAutocomplete($ownerUid)) {
					$this->thumbnails->refresh($link);
				}
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
		return ['slug' => $link->getSlug(), 'targetUrl' => $link->getTargetUrl(), 'shortUrl' => $this->linkUrls->forSlug($link->getSlug(), $link->getOwnerUid())];
	}

	/** @param array<string, mixed> $data @return array<string, mixed> */
	public function update(int $id, array $data): array {
		$link = $this->find($id);
		$this->policy->requireEdit($link);
		$event = new BeforeLinkUpdatedEvent($link, $data);
		$this->events->dispatchTyped($event);
		$data = $event->data;
		$thumbnailProvided = array_key_exists('thumbnailUrl', $data);
		$thumbnailUrl = $thumbnailProvided ? $this->validatedThumbnailUrl($data['thumbnailUrl']) : null;
		$before = ['slug' => $link->getSlug(), 'target' => $link->getTargetHash(), 'active' => $link->getIsActive(), 'folderId' => $link->getFolderId()];
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
			$targetHash = hash('sha256', $url);
			if (!$this->settings->bool('allow_duplicate_targets') && $this->links->findOwnerTarget($ownerUid, $targetHash, $id) !== null) {
				throw new ConflictException('This target URL already has a short link');
			}
			$link->setTargetUrl($url);
			$link->setTargetHash($targetHash);
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
			$this->audit->record('updated', $ownerUid, $link);
			if ($before['slug'] !== $link->getSlug()) {
				$this->audit->record('alias_changed', $ownerUid, $link, ['oldSlug' => $before['slug'], 'newSlug' => $link->getSlug()]);
			}
			if ($before['target'] !== $link->getTargetHash()) {
				$this->audit->record('target_changed', $ownerUid, $link);
			}
			if ($before['active'] !== $link->getIsActive()) {
				$this->audit->record($link->getIsActive() ? 'activated' : 'deactivated', $ownerUid, $link);
			}
			if ($before['folderId'] !== $link->getFolderId()) {
				$this->audit->record('moved', $ownerUid, $link, ['folderId' => $link->getFolderId()]);
			}
			if (array_key_exists('tagIds', $data)) {
				$this->audit->record('tags_changed', $ownerUid, $link);
			}
			$this->db->commit();
		} catch (Exception $e) {
			$this->db->rollBack();
			if ($e->getReason() === Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ConflictException('Alias is already in use');
			}
			throw $e;
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		$updated = $this->find($id);
		if ($thumbnailProvided) {
			$this->thumbnails->storeDiscovered($updated, $thumbnailUrl);
		} elseif ($before['target'] !== $updated->getTargetHash() && $this->userSettings->allowsMetadataAutocomplete($updated->getOwnerUid())) {
			$this->thumbnails->refresh($updated);
		}
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
				$this->audit->record('permanently_deleted', $link->getOwnerUid(), null, ['linkId' => $id, 'slug' => $link->getSlug()]);
				$this->db->commit();
			} catch (\Throwable $e) {
				$this->db->rollBack();
				throw $e;
			}
			return;
		}
		$this->db->beginTransaction();
		try {
			$this->links->softDelete($link, $this->time->getTime());
			$this->audit->record('deleted', $link->getOwnerUid(), $link);
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
	}

	/** @return array<string, mixed> */
	public function restore(int $id): array {
		$link = $this->find($id);
		$this->policy->requireEdit($link);
		$link->setDeletedAt(null);
		$link->setUpdatedAt($this->time->getTime());
		$link->setEntityVersion($link->getEntityVersion() + 1);
		$this->db->beginTransaction();
		try {
			$this->links->update($link);
			$this->audit->record('restored', $link->getOwnerUid(), $link);
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}
		return $this->serialize($link);
	}

	/** @return array<string, mixed> */
	public function cloneLink(int $id): array {
		return $this->cloneLinkToFolder($id, null, false);
	}

	/** @return array<string, mixed> */
	public function cloneLinkToFolder(int $id, ?int $folderId, bool $overrideFolder = true): array {
		$link = $this->find($id);
		$this->policy->requireView($link);
		$data = ['targetUrl' => $link->getTargetUrl(), 'title' => $link->getTitle() . ' (copy)', 'description' => $link->getDescription(), 'redirectStatus' => $link->getRedirectStatus(), 'accessMode' => 'public'];
		if ($link->getOwnerUid() === $this->policy->currentUid()) {
			$data['folderId'] = $overrideFolder ? $folderId : $link->getFolderId();
			$data['tagIds'] = array_map(static fn ($tag): int => $tag->getId(), $this->tags->findForLink($id));
			$data['thumbnailUrl'] = $link->getThumbnailUrl();
			$data['thumbnailPath'] = $link->getThumbnailPath();
			$data['mediaPath'] = $link->getMediaPath();
			$data['color'] = $link->getColor();
		}
		return $this->createForOwner($data, $this->policy->currentUid(), true);
	}

	/** @param list<int> $ids @param array<string,mixed> $changes @return array{updated:int,errors:list<array{id:int,error:string}>} */
	public function bulk(array $ids, array $changes): array {
		$allowed = ['folderId', 'tagIds', 'addTagIds', 'removeTagIds', 'favorite', 'active', 'startsAt', 'expiresAt', 'clickLimit', 'redirectStatus', 'accessMode', 'action'];
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
				} elseif ($action === 'copy') {
					$this->cloneLinkToFolder($id, isset($changes['folderId']) && $changes['folderId'] !== null ? (int)$changes['folderId'] : null);
				} elseif ($action === 'update') {
					$update = $changes;
					unset($update['action']);
					if (isset($update['addTagIds']) || isset($update['removeTagIds'])) {
						$current = array_map(static fn ($tag): int => $tag->getId(), $this->tags->findForLink($id));
						$current = array_values(array_unique(array_merge($current, array_map('intval', (array)($update['addTagIds'] ?? [])))));
						$current = array_values(array_diff($current, array_map('intval', (array)($update['removeTagIds'] ?? []))));
						$update['tagIds'] = $current;
					}
					unset($update['addTagIds'], $update['removeTagIds']);
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

	public function suggestAlias(string $title = '', string $targetUrl = ''): string {
		return $this->aliasSuggestions->suggest($this->policy->currentUid(), $title, $targetUrl);
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
		$createdAt = array_key_exists('createdAt', $data) && $data['createdAt'] !== null ? max(0, min($now, (int)$data['createdAt'])) : $now;
		$initialClickCount = array_key_exists('initialClickCount', $data) ? max(0, (int)$data['initialClickCount']) : 0;
		$link = new ShortLink();
		$link->setOwnerUid($ownerUid);
		$link->setFolderId($folderId);
		$link->setSlug($slug);
		$link->setSlugHash(hash('sha256', $slug));
		$link->setTargetUrl($targetUrl);
		$link->setTargetHash($targetHash);
		$link->setClickCount($initialClickCount);
		$link->setCreatedAt($createdAt);
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
		if (array_key_exists('thumbnailPath', $data)) {
			if ($data['thumbnailPath'] === null || trim((string)$data['thumbnailPath']) === '') {
				$link->setThumbnailPath(null);
			} else {
				$link->setThumbnailPath($this->media->validatePath($ownerUid, $data['thumbnailPath'], false)['path']);
			}
		}
		if (array_key_exists('mediaPath', $data)) {
			if ($data['mediaPath'] === null || trim((string)$data['mediaPath']) === '') {
				$link->setMediaPath(null);
				$link->setMediaMime(null);
			} else {
				$media = $this->media->validatePath($ownerUid, $data['mediaPath'], true);
				$link->setMediaPath($media['path']);
				$link->setMediaMime($media['mime']);
			}
		}
		if (array_key_exists('color', $data)) {
			$color = trim((string)($data['color'] ?? ''));
			if ($color !== '' && preg_match('/^#[0-9a-fA-F]{6}$/D', $color) !== 1) {
				throw new ValidationException('Enter a valid hexadecimal color', ['color' => 'invalid']);
			}
			$link->setColor($color === '' ? null : strtolower($color));
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
			if (!$this->settings->isRedirectStatusAllowed($status)) {
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
			if ($password !== '' && (strlen($password) < 8 || strlen($password) > 1024)) {
				throw new ValidationException('Password must contain between 8 and 1024 bytes', ['password' => 'invalid']);
			}
			$link->setPasswordHash($password === '' ? null : password_hash($password, PASSWORD_DEFAULT));
		}
		if ($link->getAccessMode() === AccessMode::Password->value && $link->getPasswordHash() === null) {
			throw new ValidationException('Password protection requires a password', ['password' => 'required']);
		}
		if ($link->getAccessMode() !== AccessMode::Password->value) {
			$link->setPasswordHash(null);
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
		$result = $link->toArray($this->linkUrls->forSlug($link->getSlug(), $link->getOwnerUid()), $tags);
		$result['thumbnailMediaUrl'] = $this->media->url($link, 'thumbnail');
		$result['mediaUrl'] = $this->media->url($link, 'media');
		$result['canEdit'] = $this->policy->canEdit($link);
		$result['canShare'] = $this->policy->canShare($link);
		if ($link->getOwnerUid() !== $this->policy->currentUid() && !$this->policy->canManageAll()) {
			$result['folderId'] = null;
		}
		return $result;
	}

	private function validatedThumbnailUrl(mixed $value): ?string {
		if ($value === null || trim((string)$value) === '') {
			return null;
		}
		$url = trim((string)$value);
		$this->urlValidator->assertSafeForServerRequest($url);
		return $url;
	}
}
