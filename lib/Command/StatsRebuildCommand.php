<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\StatsService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class StatsRebuildCommand extends Command {
	public function __construct(
		private readonly StatsService $stats,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:stats:rebuild')->setDescription('Rebuild daily statistics for recent UTC days')->addArgument('days', InputArgument::OPTIONAL, 'Number of days (1-365)', '30');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$days = max(1, min(365, (int)$input->getArgument('days')));
		$total = 0;
		for ($i = $days - 1; $i >= 0; --$i) {
			$total += $this->stats->aggregateDay(gmdate('Y-m-d', time() - $i * 86400));
		} $output->writeln("Rebuilt {$days} days from {$total} detailed events");
		return self::SUCCESS;
	}
}
