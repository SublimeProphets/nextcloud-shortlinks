<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\SuggestionService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['suggestions'])]
final class SuggestionApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly SuggestionService $suggestions,
	) {
		parent::__construct($appName, $request, $logger);
	}

	/** @return DataResponse<Http::STATUS_CREATED, array<string, bool>, array{}> */
	#[NoAdminRequired]
	#[UserRateLimit(limit: 6, period: 3600)]
	public function create(): DataResponse {
		return $this->respond(function (): array {
			$this->suggestions->submit($this->payload(['kind', 'email', 'anonymous', 'name', 'details']));
			return ['sent' => true];
		}, Http::STATUS_CREATED);
	}
}
