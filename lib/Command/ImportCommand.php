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

final class ImportCommand extends Command {
	public function __construct(
		private readonly ImportExportService $transfer,
		private readonly IUserManager $users,
		private readonly IUserSession $session,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:import')->setDescription('Import links from CSV or JSON')->addArgument('user', InputArgument::REQUIRED)->addArgument('file', InputArgument::REQUIRED)->addOption('format', null, InputOption::VALUE_REQUIRED, 'csv or json', 'csv')->addOption('dry-run', null, InputOption::VALUE_NONE)->addOption('conflict', null, InputOption::VALUE_REQUIRED, 'skip or new-alias', 'skip');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			$user = $this->users->get((string)$input->getArgument('user'));
			if ($user === null) {
				throw new \InvalidArgumentException('User does not exist');
			} $path = (string)$input->getArgument('file');
			if (!is_file($path) || !is_readable($path)) {
				throw new \InvalidArgumentException('Import file is not readable');
			} $content = file_get_contents($path);
			if ($content === false) {
				throw new \RuntimeException('Could not read import file');
			} $this->session->setUser($user);
			$result = $this->transfer->import((string)$input->getOption('format'), $content, (bool)$input->getOption('dry-run'), (string)$input->getOption('conflict'));
			$output->writeln(json_encode($result, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
			return $result['errors'] === [] ? self::SUCCESS : self::FAILURE;
		} catch (\Throwable $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			return self::FAILURE;
		}
	}
}
