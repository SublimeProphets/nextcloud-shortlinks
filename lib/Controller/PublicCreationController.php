<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Exception\ShortlinksException;
use OCA\Shortlinks\Service\PublicCreationService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\AnonRateLimit;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

final class PublicCreationController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly PublicCreationService $creation,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($appName, $request);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	#[AnonRateLimit(limit: 5, period: 60)]
	#[UserRateLimit(limit: 20, period: 60)]
	public function shorten(): DataResponse {
		try {
			$data = $this->request->getParams();
			unset($data['_route'], $data['requesttoken']);
			return new DataResponse(['data' => $this->creation->create($data), 'error' => null], Http::STATUS_CREATED);
		} catch (ShortlinksException $e) {
			return new DataResponse(['data' => null, 'error' => ['code' => $e->errorCode, 'message' => $e->getMessage()]], $e->getCode());
		} catch (\Throwable $e) {
			$this->logger->error('Public short-link creation failed', ['app' => 'shortlinks', 'exception' => $e]);
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'The link could not be created']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}
}
