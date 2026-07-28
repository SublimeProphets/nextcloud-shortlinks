<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\ShareService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['shares'])]
final class SharesApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly ShareService $shares,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * List management and redirect-access grants for a link
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Grants
	 */
	#[NoAdminRequired]
	public function index(int $id): DataResponse {
		return $this->respond(fn () => $this->shares->list($id));
	}
	/**
	 * Grant a user or group management or redirect access
	 *
	 * @param int $id Link identifier
	 * @return DataResponse<Http::STATUS_CREATED, array<string, mixed>, array{}>
	 *
	 * 201: Grant created
	 */
	#[NoAdminRequired]
	public function create(int $id): DataResponse {
		return $this->respond(function () use ($id): array {
			$p = $this->payload(['type', 'principalId', 'permission', 'purpose']);
			return $this->shares->create($id, (string)($p['type'] ?? ''), (string)($p['principalId'] ?? ''), (string)($p['permission'] ?? 'view'), (string)($p['purpose'] ?? 'management'));
		}, Http::STATUS_CREATED);
	}
	/**
	 * Revoke a grant
	 *
	 * @param int $id Link identifier
	 * @param int $shareId Grant identifier
	 * @return DataResponse<Http::STATUS_NO_CONTENT, array{}, array{}>
	 *
	 * 204: Grant revoked
	 */
	#[NoAdminRequired]
	public function destroy(int $id, int $shareId): DataResponse {
		return $this->respond(function () use ($id, $shareId): \stdClass {
			$this->shares->delete($id, $shareId);
			return new \stdClass();
		}, Http::STATUS_NO_CONTENT);
	}
}
