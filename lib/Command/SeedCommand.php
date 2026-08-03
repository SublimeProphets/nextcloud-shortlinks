<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Service\DemoDataService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

final class SeedCommand extends Command {
	public function __construct(
		private readonly DemoDataService $demo,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:seed')
			->setDescription('Create a complete, idempotent Shortlinks demonstration workspace')
			->addArgument('uid', InputArgument::OPTIONAL, 'Nextcloud user ID (positional shorthand)')
			->addOption('user', 'u', InputOption::VALUE_REQUIRED, 'Nextcloud user ID')
			->addOption('append', null, InputOption::VALUE_NONE, 'Keep existing content and add or refresh demo records (default)')
			->addOption('clean', null, InputOption::VALUE_NONE, 'Delete this user\'s existing Shortlinks content before seeding')
			->setHelp(<<<'HELP'
Create folders, tags, 36 varied links, plausible analytics, and three designed Pages.

Append mode is idempotent and is used by default:
  php occ shortlinks:seed --user=alice --append

Clean mode deletes Shortlinks content belonging to that user only:
  php occ shortlinks:seed --user=alice --clean

Password-protected demo links and Pages use the password "shortlinks-demo".
HELP);
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$io = new SymfonyStyle($input, $output);
		try {
			$optionUid = trim((string)($input->getOption('user') ?? ''));
			$argumentUid = trim((string)($input->getArgument('uid') ?? ''));
			$uid = $optionUid !== '' ? $optionUid : $argumentUid;
			if ($uid === '') {
				throw new \InvalidArgumentException('Provide a user ID with --user=<uid> or as the positional argument');
			}
			if ((bool)$input->getOption('clean') && (bool)$input->getOption('append')) {
				throw new \InvalidArgumentException('Choose either --clean or --append, not both');
			}
			$clean = (bool)$input->getOption('clean');
			$io->title('Shortlinks demo workspace');
			if ($clean) {
				$io->warning("All existing Shortlinks content for user '{$uid}' will be deleted. Other users are not affected.");
			}
			$result = $this->demo->seed($uid, $clean);
			$io->table(['Content', 'Ready'], [
				['Folders (4 roots + 5 children)', (string)$result['folders']],
				['Tags', (string)$result['tags']],
				['Links', (string)$result['links']],
				['Pages', (string)$result['pages']],
				['Plausible click events', (string)$result['clicks']],
			]);
			$io->note('Password for protected demo content: ' . $result['password']);
			$io->success(($result['cleaned'] ? 'Clean demo workspace created' : 'Demo content appended or refreshed') . " for user '{$uid}'.");
			return self::SUCCESS;
		} catch (\Throwable $e) {
			$io->error($e->getMessage());
			return self::FAILURE;
		}
	}
}
