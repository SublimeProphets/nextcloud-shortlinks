<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Service\ImportExportService;
use OCA\Shortlinks\Service\TitleFetcher;
use OCA\Shortlinks\Service\UserSettingsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['tools'])]
final class ToolsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly ImportExportService $transfer,
		private readonly IURLGenerator $urls,
		private readonly TitleFetcher $titles,
		private readonly UserSettingsService $userSettings,
		private readonly IUserSession $userSession,
		private readonly LinkPolicy $policy,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * Export visible links as structured JSON or CSV data
	 *
	 * @param string $format Export format: json or csv
	 * @param string $system Collection filter
	 * @param null|int $folderId Folder identifier
	 * @param list<int> $folderIds Folder identifiers for exporting a subtree
	 * @param list<int> $tagIds Tag identifiers
	 * @param string $tagMode Tag matching mode: and or or
	 * @param list<int> $linkIds Exact link selection
	 * @param string $search Search text
	 * @param null|int $createdFrom Earliest creation timestamp
	 * @param null|int $createdTo Latest creation timestamp
	 * @param null|bool $active Optional active-state filter
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Export result
	 */
	#[NoAdminRequired]
	public function exportLinks(string $format = 'json', string $system = 'all', ?int $folderId = null, array $folderIds = [], array $tagIds = [], string $tagMode = 'and', string $search = '', ?int $createdFrom = null, ?int $createdTo = null, ?bool $active = null, array $linkIds = []): DataResponse {
		return $this->respond(fn () => $this->transfer->export($format, ['system' => $system, 'folderId' => $folderId, 'folderIds' => $folderIds, 'tagIds' => $tagIds, 'tagMode' => $tagMode, 'search' => $search, 'createdFrom' => $createdFrom, 'createdTo' => $createdTo, 'active' => $active, 'linkIds' => $linkIds]));
	}

	/** Export all personal Shortlinks settings, folders, tags, and links. */
	#[NoAdminRequired]
	public function exportBackup(): DataResponse {
		return $this->respond(fn (): array => $this->transfer->exportBackup($this->policy->currentUid()));
	}
	/**
	 * Import links from bounded JSON or CSV content
	 *
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Import result
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 10, period: 60)]
	public function importLinks(): DataResponse {
		return $this->respond(function (): array {
			$p = $this->payload(['format', 'content', 'dryRun', 'conflict']);
			return $this->transfer->import((string)($p['format'] ?? 'auto'), (string)($p['content'] ?? ''), (bool)($p['dryRun'] ?? true), (string)($p['conflict'] ?? 'skip'), $this->policy->currentUid());
		}, Http::STATUS_CREATED);
	}
	/**
	 * Return a bookmarklet generated from the trusted Nextcloud base URL
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Bookmarklet code
	 */
	#[NoAdminRequired]
	public function bookmarklet(): DataResponse {
		return $this->respond(function (): array {
			$url = $this->urls->linkToRouteAbsolute('shortlinks.page.index');
			$target = json_encode($url, JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR);
			return ['code' => "javascript:(()=>{const b={$target};location.href=b+'?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title)})()", 'mobileAlternative' => $url];
		});
	}
	/**
	 * Fetch a remote page title with SSRF protection
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Page title
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 10, period: 60)]
	public function title(): DataResponse {
		return $this->respond(function (): array {
			$uid = $this->userSession->getUser()?->getUID();
			if ($uid === null || !$this->userSettings->allowsMetadataAutocomplete($uid)) {
				throw new \OCA\Shortlinks\Exception\ValidationException('Automatic metadata completion is disabled', ['targetUrl' => 'metadata_disabled']);
			}
			$payload = $this->payload(['targetUrl']);
			return ['title' => $this->titles->fetch((string)($payload['targetUrl'] ?? ''))];
		});
	}

	/**
	 * Fetch privacy-safe preview metadata for a remote page
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Page metadata
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 30, period: 60)]
	public function metadata(): DataResponse {
		return $this->respond(function (): array {
			$uid = $this->userSession->getUser()?->getUID();
			if ($uid === null || !$this->userSettings->allowsMetadataAutocomplete($uid)) {
				throw new \OCA\Shortlinks\Exception\ValidationException('Automatic metadata completion is disabled', ['targetUrl' => 'metadata_disabled']);
			}
			$payload = $this->payload(['targetUrl']);
			$metadata = $this->titles->fetchMetadata((string)($payload['targetUrl'] ?? ''));
			return ['title' => $metadata['title'], 'hasThumbnail' => $metadata['imageUrl'] !== null, 'imageUrl' => $metadata['imageUrl']];
		});
	}
}
