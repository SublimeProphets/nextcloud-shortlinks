<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\StatsService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class StatsAggregateCommand extends Command {
	public function __construct(
		private readonly StatsService $stats,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:stats:aggregate')->setDescription('Aggregate click statistics for a UTC day')->addArgument('day', InputArgument::OPTIONAL, 'UTC day (YYYY-MM-DD)', gmdate('Y-m-d', time() - 86400));
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$day = (string)$input->getArgument('day');
		$count = $this->stats->aggregateDay($day);
		$output->writeln("Aggregated {$count} click events for {$day}");
		return self::SUCCESS;
	}
}
