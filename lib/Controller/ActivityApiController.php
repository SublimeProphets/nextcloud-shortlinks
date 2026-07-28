<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Db\AuditLog;
use OCA\Shortlinks\Db\AuditLogMapper;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['activity'])]
final class ActivityApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly AuditLogMapper $audit,
		private readonly ShortLinkMapper $links,
		private readonly LinkPolicy $policy,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * Return the auditable activity history for a visible link
	 *
	 * @param int $id Link identifier
	 * @param int $page Page number starting at one
	 * @param int $perPage Number of entries per page
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Activity entries and pagination information
	 */
	#[NoAdminRequired]
	public function index(int $id, int $page = 1, int $perPage = 50): DataResponse {
		return $this->respond(function () use ($id, $page, $perPage): array {
			try {
				$link = $this->links->find($id);
			} catch (DoesNotExistException) {
				throw new NotFoundException();
			} $this->policy->requireView($link);
			$page = max(1, $page);
			$perPage = max(1, min(200, $perPage));
			$items = $this->audit->findForLink($id, $perPage + 1, ($page - 1) * $perPage);
			$hasMore = count($items) > $perPage;
			return ['items' => array_map(static fn (AuditLog $entry): array => $entry->toArray(), array_slice($items, 0, $perPage)), 'pagination' => ['page' => $page, 'perPage' => $perPage, 'hasMore' => $hasMore ? 1 : 0]];
		});
	}
}
