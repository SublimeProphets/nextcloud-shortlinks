<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\PrincipalSearchService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['shares'])]
final class PrincipalsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly PrincipalSearchService $principals,
	) {
		parent::__construct($appName, $request, $logger);
	}

	/**
	 * Search enabled users and groups for the share chooser
	 *
	 * @param string $search Search text (2-100 characters)
	 * @param int $limit Maximum number of results
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Matching users and groups
	 */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 60, period: 60)]
	public function index(string $search = '', int $limit = 20): DataResponse {
		return $this->respond(fn (): array => $this->principals->search($search, $limit));
	}
}
