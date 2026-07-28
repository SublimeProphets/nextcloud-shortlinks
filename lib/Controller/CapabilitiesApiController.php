<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Capabilities\Capabilities;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['capabilities'])]
final class CapabilitiesApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly Capabilities $capabilities,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * Return Shortlinks feature flags and API limits
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Capabilities
	 */
	#[NoAdminRequired]
	public function index(): DataResponse {
		return $this->respond(fn () => $this->capabilities->getCapabilities()['shortlinks']);
	}
}
