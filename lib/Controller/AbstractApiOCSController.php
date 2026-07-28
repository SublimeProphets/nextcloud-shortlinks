<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Exception\ShortlinksException;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCSController;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

abstract class AbstractApiOCSController extends OCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($appName, $request);
	}

	/** @param callable():mixed $operation */
	protected function respond(callable $operation, int $successStatus = Http::STATUS_OK): DataResponse {
		try {
			return new DataResponse(['data' => $operation(), 'error' => null], $successStatus);
		} catch (ShortlinksException $e) {
			$error = ['code' => $e->errorCode, 'message' => $e->getMessage()];
			if ($e instanceof ValidationException) {
				$error['fields'] = $e->fields;
			}
			return new DataResponse(['data' => null, 'error' => $error], $e->getCode());
		} catch (\Throwable $e) {
			$this->logger->error('Shortlinks API request failed', ['app' => 'shortlinks', 'exception' => $e]);
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'The request could not be completed']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}

	/** @param list<string> $allowed @return array<string,mixed> */
	protected function payload(array $allowed): array {
		$params = $this->request->getParams();
		foreach (['_route', 'requesttoken', 'id', 'shareId'] as $internal) {
			unset($params[$internal]);
		}
		if (!in_array('format', $allowed, true)) {
			unset($params['format']);
		}
		$unexpected = array_diff(array_keys($params), $allowed);
		if ($unexpected !== []) {
			throw new ValidationException('Unexpected request fields', array_fill_keys($unexpected, 'unexpected'));
		}
		return array_intersect_key($params, array_flip($allowed));
	}
}
