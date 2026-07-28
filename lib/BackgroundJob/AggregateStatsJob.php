<?php

declare(strict_types=1);

namespace OCA\Shortlinks\BackgroundJob;

use OCA\Shortlinks\Service\StatsService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;

final class AggregateStatsJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly StatsService $stats,
	) {
		parent::__construct($time);
		$this->setInterval(3600);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		$this->setAllowParallelRuns(false);
	}
	protected function run($argument): void {
		$today = gmdate('Y-m-d', $this->time->getTime());
		$this->stats->aggregateDay(gmdate('Y-m-d', $this->time->getTime() - 86400));
		$this->stats->aggregateDay($today);
	}
}
