<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\TagService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['tags'])]
final class TagsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly TagService $tags,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * List tags owned by the current user
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Tags
	 */
	#[NoAdminRequired]
	public function index(): DataResponse {
		return $this->respond(fn () => $this->tags->list());
	}
	/**
	 * Create a tag
	 *
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Tag created
	 */
	#[NoAdminRequired]
	public function create(): DataResponse {
		return $this->respond(function (): array {
			$p = $this->payload(['name', 'color']);
			return $this->tags->create((string)($p['name'] ?? ''), isset($p['color']) ? (string)$p['color'] : null);
		}, Http::STATUS_CREATED);
	}
	/**
	 * Update a tag
	 *
	 * @param int $id Tag identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Updated tag
	 */
	#[NoAdminRequired]
	public function update(int $id): DataResponse {
		return $this->respond(function () use ($id): array {
			$p = $this->payload(['name', 'color']);
			return $this->tags->update($id, (string)($p['name'] ?? ''), isset($p['color']) ? (string)$p['color'] : null);
		});
	}
	/**
	 * Merge a tag into another tag
	 *
	 * @param int $id Source tag identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Tags merged
	 */
	#[NoAdminRequired]
	public function merge(int $id): DataResponse {
		return $this->respond(function () use ($id): \stdClass {
			$p = $this->payload(['targetId']);
			$this->tags->merge($id, (int)($p['targetId'] ?? 0));
			return new \stdClass();
		});
	}
	/**
	 * Delete an unused tag
	 *
	 * @param int $id Tag identifier
	 * @return DataResponse<Http::STATUS_NO_CONTENT, array{}, array{}>
	 *
	 * 204: Tag deleted
	 */
	#[NoAdminRequired]
	public function destroy(int $id): DataResponse {
		return $this->respond(function () use ($id): \stdClass {
			$this->tags->delete($id);
			return new \stdClass();
		}, Http::STATUS_NO_CONTENT);
	}
}
