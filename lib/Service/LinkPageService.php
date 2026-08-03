<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\FolderMapper;
use OCA\Shortlinks\Db\LinkPage;
use OCA\Shortlinks\Db\LinkPageMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\TagMapper;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\ForbiddenException;
use OCA\Shortlinks\Exception\LinkUnavailableException;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\PasswordRequiredException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Validator\SlugValidator;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\File;
use OCP\IGroupManager;
use OCP\IURLGenerator;
use OCP\IUserManager;
use OCP\IUserSession;

final class LinkPageService {
	private const ACCESS = ['private', 'public', 'password', 'restricted'];
	private const LAYOUTS = ['cards', 'spaced', 'compact', 'tiles'];
	private const GROUPING = ['none', 'folder', 'tag'];
	private const FIELDS = ['title', 'description', 'thumbnail', 'media', 'domain', 'shortUrl', 'clicks', 'folder', 'tags'];
	private const THEMES = ['nextcloud', 'neutral', 'modern', 'editorial'];
	private const FONTS = ['system', 'inter', 'segoe', 'helvetica', 'arial', 'verdana', 'tahoma', 'trebuchet', 'roboto', 'open-sans', 'lato', 'montserrat', 'poppins', 'georgia', 'times', 'palatino', 'garamond', 'courier', 'consolas', 'monospace'];
	private const HEADER_ALIGNMENTS = ['center', 'left'];
	private const DEFAULT_ATTRIBUTION = 'Shared securely with Nextcloud Shortlinks';

	public function __construct(
		private readonly LinkPageMapper $pages,
		private readonly ShortLinkMapper $links,
		private readonly FolderMapper $folders,
		private readonly TagMapper $tags,
		private readonly LinkPolicy $policy,
		private readonly SlugValidator $slugs,
		private readonly LinkUrlService $linkUrls,
		private readonly LinkMediaService $media,
		private readonly PageContentService $content,
		private readonly IUserSession $userSession,
		private readonly IUserManager $users,
		private readonly IGroupManager $groups,
		private readonly IURLGenerator $urls,
		private readonly ITimeFactory $time,
	) {
	}

	/** @return array{items:list<array<string,mixed>>,pagination:array<string,int>} */
	public function list(string $filter, int $page, int $perPage): array {
		$uid = $this->policy->currentUid();
		$filter = in_array($filter, ['all', 'public', 'protected', 'inactive', 'trash'], true) ? $filter : 'all';
		$page = max(1, $page);
		$perPage = max(1, min(100, $perPage));
		$entities = $this->pages->findForOwner($uid, $filter, $perPage + 1, ($page - 1) * $perPage);
		$hasMore = count($entities) > $perPage;
		return [
			'items' => array_map(fn (LinkPage $page): array => $this->serialize($page), array_slice($entities, 0, $perPage)),
			'pagination' => ['page' => $page, 'perPage' => $perPage, 'hasMore' => $hasMore ? 1 : 0],
		];
	}

	/** @return array<string,mixed> */
	public function get(int $id): array {
		return $this->serialize($this->owned($id));
	}

	/** @param array<string,mixed> $data @return array<string,mixed> */
	public function create(array $data): array {
		$uid = $this->policy->currentUid();
		$page = new LinkPage();
		$this->initializeComposition($page);
		$page->setOwnerUid($uid);
		$page->setCreatedAt($this->time->getTime());
		$page->setUpdatedAt($this->time->getTime());
		$page->setEntityVersion(1);
		$slug = trim((string)($data['slug'] ?? ''));
		if ($slug === '') {
			$slug = $this->pageSlug((string)($data['title'] ?? 'page'));
		}
		$slug = $this->slugs->normalize($slug);
		if ($this->pages->slugExists($slug)) {
			throw new ConflictException('Page address is already in use');
		}
		$page->setSlug($slug);
		$page->setSlugHash(hash('sha256', $slug));
		$this->apply($page, $data);
		return $this->serialize($this->pages->insert($page));
	}

	private function initializeComposition(LinkPage $page): void {
		foreach ([
			'setFolderIds' => '[]', 'setTagIds' => '[]', 'setLinkIds' => '[]', 'setUserIds' => '[]', 'setGroupIds' => '[]',
			'setVisibleFields' => '["title","thumbnail","media","domain"]', 'setThemeJson' => '{}', 'setHeaderJson' => '{}', 'setFooterJson' => '{}',
		] as $setter => $default) {
			$page->$setter('__initialize__');
			$page->$setter($default);
		}
	}

	/** @param array<string,mixed> $data @return array<string,mixed> */
	public function update(int $id, array $data): array {
		$page = $this->owned($id);
		$version = (int)($data['version'] ?? 0);
		if ($version !== $page->getEntityVersion()) {
			throw new ConflictException('Page changed since it was loaded');
		}
		if (array_key_exists('slug', $data)) {
			$slug = $this->slugs->normalize((string)$data['slug']);
			if ($this->pages->slugExists($slug, $id)) {
				throw new ConflictException('Page address is already in use');
			}
			$page->setSlug($slug);
			$page->setSlugHash(hash('sha256', $slug));
		}
		$this->apply($page, $data);
		$page->setUpdatedAt($this->time->getTime());
		$page->setEntityVersion($version + 1);
		return $this->serialize($this->pages->update($page));
	}

	public function delete(int $id, bool $permanent): void {
		$page = $this->owned($id);
		if ($permanent || $page->getDeletedAt() !== null) {
			$this->pages->delete($page);
			return;
		}
		$page->setDeletedAt($this->time->getTime());
		$page->setUpdatedAt($this->time->getTime());
		$page->setEntityVersion($page->getEntityVersion() + 1);
		$this->pages->update($page);
	}

	/** @return array<string,mixed> */
	public function restore(int $id): array {
		$page = $this->owned($id);
		$page->setDeletedAt(null);
		$page->setUpdatedAt($this->time->getTime());
		$page->setEntityVersion($page->getEntityVersion() + 1);
		return $this->serialize($this->pages->update($page));
	}

	/** @return array{page:array<string,mixed>,links:list<array<string,mixed>>,footerLinks:list<array<string,mixed>>,files:list<array<string,mixed>>,contacts:list<array<string,mixed>>,owner:string} */
	public function publicView(string $slug, ?string $password = null): array {
		try {
			$page = $this->pages->findBySlug($this->slugs->normalize($slug));
		} catch (DoesNotExistException) {
			throw new LinkUnavailableException('This page is unavailable');
		}
		$this->requirePublicAccess($page, $password);
		$owner = $this->users->get($page->getOwnerUid());
		return [
			'page' => $this->serialize($page, false),
			'links' => $this->selectedLinks($page),
			'footerLinks' => $this->selectedLinks($page, $this->footerLinkIds($page)),
			'files' => $this->content->files($page),
			'contacts' => $this->decodeContacts($page->getContactsJson()),
			'owner' => $owner?->getDisplayName() ?? $page->getOwnerUid(),
		];
	}

	/** @return array{enabled:bool,items:list<array<string,mixed>>} */
	public function searchContacts(string $search): array {
		$this->policy->currentUid();
		return $this->content->searchContacts($search);
	}

	public function publicFile(string $slug, int $index, string $token): File {
		try {
			$page = $this->pages->findBySlug($this->slugs->normalize($slug));
		} catch (DoesNotExistException) {
			throw new LinkUnavailableException('This page is unavailable');
		}
		$this->requireAvailable($page);
		if (in_array($page->getAccessMode(), ['private', 'restricted'], true)) {
			$this->requirePublicAccess($page, null);
		}
		return $this->content->read($page, $index, $token);
	}

	/** @param array<string,mixed> $data */
	private function apply(LinkPage $page, array $data): void {
		if (array_key_exists('title', $data)) {
			$title = trim((string)$data['title']);
			if ($title === '') {
				throw new ValidationException('Enter a page title', ['title' => 'required']);
			}
			$page->setTitle(substr($title, 0, 255));
		}
		if ($page->getTitle() === '') {
			throw new ValidationException('Enter a page title', ['title' => 'required']);
		}
		if (array_key_exists('lead', $data)) {
			$lead = trim((string)($data['lead'] ?? ''));
			$page->setLead($lead === '' ? null : substr($lead, 0, 5000));
		}
		if (array_key_exists('accessMode', $data)) {
			$mode = (string)$data['accessMode'];
			if (!in_array($mode, self::ACCESS, true)) {
				throw new ValidationException('Invalid page visibility', ['accessMode' => 'invalid']);
			}
			$page->setAccessMode($mode);
		}
		if (array_key_exists('password', $data)) {
			$password = (string)$data['password'];
			if ($password !== '' && strlen($password) < 8) {
				throw new ValidationException('Password must contain at least 8 characters', ['password' => 'invalid']);
			}
			$page->setPasswordHash($password === '' ? null : password_hash($password, PASSWORD_DEFAULT));
		}
		if ($page->getAccessMode() === 'password' && $page->getPasswordHash() === null) {
			throw new ValidationException('Password protection requires a password', ['password' => 'required']);
		}
		if ($page->getAccessMode() !== 'password') {
			$page->setPasswordHash(null);
		}
		foreach (['startsAt' => 'setStartsAt', 'expiresAt' => 'setExpiresAt'] as $key => $setter) {
			if (array_key_exists($key, $data)) {
				$page->$setter($data[$key] === null ? null : (int)$data[$key]);
			}
		}
		if ($page->getStartsAt() !== null && $page->getExpiresAt() !== null && $page->getStartsAt() >= $page->getExpiresAt()) {
			throw new ValidationException('Start time must precede expiry', ['expiresAt' => 'invalid']);
		}
		if (array_key_exists('active', $data)) {
			$page->setIsActive((bool)$data['active']);
		}
		foreach (['folderIds' => 'setFolderIds', 'tagIds' => 'setTagIds', 'linkIds' => 'setLinkIds'] as $key => $setter) {
			if (array_key_exists($key, $data)) {
				$page->$setter($this->encodeIds((array)$data[$key]));
			}
		}
		if (array_key_exists('filePaths', $data)) {
			$page->setFilePaths(json_encode($this->content->validateFilePaths($page->getOwnerUid(), (array)$data['filePaths']), JSON_THROW_ON_ERROR));
		}
		if (array_key_exists('contacts', $data)) {
			$page->setContactsJson(json_encode($this->content->validateContacts((array)$data['contacts']), JSON_THROW_ON_ERROR));
		}
		foreach (['userIds' => 'setUserIds', 'groupIds' => 'setGroupIds'] as $key => $setter) {
			if (array_key_exists($key, $data)) {
				$page->$setter($this->encodeStrings((array)$data[$key]));
			}
		}
		if ($page->getAccessMode() === 'restricted' && $this->decodeStrings($page->getUserIds()) === [] && $this->decodeStrings($page->getGroupIds()) === []) {
			throw new ValidationException('Select at least one user or group', ['accessMode' => 'principals_required']);
		}
		if (array_key_exists('layout', $data)) {
			if (!in_array($data['layout'], self::LAYOUTS, true)) {
				throw new ValidationException('Invalid page layout', ['layout' => 'invalid']);
			}
			$page->setLayout((string)$data['layout']);
		}
		if (array_key_exists('grouping', $data)) {
			if (!in_array($data['grouping'], self::GROUPING, true)) {
				throw new ValidationException('Invalid page grouping', ['grouping' => 'invalid']);
			}
			$page->setGrouping((string)$data['grouping']);
		}
		if (array_key_exists('visibleFields', $data)) {
			$fields = array_values(array_intersect(self::FIELDS, array_map('strval', (array)$data['visibleFields'])));
			$page->setVisibleFields(json_encode($fields, JSON_THROW_ON_ERROR));
		}
		if (array_key_exists('theme', $data)) {
			$page->setThemeJson(json_encode($this->sanitizeTheme($data['theme']), JSON_THROW_ON_ERROR));
		}
		if (array_key_exists('header', $data)) {
			$page->setHeaderJson(json_encode($this->sanitizeHeader($data['header']), JSON_THROW_ON_ERROR));
		}
		if (array_key_exists('footer', $data)) {
			$page->setFooterJson(json_encode($this->sanitizeFooter($data['footer']), JSON_THROW_ON_ERROR));
		}
	}

	private function requirePublicAccess(LinkPage $page, ?string $password): void {
		$this->requireAvailable($page);
		$user = $this->userSession->getUser();
		if ($user?->getUID() === $page->getOwnerUid()) {
			return;
		}
		if ($page->getAccessMode() === 'public') {
			return;
		}
		if ($page->getAccessMode() === 'password') {
			if ($password === null || !password_verify($password, $page->getPasswordHash() ?? '')) {
				throw new PasswordRequiredException();
			}
			return;
		}
		if ($page->getAccessMode() === 'restricted' && $user !== null) {
			if (in_array($user->getUID(), $this->decodeStrings($page->getUserIds()), true) || array_intersect($this->groups->getUserGroupIds($user), $this->decodeStrings($page->getGroupIds())) !== []) {
				return;
			}
		}
		throw new LinkUnavailableException('Sign in with an account that can access this page', 403, 'forbidden');
	}

	private function requireAvailable(LinkPage $page): void {
		$now = $this->time->getTime();
		if ($page->getDeletedAt() !== null || !$page->getIsActive() || ($page->getStartsAt() !== null && $page->getStartsAt() > $now) || ($page->getExpiresAt() !== null && $page->getExpiresAt() <= $now)) {
			throw new LinkUnavailableException('This page is currently unavailable');
		}
	}

	/** @return list<array<string,mixed>> */
	private function selectedLinks(LinkPage $page, ?array $onlyIds = null): array {
		$folderIds = $onlyIds === null ? $this->decodeIds($page->getFolderIds()) : [];
		$tagIds = $onlyIds === null ? $this->decodeIds($page->getTagIds()) : [];
		$explicit = $onlyIds ?? $this->decodeIds($page->getLinkIds());
		if ($folderIds === [] && $tagIds === [] && $explicit === []) {
			return [];
		}
		$entities = $this->links->findVisible($page->getOwnerUid(), [], ['system' => 'all', 'ownerUid' => $page->getOwnerUid()], 5000, 0);
		$now = $this->time->getTime();
		$result = [];
		foreach ($entities as $link) {
			$linkTags = $this->tags->findForLink($link->getId());
			$matches = in_array($link->getId(), $explicit, true)
				|| ($link->getFolderId() !== null && in_array($link->getFolderId(), $folderIds, true))
				|| array_intersect(array_map(static fn ($tag): int => $tag->getId(), $linkTags), $tagIds) !== [];
			if (!$matches || !$link->getIsActive() || $link->getDeletedAt() !== null || ($link->getStartsAt() !== null && $link->getStartsAt() > $now) || ($link->getExpiresAt() !== null && $link->getExpiresAt() <= $now)) {
				continue;
			}
			$row = $link->toArray($this->linkUrls->forSlug($link->getSlug(), $link->getOwnerUid()), array_map(static fn ($tag): array => $tag->toArray(), $linkTags));
			$row['thumbnailMediaUrl'] = $this->media->url($link, 'thumbnail');
			$row['mediaUrl'] = $this->media->url($link, 'media');
			$row['domain'] = (string)(parse_url($link->getTargetUrl(), PHP_URL_HOST) ?: $link->getTargetUrl());
			$row['folder'] = $this->folder($link);
			$result[] = $row;
		}
		return $result;
	}

	/** @return list<int> */
	private function footerLinkIds(LinkPage $page): array {
		$footer = $this->decodeObject($page->getFooterJson());
		return isset($footer['linkIds']) && is_array($footer['linkIds'])
			? array_slice(array_values(array_unique(array_filter(array_map('intval', $footer['linkIds']), static fn (int $id): bool => $id > 0))), 0, 50)
			: [];
	}

	/** @return array<string,mixed> */
	private function sanitizeTheme(mixed $value): array {
		$value = is_array($value) ? $value : [];
		$preset = in_array($value['preset'] ?? null, self::THEMES, true) ? (string)$value['preset'] : 'nextcloud';
		$defaults = match ($preset) {
			'neutral' => ['primary' => '#59636e', 'background' => '#ffffff', 'surface' => '#f4f4f5', 'text' => '#222222', 'font' => 'system', 'baseSize' => 16, 'scale' => 100],
			'modern' => ['primary' => '#8b5cf6', 'background' => '#0f172a', 'surface' => '#18233b', 'text' => '#f8fafc', 'font' => 'inter', 'baseSize' => 16, 'scale' => 105],
			'editorial' => ['primary' => '#b45309', 'background' => '#f7f1e8', 'surface' => '#fffaf2', 'text' => '#2c2118', 'font' => 'georgia', 'baseSize' => 17, 'scale' => 105],
			default => ['primary' => '#0082c9', 'background' => '#f5f6f8', 'surface' => '#ffffff', 'text' => '#222222', 'font' => 'system', 'baseSize' => 16, 'scale' => 100],
		};
		$result = ['preset' => $preset];
		foreach (['primary', 'background', 'surface', 'text'] as $key) {
			$candidate = (string)($value[$key] ?? $defaults[$key]);
			$result[$key] = preg_match('/^#[0-9a-fA-F]{6}$/D', $candidate) === 1 ? strtolower($candidate) : $defaults[$key];
		}
		$result['font'] = in_array($value['font'] ?? null, self::FONTS, true) ? (string)$value['font'] : $defaults['font'];
		$result['baseSize'] = max(14, min(20, (int)($value['baseSize'] ?? $defaults['baseSize'])));
		$result['scale'] = max(85, min(125, (int)($value['scale'] ?? $defaults['scale'])));
		return $result;
	}

	/** @return array<string,mixed> */
	private function sanitizeHeader(mixed $value): array {
		$value = is_array($value) ? $value : [];
		$result = [];
		foreach (['brand', 'mark', 'title', 'lead', 'owner', 'compact'] as $key) {
			$result[$key] = array_key_exists($key, $value) ? (bool)$value[$key] : $key !== 'compact';
		}
		$result['alignment'] = in_array($value['alignment'] ?? null, self::HEADER_ALIGNMENTS, true) ? (string)$value['alignment'] : 'center';
		return $result;
	}

	/** @return array<string,mixed> */
	private function sanitizeFooter(mixed $value): array {
		$value = is_array($value) ? $value : [];
		return [
			'enabled' => array_key_exists('enabled', $value) ? (bool)$value['enabled'] : true,
			'brand' => array_key_exists('brand', $value) ? (bool)$value['brand'] : true,
			'updated' => array_key_exists('updated', $value) ? (bool)$value['updated'] : true,
			'attribution' => mb_substr(trim((string)($value['attribution'] ?? self::DEFAULT_ATTRIBUTION)), 0, 160),
			'linkIds' => isset($value['linkIds']) && is_array($value['linkIds'])
				? array_slice(array_values(array_unique(array_filter(array_map('intval', $value['linkIds']), static fn (int $id): bool => $id > 0))), 0, 50)
				: [],
		];
	}

	/** @return array{id:int,name:string,icon:string}|null */
	private function folder(ShortLink $link): ?array {
		if ($link->getFolderId() === null) {
			return null;
		}
		try {
			$folder = $this->folders->findForOwner($link->getFolderId(), $link->getOwnerUid());
			return ['id' => $folder->getId(), 'name' => $folder->getName(), 'icon' => $folder->getIcon()];
		} catch (DoesNotExistException) {
			return null;
		}
	}

	/** @return array<string,mixed> */
	private function serialize(LinkPage $page, bool $editable = true): array {
		return [
			'id' => $page->getId(), 'ownerUid' => $page->getOwnerUid(), 'slug' => $page->getSlug(), 'title' => $page->getTitle(), 'lead' => $page->getLead(),
			'accessMode' => $page->getAccessMode(), 'passwordProtected' => $page->getPasswordHash() !== null, 'startsAt' => $page->getStartsAt(), 'expiresAt' => $page->getExpiresAt(),
			'folderIds' => $this->decodeIds($page->getFolderIds()), 'tagIds' => $this->decodeIds($page->getTagIds()), 'linkIds' => $this->decodeIds($page->getLinkIds()),
			'filePaths' => $this->decodeStrings($page->getFilePaths()), 'contacts' => $this->decodeContacts($page->getContactsJson()),
			'userIds' => $this->decodeStrings($page->getUserIds()), 'groupIds' => $this->decodeStrings($page->getGroupIds()), 'layout' => $page->getLayout(), 'grouping' => $page->getGrouping(),
			'visibleFields' => $this->decodeStrings($page->getVisibleFields()), 'theme' => $this->decodeObject($page->getThemeJson()), 'header' => $this->decodeObject($page->getHeaderJson()), 'footer' => $this->decodeObject($page->getFooterJson()),
			'active' => $page->getIsActive(), 'createdAt' => $page->getCreatedAt(), 'updatedAt' => $page->getUpdatedAt(), 'deletedAt' => $page->getDeletedAt(), 'version' => $page->getEntityVersion(),
			'publicUrl' => $this->urls->linkToRouteAbsolute('shortlinks.public_pages.show', ['slug' => $page->getSlug()]), 'canEdit' => $editable,
		];
	}

	private function owned(int $id): LinkPage {
		try {
			$page = $this->pages->find($id);
		} catch (DoesNotExistException) {
			throw new NotFoundException();
		}
		if ($page->getOwnerUid() !== $this->policy->currentUid() && !$this->policy->canManageAll()) {
			throw new ForbiddenException();
		}
		return $page;
	}

	private function pageSlug(string $title): string {
		$base = strtolower(trim((string)preg_replace('/[^\pL\pN]+/u', '-', $title), '-')) ?: 'page';
		for ($i = 0; $i < 100; ++$i) {
			$candidate = substr($base, 0, 110) . ($i === 0 ? '' : '-' . ($i + 1));
			try {
				$candidate = $this->slugs->normalize($candidate);
			} catch (ValidationException) {
				$candidate = 'page-' . bin2hex(random_bytes(4));
			}
			if (!$this->pages->slugExists($candidate)) {
				return $candidate;
			}
		}
		return 'page-' . bin2hex(random_bytes(6));
	}

	/** @param list<mixed> $values */
	private function encodeIds(array $values): string {
		return json_encode(array_slice(array_values(array_unique(array_filter(array_map('intval', $values), static fn (int $id): bool => $id > 0))), 0, 5000), JSON_THROW_ON_ERROR);
	}
	/** @param list<mixed> $values */
	private function encodeStrings(array $values): string {
		return json_encode(array_slice(array_values(array_unique(array_filter(array_map(static fn (mixed $v): string => substr(trim((string)$v), 0, 64), $values)))), 0, 500), JSON_THROW_ON_ERROR);
	}
	/** @return list<int> */
	private function decodeIds(string $json): array {
		$value = json_decode($json, true);
		return is_array($value) ? array_values(array_map('intval', $value)) : [];
	}
	/** @return list<string> */
	private function decodeStrings(?string $json): array {
		$value = json_decode($json ?? '[]', true);
		return is_array($value) ? array_values(array_map('strval', $value)) : [];
	}
	/** @return list<array<string,mixed>> */
	private function decodeContacts(?string $json): array {
		$value = json_decode($json ?? '[]', true);
		return is_array($value) ? array_values(array_filter($value, 'is_array')) : [];
	}
	/** @return array<string,mixed> */
	private function decodeObject(string $json): array {
		$value = json_decode($json, true);
		return is_array($value) ? $value : [];
	}
}
