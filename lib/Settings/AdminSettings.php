<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Settings;

use OCA\Shortlinks\BackgroundJob\AggregateStatsJob;
use OCA\Shortlinks\BackgroundJob\CleanupJob;
use OCA\Shortlinks\BackgroundJob\RotateVisitorSecretJob;
use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use OCA\Shortlinks\Service\SettingsService;
use OCA\Shortlinks\Service\ThumbnailService;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\BackgroundJob\IJobList;
use OCP\Settings\ISettings;
use OCP\Util;

final class AdminSettings implements ISettings {
	public function __construct(
		private readonly IInitialState $initialState,
		private readonly SettingsService $settings,
		private readonly GeoResolverInterface $geo,
		private readonly IJobList $jobs,
		private readonly ThumbnailService $thumbnails,
	) {
	}
	public function getForm(): TemplateResponse {
		$this->initialState->provideInitialState('admin-settings', $this->settings->publicSettings());
		$this->initialState->provideInitialState('geo-status', $this->geo->status());
		$this->initialState->provideInitialState('thumbnail-status', $this->thumbnails->stats());
		$jobCounts = [];
		foreach ($this->jobs->countByClass() as $entry) {
			$jobCounts[$entry['class']] = $entry['count'];
		}
		$this->initialState->provideInitialState('system-status', [
			'phpVersion' => PHP_VERSION,
			'phpSupported' => version_compare(PHP_VERSION, '8.3', '>=') && version_compare(PHP_VERSION, '8.6', '<'),
			'jobs' => [
				'Statistics aggregation' => $jobCounts[AggregateStatsJob::class] ?? 0,
				'Retention cleanup' => $jobCounts[CleanupJob::class] ?? 0,
				'Visitor secret rotation' => $jobCounts[RotateVisitorSecretJob::class] ?? 0,
			],
		]);
		Util::addScript('shortlinks', 'shortlinks-admin');
		Util::addStyle('shortlinks', 'shortlinks-admin');
		return new TemplateResponse('shortlinks', 'admin');
	}
	public function getSection(): string {
		return 'shortlinks';
	}
	public function getPriority(): int {
		return 10;
	}
}
