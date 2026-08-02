<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Db\AuditLogMapper;
use OCA\Shortlinks\Exception\ShortlinksException;
use OCA\Shortlinks\Service\AuditService;
use OCA\Shortlinks\Service\SettingsService;
use OCA\Shortlinks\Service\StatsService;
use OCA\Shortlinks\Service\ThumbnailService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IRequest;
use OCP\IUserSession;

final class AdminSettingsController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly SettingsService $settings,
		private readonly AuditService $audit,
		private readonly IUserSession $userSession,
		private readonly StatsService $stats,
		private readonly ThumbnailService $thumbnails,
		private readonly AuditLogMapper $auditLogs,
		private readonly ITimeFactory $time,
	) {
		parent::__construct($appName, $request);
	}

	public function refreshThumbnails(int $afterId = 0, int $limit = 5, bool $onlyMissing = false): DataResponse {
		try {
			if (!$this->settings->bool('title_fetch')) {
				throw new \InvalidArgumentException('Server-side metadata fetching must be enabled first');
			}
			$result = $this->thumbnails->refreshBatch($afterId, $limit, $onlyMissing);
			$actorUid = $this->userSession->getUser()?->getUID();
			if ($actorUid !== null && !$result['hasMore']) {
				$this->audit->record('admin_thumbnails_refreshed', $actorUid, null, [
					'onlyMissing' => $onlyMissing,
					'found' => $result['stats']['found'],
					'total' => $result['stats']['total'],
				]);
			}
			return new DataResponse(['data' => $result, 'error' => null]);
		} catch (\InvalidArgumentException $e) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'validation_error', 'message' => $e->getMessage()]], Http::STATUS_BAD_REQUEST);
		} catch (\Throwable) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'Thumbnails could not be refreshed']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}
	public function save(): DataResponse {
		try {
			$params = $this->request->getParams();
			unset($params['_route'], $params['requesttoken']);
			$this->settings->save($params);
			$actorUid = $this->userSession->getUser()?->getUID();
			if ($actorUid !== null) {
				$this->audit->record('admin_config_changed', $actorUid, null, ['keys' => implode(',', array_keys($params))]);
			}
			return new DataResponse(['data' => $this->settings->publicSettings(), 'error' => null]);
		} catch (ShortlinksException $e) {
			return new DataResponse(['data' => null, 'error' => ['code' => $e->errorCode, 'message' => $e->getMessage()]], $e->getCode());
		} catch (\Throwable) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'Settings could not be saved']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}

	public function maintenance(string $action, int $days = 30): DataResponse {
		try {
			$result = match ($action) {
				'aggregate' => ['events' => $this->stats->aggregateDay(gmdate('Y-m-d', $this->time->getTime() - 86400)) + $this->stats->aggregateDay(gmdate('Y-m-d', $this->time->getTime()))],
				'cleanup' => $this->stats->cleanup($this->auditLogs),
				'rebuild' => $this->rebuild(max(1, min(365, $days))),
				default => throw new \InvalidArgumentException('Unknown maintenance action'),
			};
			$actorUid = $this->userSession->getUser()?->getUID();
			if ($actorUid !== null) {
				$this->audit->record('admin_maintenance_run', $actorUid, null, ['action' => $action, 'days' => $days]);
			}
			return new DataResponse(['data' => $result, 'error' => null]);
		} catch (\InvalidArgumentException $e) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'validation_error', 'message' => $e->getMessage()]], Http::STATUS_BAD_REQUEST);
		} catch (\Throwable) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'Maintenance could not be completed']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}

	/** @return array{days:int,events:int} */
	private function rebuild(int $days): array {
		$events = 0;
		for ($offset = $days - 1; $offset >= 0; --$offset) {
			$events += $this->stats->aggregateDay(gmdate('Y-m-d', $this->time->getTime() - $offset * 86400));
		}
		return ['days' => $days, 'events' => $events];
	}
}
