<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\StatsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['statistics'])]
final class StatsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly StatsService $stats,
		private readonly ITimeFactory $time,
	) {
		parent::__construct($appName, $request, $logger);
	}
	/**
	 * Return aggregate statistics for visible links
	 *
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @param string $system Collection filter
	 * @param null|int $folderId Folder identifier
	 * @param list<int> $tagIds Tag identifiers
	 * @param string $tagMode Tag matching mode
	 * @param null|bool $active Optional active-state filter
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Aggregate statistics
	 */
	#[NoAdminRequired]
	public function overview(?int $from = null, ?int $to = null, string $system = 'all', ?int $folderId = null, array $tagIds = [], string $tagMode = 'and', ?bool $active = null): DataResponse {
		$to ??= $this->time->getTime();
		$from ??= $to - 30 * 86400;
		return $this->respond(fn () => $this->stats->overview($from, $to, ['system' => $system, 'folderId' => $folderId, 'tagIds' => $tagIds, 'tagMode' => $tagMode, 'active' => $active]));
	}
	/**
	 * Return statistics for one link
	 *
	 * @param int $id Link identifier
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @param string $granularity Time-series granularity: hour, day, week, or month
	 * @param bool $compare Include a comparison with the preceding period
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Link statistics
	 */
	#[NoAdminRequired]
	public function link(int $id, ?int $from = null, ?int $to = null, string $granularity = 'day', bool $compare = true): DataResponse {
		$to ??= $this->time->getTime();
		$from ??= $to - 30 * 86400;
		return $this->respond(fn () => $this->stats->forLink($id, $from, $to, $granularity, $compare));
	}
	/**
	 * Export privacy-reduced statistics for one link
	 *
	 * @param int $id Link identifier
	 * @param string $format Export format: json or csv
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @param string $granularity Time-series granularity: hour, day, week, or month
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Statistics export payload
	 */
	#[NoAdminRequired]
	public function export(int $id, string $format = 'json', ?int $from = null, ?int $to = null, string $granularity = 'day'): DataResponse {
		$to ??= $this->time->getTime();
		$from ??= $to - 30 * 86400;
		return $this->respond(fn () => $this->stats->exportForLink($id, $from, $to, $format, $granularity));
	}
	/**
	 * Return the privacy-reduced click log for one link
	 *
	 * @param int $id Link identifier
	 * @param null|int $from Inclusive Unix start timestamp
	 * @param null|int $to Inclusive Unix end timestamp
	 * @param int $page Page number starting at one
	 * @param int $perPage Number of clicks per page
	 * @param null|bool $bot Optional bot classification filter
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Click log and pagination information
	 */
	#[NoAdminRequired]
	public function clicks(int $id, ?int $from = null, ?int $to = null, int $page = 1, int $perPage = 50, ?bool $bot = null): DataResponse {
		$to ??= $this->time->getTime();
		$from ??= $to - 90 * 86400;
		return $this->respond(fn () => $this->stats->clickLog($id, $from, $to, $page, $perPage, $bot));
	}
}
