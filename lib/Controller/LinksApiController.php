<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\LinkService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['links'])]
final class LinksApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly LinkService $links,
	) {
		parent::__construct($appName, $request, $logger);
	}

	/**
	 * List links visible to the current user
	 *
	 * @param int $page Page number starting at one
	 * @param int $perPage Number of links per page
	 * @param string $search Search text
	 * @param string $system Collection filter: all, personal, system, or trash
	 * @param null|int $folderId Folder identifier
	 * @param string $sort Sort field
	 * @param string $direction Sort direction
	 * @param list<int> $tagIds Tag identifiers
	 * @param string $tagMode Tag matching mode: and or or
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Links and pagination information
	 */
	#[NoAdminRequired]
	public function index(int $page = 1, int $perPage = 50, string $search = '', string $system = 'all', ?int $folderId = null, string $sort = 'updated_at', string $direction = 'DESC', array $tagIds = [], string $tagMode = 'and'): DataResponse {
		return $this->respond(fn () => $this->links->list(['search' => $search, 'system' => $system, 'folderId' => $folderId, 'sort' => $sort, 'direction' => $direction, 'tagIds' => $tagIds, 'tagMode' => $tagMode], $page, $perPage));
	}

	/**
	 * Create a short link
	 *
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Link created
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 60, period: 60)]
	public function create(): DataResponse {
		return $this->respond(fn () => $this->links->create($this->payload(['targetUrl', 'slug', 'title', 'description', 'folderId', 'tagIds', 'favorite', 'active', 'startsAt', 'expiresAt', 'clickLimit', 'redirectStatus', 'accessMode', 'password'])), Http::STATUS_CREATED);
	}

	/**
	 * Fetch one link
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Link details
	 */
	#[NoAdminRequired]
	public function show(int $id): DataResponse {
		return $this->respond(fn () => $this->links->get($id));
	}

	/**
	 * Update one link using its optimistic version
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Updated link
	 */
	#[NoAdminRequired]
	public function update(int $id): DataResponse {
		return $this->respond(fn () => $this->links->update($id, $this->payload(['targetUrl', 'slug', 'title', 'description', 'folderId', 'tagIds', 'favorite', 'active', 'startsAt', 'expiresAt', 'clickLimit', 'redirectStatus', 'accessMode', 'password', 'version'])));
	}

	/**
	 * Move a link to trash or permanently delete an already trashed link
	 *
	 * @param int $id Link identifier
	 * @param bool $permanent Permanently delete an already trashed link
	 * @return DataResponse<Http::STATUS_NO_CONTENT, array{}, array{}>
	 *
	 * 204: Link deleted
	 */
	#[NoAdminRequired]
	public function destroy(int $id, bool $permanent = false): DataResponse {
		return $this->respond(function () use ($id, $permanent): \stdClass {
			$this->links->delete($id, $permanent);
			return new \stdClass();
		}, Http::STATUS_NO_CONTENT);
	}

	/**
	 * Restore a trashed link
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Restored link
	 */
	#[NoAdminRequired]
	public function restore(int $id): DataResponse {
		return $this->respond(fn () => $this->links->restore($id));
	}

	/**
	 * Clone a visible link into the current user's collection
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Cloned link
	 */
	#[NoAdminRequired]
	public function cloneLink(int $id): DataResponse {
		return $this->respond(fn () => $this->links->cloneLink($id), Http::STATUS_CREATED);
	}

	/**
	 * Apply bounded changes to at most 200 links
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Bulk operation result
	 */
	#[NoAdminRequired]
	public function bulk(): DataResponse {
		return $this->respond(function (): array {
			$payload = $this->payload(['ids', 'changes']);
			return $this->links->bulk((array)($payload['ids'] ?? []), (array)($payload['changes'] ?? []));
		});
	}

	/**
	 * Create a link using the YOURLS-style action
	 *
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Link created
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 60, period: 60)]
	public function shorten(): DataResponse {
		return $this->create();
	}

	/**
	 * Resolve an alias without redirecting or exposing statistics
	 *
	 * @param string $slug Exact case-sensitive alias
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Resolved target
	 */
	#[NoAdminRequired]
	public function expand(string $slug): DataResponse {
		return $this->respond(fn (): array => $this->links->expand($slug));
	}

	/**
	 * Check exact case-sensitive alias availability
	 *
	 * @param string $slug Exact case-sensitive alias
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Availability result
	 */
	#[NoAdminRequired]
	public function aliasAvailable(string $slug): DataResponse {
		return $this->respond(fn (): array => ['slug' => $slug, 'available' => $this->links->isAliasAvailable($slug)]);
	}
}
