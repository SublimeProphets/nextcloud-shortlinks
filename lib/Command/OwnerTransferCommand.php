<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\OwnerTransferService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class OwnerTransferCommand extends Command {
	public function __construct(
		private readonly OwnerTransferService $transfer,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:owner:transfer')->setDescription('Transfer all Shortlinks data between users')->addArgument('from', InputArgument::REQUIRED)->addArgument('to', InputArgument::REQUIRED);
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			$count = $this->transfer->transfer((string)$input->getArgument('from'), (string)$input->getArgument('to'));
			$output->writeln("Transferred {$count} links");
			return self::SUCCESS;
		} catch (\Throwable $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			return self::FAILURE;
		}
	}
}
