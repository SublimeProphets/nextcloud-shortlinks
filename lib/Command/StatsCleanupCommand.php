<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Db\AuditLogMapper;
use OCA\Shortlinks\Service\StatsService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class StatsCleanupCommand extends Command {
	public function __construct(
		private readonly StatsService $stats,
		private readonly AuditLogMapper $audit,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:stats:cleanup')->setDescription('Apply Shortlinks retention settings');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		foreach ($this->stats->cleanup($this->audit) as $type => $count) {
			$output->writeln("{$type}: {$count}");
		} return self::SUCCESS;
	}
}
