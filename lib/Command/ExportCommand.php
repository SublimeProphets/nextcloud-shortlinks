<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\ImportExportService;
use OCP\IUserManager;
use OCP\IUserSession;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

final class ExportCommand extends Command {
	public function __construct(
		private readonly ImportExportService $transfer,
		private readonly IUserManager $users,
		private readonly IUserSession $session,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:export')->setDescription('Export a user’s visible links as CSV or JSON')->addArgument('user', InputArgument::REQUIRED)->addArgument('file', InputArgument::REQUIRED)->addOption('format', null, InputOption::VALUE_REQUIRED, 'csv or json', 'json');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			$user = $this->users->get((string)$input->getArgument('user'));
			if ($user === null) {
				throw new \InvalidArgumentException('User does not exist');
			} $this->session->setUser($user);
			$result = $this->transfer->export((string)$input->getOption('format'));
			$path = (string)$input->getArgument('file');
			if (file_put_contents($path, $result['content'], LOCK_EX) === false) {
				throw new \RuntimeException('Could not write export file');
			} $output->writeln("Exported {$result['count']} links to {$path}");
			return self::SUCCESS;
		} catch (\Throwable $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			return self::FAILURE;
		}
	}
}
