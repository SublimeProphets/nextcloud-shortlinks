<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\FolderService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['folders'])]
final class FoldersApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly FolderService $folders,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * List folders owned by the current user
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Folder tree
	 */
	#[NoAdminRequired]
	public function index(): DataResponse {
		return $this->respond(fn () => $this->folders->list());
	}
	/**
	 * Create a folder
	 *
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Folder created
	 */
	#[NoAdminRequired]
	public function create(): DataResponse {
		return $this->respond(function (): array {
			$p = $this->payload(['name', 'parentId', 'position', 'icon']);
			return $this->folders->create((string)($p['name'] ?? ''), isset($p['parentId']) ? (int)$p['parentId'] : null, (int)($p['position'] ?? 0), (string)($p['icon'] ?? 'folder'));
		}, Http::STATUS_CREATED);
	}
	/**
	 * Update a folder
	 *
	 * @param int $id Folder identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Updated folder
	 */
	#[NoAdminRequired]
	public function update(int $id): DataResponse {
		return $this->respond(function () use ($id): array {
			$p = $this->payload(['name', 'parentId', 'position', 'icon']);
			return $this->folders->update($id, isset($p['name']) ? (string)$p['name'] : null, array_key_exists('parentId', $p) && $p['parentId'] !== null ? (int)$p['parentId'] : null, array_key_exists('parentId', $p), isset($p['position']) ? (int)$p['position'] : null, isset($p['icon']) ? (string)$p['icon'] : null);
		});
	}

	/**
	 * Copy a folder tree and its links
	 *
	 * @param int $id Folder identifier
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Folder copied
	 */
	#[NoAdminRequired]
	public function copy(int $id): DataResponse {
		return $this->respond(function () use ($id): array {
			$p = $this->payload(['parentId']);
			return $this->folders->copy($id, isset($p['parentId']) ? (int)$p['parentId'] : null);
		}, Http::STATUS_CREATED);
	}

	/**
	 * Reorder sibling folders
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Updated folder tree
	 */
	#[NoAdminRequired]
	public function reorder(): DataResponse {
		return $this->respond(function (): array {
			$p = $this->payload(['parentId', 'ids']);
			$ids = is_array($p['ids'] ?? null) ? $p['ids'] : [];
			return $this->folders->reorder(isset($p['parentId']) ? (int)$p['parentId'] : null, $ids);
		});
	}
	/**
	 * Delete a folder
	 *
	 * @param int $id Folder identifier
	 * @param bool $deleteLinks Also move contained links to trash
	 * @return DataResponse<Http::STATUS_NO_CONTENT, array{}, array{}>
	 *
	 * 204: Folder deleted
	 */
	#[NoAdminRequired]
	public function destroy(int $id, bool $deleteLinks = false): DataResponse {
		return $this->respond(function () use ($id, $deleteLinks): \stdClass {
			$this->folders->delete($id, $deleteLinks);
			return new \stdClass();
		}, Http::STATUS_NO_CONTENT);
	}
}
