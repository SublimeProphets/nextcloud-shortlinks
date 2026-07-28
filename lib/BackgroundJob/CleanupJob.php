<?php

declare(strict_types=1);

namespace OCA\Shortlinks\BackgroundJob;

use OCA\Shortlinks\Db\AuditLogMapper;
use OCA\Shortlinks\Service\StatsService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;

final class CleanupJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly StatsService $stats,
		private readonly AuditLogMapper $audit,
	) {
		parent::__construct($time);
		$this->setInterval(86400);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		$this->setAllowParallelRuns(false);
	}
	protected function run($argument): void {
		$this->stats->cleanup($this->audit);
	}
}
