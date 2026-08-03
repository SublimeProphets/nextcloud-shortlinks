<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ClickEvent;
use OCA\Shortlinks\Db\ClickEventMapper;
use OCA\Shortlinks\Db\Folder;
use OCA\Shortlinks\Db\FolderMapper;
use OCA\Shortlinks\Db\LinkPage;
use OCA\Shortlinks\Db\LinkPageMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Db\Tag;
use OCA\Shortlinks\Db\TagMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\IUserManager;

final class DemoDataService {
	public const DEMO_PASSWORD = 'shortlinks-demo';

	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly FolderMapper $folders,
		private readonly TagMapper $tags,
		private readonly LinkPageMapper $pages,
		private readonly ClickEventMapper $clicks,
		private readonly IUserManager $users,
		private readonly ITimeFactory $time,
		private readonly IDBConnection $db,
	) {
	}

	/** @return array{cleaned:bool,folders:int,tags:int,links:int,pages:int,clicks:int,password:string} */
	public function seed(string $uid, bool $clean = false): array {
		if ($this->users->get($uid) === null) {
			throw new \InvalidArgumentException('User does not exist');
		}

		$this->db->beginTransaction();
		try {
			if ($clean) {
				$this->cleanForUser($uid);
			}
			$now = $this->time->getTime();
			$folderIds = $this->ensureFolders($uid, $now);
			$tagIds = $this->ensureTags($uid, $now);
			$linkResult = $this->ensureLinks($uid, $folderIds, $tagIds, $now);
			$pageCount = $this->ensurePages($uid, $folderIds, $tagIds, $linkResult['useCases'], $now);
			$this->db->commit();
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}

		return [
			'cleaned' => $clean,
			'folders' => count($folderIds),
			'tags' => count($tagIds),
			'links' => $linkResult['links'],
			'pages' => $pageCount,
			'clicks' => $linkResult['clicks'],
			'password' => self::DEMO_PASSWORD,
		];
	}

	private function cleanForUser(string $uid): void {
		$linkIds = $this->idsForOwner('shortlinks_links', $uid);
		foreach (['shortlinks_link_tags', 'shortlinks_permissions', 'shortlinks_clicks', 'shortlinks_daily_stats'] as $table) {
			$this->deleteForIds($table, 'link_id', $linkIds);
		}
		foreach (['shortlinks_page_versions', 'shortlinks_pages', 'shortlinks_audit', 'shortlinks_api_tokens', 'shortlinks_import_jobs', 'shortlinks_links', 'shortlinks_tags', 'shortlinks_folders'] as $table) {
			$this->deleteForOwner($table, $uid);
		}
	}

	/** @return list<int> */
	private function idsForOwner(string $table, string $uid): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('id')->from($table)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($uid)));
		$result = $qb->executeQuery();
		$ids = [];
		while (($id = $result->fetchOne()) !== false) {
			$ids[] = (int)$id;
		}
		$result->closeCursor();
		return $ids;
	}

	/** @param list<int> $ids */
	private function deleteForIds(string $table, string $column, array $ids): void {
		if ($ids === []) {
			return;
		}
		$qb = $this->db->getQueryBuilder();
		$qb->delete($table)->where($qb->expr()->in($column, $qb->createNamedParameter($ids, IQueryBuilder::PARAM_INT_ARRAY)))->executeStatement();
	}

	private function deleteForOwner(string $table, string $uid): void {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($table)->where($qb->expr()->eq('owner_uid', $qb->createNamedParameter($uid)))->executeStatement();
	}

	/** @return array<string,int> */
	private function ensureFolders(string $uid, int $now): array {
		$existing = $this->folders->findAllForOwner($uid);
		$ids = [];
		foreach (self::folderDefinitions() as $definition) {
			$parentId = $definition['parent'] === null ? null : $ids[$definition['parent']];
			$folder = $this->matchingFolder($existing, $parentId, $definition['name']);
			if ($folder === null) {
				$folder = new Folder();
				$folder->setOwnerUid($uid);
				$folder->setParentId($parentId);
				$folder->setParentKey($parentId ?? 0);
				$folder->setName($definition['name']);
				$folder->setNormalizedName(mb_strtolower($definition['name']));
				$folder->setIcon($definition['icon']);
				$folder->setPosition($definition['position']);
				$folder->setCreatedAt($now);
				$folder->setUpdatedAt($now);
				$folder = $this->folders->insert($folder);
				$existing[] = $folder;
			}
			$ids[$definition['key']] = $folder->getId();
		}
		return $ids;
	}

	/** @param list<Folder> $folders */
	private function matchingFolder(array $folders, ?int $parentId, string $name): ?Folder {
		$normalized = mb_strtolower($name);
		foreach ($folders as $folder) {
			if ($folder->getParentId() === $parentId && $folder->getNormalizedName() === $normalized) {
				return $folder;
			}
		}
		return null;
	}

	/** @return array<string,int> */
	private function ensureTags(string $uid, int $now): array {
		$existing = $this->tags->findAllForOwner($uid);
		$byName = [];
		foreach ($existing as $tag) {
			$byName[$tag->getNormalizedName()] = $tag;
		}
		$ids = [];
		foreach (self::tagDefinitions() as $definition) {
			$normalized = mb_strtolower($definition['name']);
			$tag = $byName[$normalized] ?? null;
			if ($tag === null) {
				$tag = new Tag();
				$tag->setOwnerUid($uid);
				$tag->setName($definition['name']);
				$tag->setNormalizedName($normalized);
				$tag->setColor($definition['color']);
				$tag->setCreatedAt($now);
				$tag->setUpdatedAt($now);
				$tag = $this->tags->insert($tag);
				$byName[$normalized] = $tag;
			}
			$ids[$definition['key']] = $tag->getId();
		}
		return $ids;
	}

	/**
	 * @param array<string,int> $folderIds
	 * @param array<string,int> $tagIds
	 * @return array{links:int,clicks:int,useCases:array<string,list<int>>}
	 */
	private function ensureLinks(string $uid, array $folderIds, array $tagIds, int $now): array {
		$useCases = ['tech' => [], 'music' => [], 'agency' => []];
		$totalClicks = 0;
		foreach (self::linkDefinitions() as $index => $definition) {
			[$slug, $link] = $this->demoLink($uid, $definition['key']);
			if ($link !== null) {
				$this->resetLinkRelations($link->getId());
			} else {
				$link = new ShortLink();
			}
			$createdAt = $now - $definition['daysAgo'] * 86400;
			$link->setOwnerUid($uid);
			$link->setFolderId($folderIds[$definition['folder']] ?? null);
			$link->setSlug($slug);
			$link->setSlugHash(hash('sha256', $slug));
			$link->setTargetUrl($definition['url']);
			$link->setTargetHash(hash('sha256', $definition['url']));
			$link->setTitle($definition['title']);
			$link->setThumbnailUrl(null);
			$link->setThumbnailPath(null);
			$link->setThumbnailRefreshedAt(null);
			$link->setMediaPath(null);
			$link->setMediaMime(null);
			$link->setColor($definition['color']);
			$link->setDescription($this->description($definition));
			$link->setIsFavorite($definition['favorite']);
			$link->setIsActive($definition['active']);
			$link->setAccessMode($definition['access']);
			$link->setPasswordHash($definition['access'] === 'password' ? password_hash(self::DEMO_PASSWORD, PASSWORD_DEFAULT) : null);
			$link->setRedirectStatus($definition['status']);
			$link->setStartsAt(isset($definition['startsIn']) ? $now + $definition['startsIn'] * 86400 : null);
			$link->setExpiresAt(isset($definition['expiresIn']) ? $now + $definition['expiresIn'] * 86400 : (isset($definition['expiredAgo']) ? $now - $definition['expiredAgo'] * 86400 : null));
			$link->setClickLimit($definition['clickLimit']);
			$link->setClickCount($definition['clicks']);
			$link->setLastClickedAt($definition['clicks'] > 0 ? $now - (($index + 1) * 317 % 7200) : null);
			$link->setCreatedAt($createdAt);
			$link->setUpdatedAt(max($createdAt, $now - (($index % 5) + 1) * 3600));
			$link->setDeletedAt($definition['deleted'] ? $now - 86400 : null);
			$link->setEntityVersion(1);
			$link = $link->getId() === null ? $this->links->insert($link) : $this->links->update($link);

			$assignedTags = [];
			foreach ($definition['tags'] as $tagKey) {
				$assignedTags[] = $tagIds[$tagKey];
			}
			$this->tags->replaceForLink($link->getId(), $assignedTags);
			$totalClicks += $this->seedAnalytics($link, $definition, $uid, $now, $index);
			$useCases[$definition['useCase']][] = $link->getId();
		}
		return ['links' => count(self::linkDefinitions()), 'clicks' => $totalClicks, 'useCases' => $useCases];
	}

	/** @return array{0:string,1:?ShortLink} */
	private function demoLink(string $uid, string $key): array {
		$base = substr('demo-' . $key . '-' . substr(hash('sha256', $uid), 0, 8), 0, 118);
		for ($attempt = 0; $attempt < 20; ++$attempt) {
			$slug = $base . ($attempt === 0 ? '' : '-' . ($attempt + 1));
			try {
				$link = $this->links->findBySlug($slug);
				if ($link->getOwnerUid() === $uid) {
					return [$slug, $link];
				}
			} catch (DoesNotExistException) {
				return [$slug, null];
			}
		}
		throw new \RuntimeException('Could not reserve a demo link alias');
	}

	private function resetLinkRelations(int $linkId): void {
		foreach (['shortlinks_link_tags', 'shortlinks_permissions', 'shortlinks_clicks', 'shortlinks_daily_stats'] as $table) {
			$qb = $this->db->getQueryBuilder();
			$qb->delete($table)->where($qb->expr()->eq('link_id', $qb->createNamedParameter($linkId, IQueryBuilder::PARAM_INT)))->executeStatement();
		}
	}

	/** @param array<string,mixed> $definition */
	private function description(array $definition): string {
		$useCase = match ($definition['useCase']) {
			'tech' => 'tech-startup operations',
			'music' => 'music production and releases',
			default => 'design-agency delivery',
		};
		return sprintf(
			'Demo for %s: %s access, HTTP %d, %s workflow, and plausible analytics.',
			$useCase,
			$definition['access'],
			$definition['status'],
			implode(' + ', $definition['tags']),
		);
	}

	/**
	 * @param array<string,mixed> $definition
	 * @return int
	 */
	private function seedAnalytics(ShortLink $link, array $definition, string $uid, int $now, int $linkIndex): int {
		$clickCount = $definition['clicks'];
		if ($clickCount === 0) {
			return 0;
		}
		$profiles = self::visitorProfiles();
		$spanDays = max(1, min(60, $definition['daysAgo']));
		$uniquePool = max(1, (int)ceil($clickCount * 0.68));
		/** @var array<string,array{linkId:int,day:string,dimension:string,value:string,clicks:int,visitors:array<string,true>}> $buckets */
		$buckets = [];
		for ($click = 0; $click < $clickCount; ++$click) {
			$profile = $profiles[($click * 7 + $linkIndex * 3) % count($profiles)];
			$fraction = (($click * 37 + $linkIndex * 53) % 1000) / 1000;
			$dayOffset = (int)floor($fraction * $fraction * $spanDays);
			$seconds = ($click * 1297 + $linkIndex * 811) % 72000;
			$clickedAt = max($link->getCreatedAt() + 60, $now - $dayOffset * 86400 - $seconds);
			$visitorHash = hash('sha256', 'shortlinks-demo|' . $uid . '|' . $link->getId() . '|' . ($click % $uniquePool));
			$authenticated = $click % 9 === 0;
			$isBot = $click > 0 && $click % 47 === 0;
			$event = new ClickEvent();
			$event->setLinkId($link->getId());
			$event->setClickedAt(min($now - 1, $clickedAt));
			$event->setUserUid($authenticated ? $uid : null);
			$event->setVisitorHash($visitorHash);
			$event->setReferrerType($profile['referrer'] === null ? 'direct' : 'external');
			$event->setReferrerDomain($profile['referrer']);
			$event->setReferrerUrl(null);
			$event->setBrowser($profile['browser']);
			$event->setBrowserVersion($profile['browserVersion']);
			$event->setOs($profile['os']);
			$event->setOsVersion($profile['osVersion']);
			$event->setDeviceType($profile['device']);
			$event->setCountry($profile['country']);
			$event->setRegion($profile['region']);
			$event->setIsBot($isBot);
			$event->setOutcome('redirected');
			$this->clicks->insert($event);

			$dimensions = [
				'total' => 'all',
				'referrer' => $profile['referrer'] ?? '(direct)',
				'browser' => $profile['browser'],
				'os' => $profile['os'],
				'device' => $profile['device'],
				'country' => $profile['country'],
				'region' => $profile['region'],
				'bot' => $isBot ? 'bot' : 'human',
				'authentication' => $authenticated ? 'authenticated' : 'anonymous',
			];
			$day = gmdate('Y-m-d', $event->getClickedAt());
			foreach ($dimensions as $dimension => $value) {
				$key = implode("\x1f", [$link->getId(), $day, $dimension, $value]);
				$buckets[$key] ??= ['linkId' => $link->getId(), 'day' => $day, 'dimension' => $dimension, 'value' => $value, 'clicks' => 0, 'visitors' => []];
				++$buckets[$key]['clicks'];
				$buckets[$key]['visitors'][$visitorHash] = true;
			}
		}

		foreach ($buckets as $bucket) {
			$qb = $this->db->getQueryBuilder();
			$qb->insert('shortlinks_daily_stats')->values([
				'link_id' => $qb->createNamedParameter($bucket['linkId'], IQueryBuilder::PARAM_INT),
				'day' => $qb->createNamedParameter($bucket['day']),
				'dimension' => $qb->createNamedParameter($bucket['dimension']),
				'dimension_value' => $qb->createNamedParameter($bucket['value']),
				'clicks' => $qb->createNamedParameter($bucket['clicks'], IQueryBuilder::PARAM_INT),
				'unique_visitors' => $qb->createNamedParameter(count($bucket['visitors']), IQueryBuilder::PARAM_INT),
			])->executeStatement();
		}
		return $clickCount;
	}

	/**
	 * @param array<string,int> $folderIds
	 * @param array<string,int> $tagIds
	 * @param array<string,list<int>> $useCases
	 */
	private function ensurePages(string $uid, array $folderIds, array $tagIds, array $useCases, int $now): int {
		foreach (self::pageDefinitions() as $definition) {
			[$slug, $page] = $this->demoPage($uid, $definition['key']);
			$page ??= new LinkPage();
			if ($page->getId() === null) {
				foreach (['setFolderIds', 'setTagIds', 'setLinkIds', 'setFilePaths', 'setContactsJson', 'setUserIds', 'setGroupIds', 'setVisibleFields', 'setThemeJson', 'setHeaderJson', 'setFooterJson'] as $setter) {
					$page->$setter('__initialize__');
				}
			}
			$linkIds = $useCases[$definition['useCase']];
			$page->setOwnerUid($uid);
			$page->setSlug($slug);
			$page->setSlugHash(hash('sha256', $slug));
			$page->setTitle($definition['title']);
			$page->setLead($definition['lead']);
			$page->setAccessMode($definition['access']);
			$page->setPasswordHash($definition['access'] === 'password' ? password_hash(self::DEMO_PASSWORD, PASSWORD_DEFAULT) : null);
			$page->setStartsAt(null);
			$page->setExpiresAt(null);
			$page->setFolderIds($this->jsonIds(array_map(static fn (string $key): int => $folderIds[$key], $definition['folders'])));
			$page->setTagIds($this->jsonIds(array_map(static fn (string $key): int => $tagIds[$key], $definition['tags'])));
			$page->setLinkIds($this->jsonIds($linkIds));
			$page->setFilePaths('[]');
			$page->setContactsJson('[]');
			$page->setUserIds('[]');
			$page->setGroupIds('[]');
			$page->setLayout($definition['layout']);
			$page->setGrouping($definition['grouping']);
			$page->setVisibleFields(json_encode($definition['fields'], JSON_THROW_ON_ERROR));
			$page->setThemeJson(json_encode($definition['theme'], JSON_THROW_ON_ERROR));
			$page->setHeaderJson(json_encode($definition['header'], JSON_THROW_ON_ERROR));
			$page->setFooterJson(json_encode([
				'enabled' => true,
				'brand' => true,
				'updated' => true,
				'attribution' => $definition['attribution'],
				'linkIds' => array_slice($linkIds, 0, 3),
			], JSON_THROW_ON_ERROR));
			$page->setIsActive(true);
			$page->setCreatedAt($now - $definition['daysAgo'] * 86400);
			$page->setUpdatedAt($now - $definition['daysAgo'] * 1800);
			$page->setDeletedAt(null);
			$page->setEntityVersion(1);
			$page->getId() === null ? $this->pages->insert($page) : $this->pages->update($page);
		}
		return count(self::pageDefinitions());
	}

	/** @return array{0:string,1:?LinkPage} */
	private function demoPage(string $uid, string $key): array {
		$base = substr('demo-' . $key . '-' . substr(hash('sha256', $uid), 0, 8), 0, 118);
		for ($attempt = 0; $attempt < 20; ++$attempt) {
			$slug = $base . ($attempt === 0 ? '' : '-' . ($attempt + 1));
			try {
				$page = $this->pages->findBySlug($slug);
				if ($page->getOwnerUid() === $uid) {
					return [$slug, $page];
				}
			} catch (DoesNotExistException) {
				return [$slug, null];
			}
		}
		throw new \RuntimeException('Could not reserve a demo page address');
	}

	/** @param list<int> $ids */
	private function jsonIds(array $ids): string {
		return json_encode(array_values(array_unique($ids)), JSON_THROW_ON_ERROR);
	}

	/** @return list<array{key:string,name:string,icon:string,position:int,parent:?string}> */
	private static function folderDefinitions(): array {
		return [
			['key' => 'projects', 'name' => 'Projects & Releases', 'icon' => 'projects', 'position' => 0, 'parent' => null],
			['key' => 'launches', 'name' => 'Launches & Releases', 'icon' => 'star', 'position' => 0, 'parent' => 'projects'],
			['key' => 'roadmap', 'name' => 'Roadmap & Backlog', 'icon' => 'projects', 'position' => 1, 'parent' => 'projects'],
			['key' => 'clients', 'name' => 'Clients & Campaigns', 'icon' => 'work', 'position' => 1, 'parent' => null],
			['key' => 'activeClients', 'name' => 'Active Clients', 'icon' => 'work', 'position' => 0, 'parent' => 'clients'],
			['key' => 'reviews', 'name' => 'Reviews & Approvals', 'icon' => 'star', 'position' => 1, 'parent' => 'clients'],
			['key' => 'archive', 'name' => 'Archive', 'icon' => 'archive', 'position' => 2, 'parent' => 'clients'],
			['key' => 'inspiration', 'name' => 'Knowledge & Inspiration', 'icon' => 'personal', 'position' => 2, 'parent' => null],
			['key' => 'operations', 'name' => 'Operations & Tools', 'icon' => 'folder', 'position' => 3, 'parent' => null],
		];
	}

	/** @return list<array{key:string,name:string,color:string}> */
	private static function tagDefinitions(): array {
		return [
			['key' => 'inbox', 'name' => 'Inbox', 'color' => '#64748b'],
			['key' => 'progress', 'name' => 'In progress', 'color' => '#3b82f6'],
			['key' => 'review', 'name' => 'Review', 'color' => '#f59e0b'],
			['key' => 'approved', 'name' => 'Approved', 'color' => '#22c55e'],
			['key' => 'urgent', 'name' => 'Urgent', 'color' => '#ef4444'],
			['key' => 'client', 'name' => 'Client', 'color' => '#8b5cf6'],
			['key' => 'internal', 'name' => 'Internal', 'color' => '#14b8a6'],
			['key' => 'evergreen', 'name' => 'Evergreen', 'color' => '#6366f1'],
		];
	}

	/** @return list<array<string,mixed>> */
	private static function linkDefinitions(): array {
		$targets = [
			['key' => 'github-startup', 'useCase' => 'tech', 'url' => 'https://github.com/', 'title' => 'GitHub — startup code', 'folder' => 'roadmap', 'tags' => ['internal', 'progress'], 'clicks' => 72, 'daysAgo' => 48],
			['key' => 'github-docs', 'useCase' => 'tech', 'url' => 'https://docs.github.com/en', 'title' => 'GitHub Docs — dev onboarding', 'folder' => 'operations', 'tags' => ['evergreen', 'internal'], 'clicks' => 28, 'daysAgo' => 44],
			['key' => 'linear-roadmap', 'useCase' => 'tech', 'url' => 'https://linear.app/', 'title' => 'Linear — product roadmap', 'folder' => 'roadmap', 'tags' => ['progress', 'urgent'], 'clicks' => 55, 'daysAgo' => 38],
			['key' => 'notion-wiki', 'useCase' => 'tech', 'url' => 'https://www.notion.so/', 'title' => 'Notion — startup wiki', 'folder' => 'operations', 'tags' => ['internal', 'evergreen'], 'clicks' => 41, 'daysAgo' => 35],
			['key' => 'figma-product', 'useCase' => 'tech', 'url' => 'https://www.figma.com/', 'title' => 'Figma — product review', 'folder' => 'roadmap', 'tags' => ['review', 'client'], 'clicks' => 63, 'daysAgo' => 31],
			['key' => 'sentry-incidents', 'useCase' => 'tech', 'url' => 'https://sentry.io/', 'title' => 'Sentry — incident response', 'folder' => 'operations', 'tags' => ['urgent', 'internal', 'progress'], 'clicks' => 19, 'daysAgo' => 29, 'favorite' => true, 'access' => 'authenticated', 'status' => 307, 'expiresIn' => 30, 'clickLimit' => 120],
			['key' => 'stripe-billing', 'useCase' => 'tech', 'url' => 'https://docs.stripe.com/', 'title' => 'Stripe Docs — billing launch', 'folder' => 'launches', 'tags' => ['review', 'approved'], 'clicks' => 36, 'daysAgo' => 25],
			['key' => 'vercel-deploy', 'useCase' => 'tech', 'url' => 'https://vercel.com/docs', 'title' => 'Vercel Docs — deployment', 'folder' => 'operations', 'tags' => ['evergreen', 'internal'], 'clicks' => 24, 'daysAgo' => 22],
			['key' => 'posthog-analytics', 'useCase' => 'tech', 'url' => 'https://posthog.com/', 'title' => 'PostHog — growth analytics', 'folder' => 'operations', 'tags' => ['client', 'progress'], 'clicks' => 88, 'daysAgo' => 20],
			['key' => 'cloudflare-edge', 'useCase' => 'tech', 'url' => 'https://developers.cloudflare.com/', 'title' => 'Cloudflare Docs — edge ops', 'folder' => 'operations', 'tags' => ['evergreen', 'urgent'], 'clicks' => 47, 'daysAgo' => 18],
			['key' => 'nextcloud-deck', 'useCase' => 'tech', 'url' => 'https://apps.nextcloud.com/apps/deck', 'title' => 'Nextcloud Deck — team flow', 'folder' => 'roadmap', 'tags' => ['progress', 'internal'], 'clicks' => 15, 'daysAgo' => 12],
			['key' => 'owasp-security', 'useCase' => 'tech', 'url' => 'https://owasp.org/www-project-top-ten/', 'title' => 'OWASP Top 10 — security review', 'folder' => 'operations', 'tags' => ['review', 'urgent', 'evergreen'], 'clicks' => 12, 'daysAgo' => 8],

			['key' => 'ableton-studio', 'useCase' => 'music', 'url' => 'https://www.ableton.com/', 'title' => 'Ableton — studio production', 'folder' => 'launches', 'tags' => ['progress', 'internal'], 'clicks' => 54, 'daysAgo' => 56],
			['key' => 'learning-music', 'useCase' => 'music', 'url' => 'https://learningmusic.ableton.com/', 'title' => 'Learning Music — songwriting', 'folder' => 'inspiration', 'tags' => ['evergreen', 'inbox'], 'clicks' => 26, 'daysAgo' => 52],
			['key' => 'bandcamp-release', 'useCase' => 'music', 'url' => 'https://bandcamp.com/', 'title' => 'Bandcamp — release sales', 'folder' => 'launches', 'tags' => ['approved', 'client'], 'clicks' => 39, 'daysAgo' => 46],
			['key' => 'soundcloud-demos', 'useCase' => 'music', 'url' => 'https://soundcloud.com/', 'title' => 'SoundCloud — private demos', 'folder' => 'reviews', 'tags' => ['review', 'client'], 'clicks' => 48, 'daysAgo' => 42],
			['key' => 'spotify-artists', 'useCase' => 'music', 'url' => 'https://artists.spotify.com/', 'title' => 'Spotify for Artists — insights', 'folder' => 'launches', 'tags' => ['approved', 'client'], 'clicks' => 84, 'daysAgo' => 39],
			['key' => 'apple-artists', 'useCase' => 'music', 'url' => 'https://artists.apple.com/', 'title' => 'Apple Music Artists — audience', 'folder' => 'launches', 'tags' => ['client', 'progress'], 'clicks' => 31, 'daysAgo' => 34],
			['key' => 'musicbrainz-meta', 'useCase' => 'music', 'url' => 'https://musicbrainz.org/', 'title' => 'MusicBrainz — release metadata', 'folder' => 'operations', 'tags' => ['review', 'evergreen'], 'clicks' => 22, 'daysAgo' => 30],
			['key' => 'discogs-reference', 'useCase' => 'music', 'url' => 'https://www.discogs.com/', 'title' => 'Discogs — catalog reference', 'folder' => 'inspiration', 'tags' => ['evergreen', 'inbox'], 'clicks' => 18, 'daysAgo' => 27],
			['key' => 'landr-mastering', 'useCase' => 'music', 'url' => 'https://www.landr.com/', 'title' => 'LANDR — mastering review', 'folder' => 'reviews', 'tags' => ['review', 'urgent'], 'clicks' => 27, 'daysAgo' => 24],
			['key' => 'distrokid-release', 'useCase' => 'music', 'url' => 'https://distrokid.com/', 'title' => 'DistroKid — distribution', 'folder' => 'launches', 'tags' => ['approved', 'urgent'], 'clicks' => 16, 'daysAgo' => 19],
			['key' => 'splice-samples', 'useCase' => 'music', 'url' => 'https://splice.com/', 'title' => 'Splice — sample library', 'folder' => 'inspiration', 'tags' => ['inbox', 'internal'], 'clicks' => 43, 'daysAgo' => 15],
			['key' => 'youtube-studio', 'useCase' => 'music', 'url' => 'https://studio.youtube.com/', 'title' => 'YouTube Studio — video launch', 'folder' => 'launches', 'tags' => ['progress', 'client'], 'clicks' => 58, 'daysAgo' => 11],

			['key' => 'behance-portfolio', 'useCase' => 'agency', 'url' => 'https://www.behance.net/', 'title' => 'Behance — agency portfolio', 'folder' => 'activeClients', 'tags' => ['client', 'approved'], 'clicks' => 45, 'daysAgo' => 58],
			['key' => 'dribbble-inspiration', 'useCase' => 'agency', 'url' => 'https://dribbble.com/', 'title' => 'Dribbble — visual research', 'folder' => 'inspiration', 'tags' => ['inbox', 'evergreen'], 'clicks' => 67, 'daysAgo' => 51],
			['key' => 'adobe-fonts', 'useCase' => 'agency', 'url' => 'https://fonts.adobe.com/', 'title' => 'Adobe Fonts — brand type', 'folder' => 'reviews', 'tags' => ['review', 'client'], 'clicks' => 29, 'daysAgo' => 47],
			['key' => 'google-fonts', 'useCase' => 'agency', 'url' => 'https://fonts.google.com/', 'title' => 'Google Fonts — web type', 'folder' => 'inspiration', 'tags' => ['evergreen', 'approved'], 'clicks' => 52, 'daysAgo' => 43],
			['key' => 'coolors-palette', 'useCase' => 'agency', 'url' => 'https://coolors.co/', 'title' => 'Coolors — client palette', 'folder' => 'activeClients', 'tags' => ['client', 'review'], 'clicks' => 34, 'daysAgo' => 37],
			['key' => 'unsplash-direction', 'useCase' => 'agency', 'url' => 'https://unsplash.com/', 'title' => 'Unsplash — art direction', 'folder' => 'inspiration', 'tags' => ['inbox', 'client'], 'clicks' => 61, 'daysAgo' => 33],
			['key' => 'awwwards-web', 'useCase' => 'agency', 'url' => 'https://www.awwwards.com/', 'title' => 'Awwwards — web inspiration', 'folder' => 'inspiration', 'tags' => ['evergreen', 'inbox'], 'clicks' => 23, 'daysAgo' => 28],
			['key' => 'nng-ux', 'useCase' => 'agency', 'url' => 'https://www.nngroup.com/articles/', 'title' => 'NN/g — UX research', 'folder' => 'operations', 'tags' => ['evergreen', 'internal'], 'clicks' => 37, 'daysAgo' => 23],
			['key' => 'material-design', 'useCase' => 'agency', 'url' => 'https://m3.material.io/', 'title' => 'Material Design — UI system', 'folder' => 'operations', 'tags' => ['internal', 'approved'], 'clicks' => 40, 'daysAgo' => 18],
			['key' => 'wcag-accessibility', 'useCase' => 'agency', 'url' => 'https://www.w3.org/WAI/standards-guidelines/wcag/', 'title' => 'WCAG — accessibility review', 'folder' => 'reviews', 'tags' => ['review', 'urgent', 'evergreen'], 'clicks' => 14, 'daysAgo' => 14],
			['key' => 'pexels-campaign', 'useCase' => 'agency', 'url' => 'https://www.pexels.com/', 'title' => 'Pexels — campaign assets', 'folder' => 'activeClients', 'tags' => ['client', 'progress'], 'clicks' => 49, 'daysAgo' => 9],
			['key' => 'canva-school', 'useCase' => 'agency', 'url' => 'https://www.canva.com/designschool/', 'title' => 'Canva Design School — handoff', 'folder' => 'archive', 'tags' => ['approved', 'evergreen'], 'clicks' => 20, 'daysAgo' => 6],
		];

		$colors = ['#2563eb', '#7c3aed', '#0891b2', '#db2777', '#16a34a', null];
		$access = ['public', 'authenticated', 'password'];
		$statuses = [302, 301, 307, 308];
		foreach ($targets as $index => &$target) {
			$target = array_replace([
				'favorite' => $index % 5 === 0,
				'active' => true,
				'access' => $access[$index % count($access)],
				'status' => $statuses[$index % count($statuses)],
				'color' => $colors[$index % count($colors)],
				'clickLimit' => $index % 8 === 0 ? $target['clicks'] + 25 : null,
				'deleted' => false,
			], $target);
		}
		unset($target);

		$targets[8]['startsIn'] = 3;
		$targets[8]['clicks'] = 0;
		$targets[10]['active'] = false;
		$targets[10]['access'] = 'disabled';
		$targets[17]['expiresIn'] = 14;
		$targets[20]['expiredAgo'] = 2;
		$targets[22]['active'] = false;
		$targets[22]['access'] = 'disabled';
		$targets[27]['expiresIn'] = 45;
		$targets[32]['deleted'] = true;
		$targets[34]['active'] = false;
		$targets[34]['access'] = 'disabled';
		return $targets;
	}

	/** @return list<array<string,mixed>> */
	private static function pageDefinitions(): array {
		return [
			[
				'key' => 'tech-startup', 'useCase' => 'tech', 'title' => 'Nova Labs — Launch Hub',
				'lead' => 'Product, engineering, launch operations, and the links a fast-moving startup needs every day.',
				'access' => 'public', 'folders' => [], 'tags' => [], 'layout' => 'tiles', 'grouping' => 'folder', 'daysAgo' => 5,
				'fields' => ['title', 'description', 'thumbnail', 'domain', 'shortUrl', 'clicks', 'folder', 'tags'],
				'theme' => ['preset' => 'modern', 'primary' => '#22d3ee', 'background' => '#07111f', 'surface' => '#10233c', 'text' => '#f8fafc', 'font' => 'inter', 'baseSize' => 16, 'scale' => 105],
				'header' => ['brand' => true, 'mark' => true, 'title' => true, 'lead' => true, 'owner' => true, 'compact' => false, 'alignment' => 'left'],
				'attribution' => 'Curated by Nova Labs with Nextcloud Shortlinks',
			],
			[
				'key' => 'music-producer', 'useCase' => 'music', 'title' => 'Midnight Echo — Release Room',
				'lead' => 'Private demos, release services, audience dashboards, and inspiration for the next record.',
				'access' => 'password', 'folders' => [], 'tags' => [], 'layout' => 'spaced', 'grouping' => 'tag', 'daysAgo' => 4,
				'fields' => ['title', 'description', 'thumbnail', 'media', 'domain', 'shortUrl', 'folder', 'tags'],
				'theme' => ['preset' => 'editorial', 'primary' => '#c2410c', 'background' => '#f7efe4', 'surface' => '#fffaf3', 'text' => '#2b1d16', 'font' => 'georgia', 'baseSize' => 18, 'scale' => 108],
				'header' => ['brand' => false, 'mark' => true, 'title' => true, 'lead' => true, 'owner' => false, 'compact' => false, 'alignment' => 'center'],
				'attribution' => 'Midnight Echo release resources — private working collection',
			],
			[
				'key' => 'design-agency', 'useCase' => 'agency', 'title' => 'Northstar Studio — Client Toolkit',
				'lead' => 'A polished collection for discovery, visual direction, accessibility, production, and client approval.',
				'access' => 'private', 'folders' => [], 'tags' => [], 'layout' => 'cards', 'grouping' => 'folder', 'daysAgo' => 3,
				'fields' => ['title', 'description', 'thumbnail', 'media', 'domain', 'clicks', 'folder', 'tags'],
				'theme' => ['preset' => 'neutral', 'primary' => '#e11d48', 'background' => '#fff7f8', 'surface' => '#ffffff', 'text' => '#241b1d', 'font' => 'poppins', 'baseSize' => 16, 'scale' => 100],
				'header' => ['brand' => true, 'mark' => false, 'title' => true, 'lead' => true, 'owner' => true, 'compact' => true, 'alignment' => 'left'],
				'attribution' => 'Selected by Northstar Studio for client collaboration',
			],
		];
	}

	/** @return list<array{referrer:?string,browser:string,browserVersion:string,os:string,osVersion:string,device:string,country:string,region:string}> */
	private static function visitorProfiles(): array {
		return [
			['referrer' => null, 'browser' => 'Chrome', 'browserVersion' => '126', 'os' => 'Windows', 'osVersion' => '11', 'device' => 'desktop', 'country' => 'CH', 'region' => 'Zurich'],
			['referrer' => 'google.com', 'browser' => 'Safari', 'browserVersion' => '17', 'os' => 'macOS', 'osVersion' => '14', 'device' => 'desktop', 'country' => 'DE', 'region' => 'Berlin'],
			['referrer' => 'linkedin.com', 'browser' => 'Chrome Mobile', 'browserVersion' => '126', 'os' => 'Android', 'osVersion' => '14', 'device' => 'smartphone', 'country' => 'US', 'region' => 'California'],
			['referrer' => 'instagram.com', 'browser' => 'Mobile Safari', 'browserVersion' => '17', 'os' => 'iOS', 'osVersion' => '17', 'device' => 'smartphone', 'country' => 'GB', 'region' => 'London'],
			['referrer' => 'behance.net', 'browser' => 'Firefox', 'browserVersion' => '128', 'os' => 'Linux', 'osVersion' => '6', 'device' => 'desktop', 'country' => 'FR', 'region' => 'Ile-de-France'],
			['referrer' => 'newsletter.example', 'browser' => 'Edge', 'browserVersion' => '126', 'os' => 'Windows', 'osVersion' => '11', 'device' => 'desktop', 'country' => 'NL', 'region' => 'North Holland'],
		];
	}
}
