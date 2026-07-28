<?php

declare(strict_types=1);

namespace OCA\Shortlinks\BackgroundJob;

use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;

final class RotateVisitorSecretJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly SettingsService $settings,
	) {
		parent::__construct($time);
		$this->setInterval(30 * 86400);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		$this->setAllowParallelRuns(false);
	}
	protected function run($argument): void {
		$this->settings->rotateVisitorSecret();
	}
}
