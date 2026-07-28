<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\DemoDataService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class SeedCommand extends Command {
	public function __construct(
		private readonly DemoDataService $demo,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:seed')->setDescription('Create idempotent demonstration links')->addArgument('user', InputArgument::REQUIRED);
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			$count = $this->demo->seed((string)$input->getArgument('user'));
			$output->writeln("Created {$count} demo links");
			return self::SUCCESS;
		} catch (\Throwable $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			return self::FAILURE;
		}
	}
}
