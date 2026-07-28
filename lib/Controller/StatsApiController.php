<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\StatsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['statistics'])]
final class StatsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly StatsService $stats,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * Return aggregate statistics for visible links
	 *
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Aggregate statistics
	 */
	#[NoAdminRequired]
	public function overview(?int $from = null, ?int $to = null): DataResponse {
		$to ??= time();
		$from ??= $to - 30 * 86400;
		return $this->respond(fn () => $this->stats->overview($from, $to));
	}
	/**
	 * Return statistics for one link
	 *
	 * @param int $id Link identifier
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Link statistics
	 */
	#[NoAdminRequired]
	public function link(int $id, ?int $from = null, ?int $to = null): DataResponse {
		$to ??= time();
		$from ??= $to - 30 * 86400;
		return $this->respond(fn () => $this->stats->forLink($id, $from, $to));
	}
	/**
	 * Return the privacy-reduced click log for one link
	 *
	 * @param int $id Link identifier
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @param int $page Page number starting at one
	 * @param int $perPage Number of clicks per page
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Click log and pagination information
	 */
	#[NoAdminRequired]
	public function clicks(int $id, ?int $from = null, ?int $to = null, int $page = 1, int $perPage = 50): DataResponse {
		$to ??= time();
		$from ??= $to - 90 * 86400;
		return $this->respond(fn () => $this->stats->clickLog($id, $from, $to, $page, $perPage));
	}
}
