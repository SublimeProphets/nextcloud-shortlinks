<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use OCA\Shortlinks\Service\SettingsService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class HealthCommand extends Command {
	public function __construct(
		private readonly SettingsService $settings,
		private readonly GeoResolverInterface $geo,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:health')->setDescription('Check Shortlinks configuration and optional dependencies');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$ok = true;
		$output->writeln('PHP: ' . PHP_VERSION);
		try {
			$output->writeln('Public base URL: ' . ($this->settings->validatedBaseUrl() ?? 'Nextcloud route'));
		} catch (\Throwable $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			$ok = false;
		} $geo = $this->geo->status();
		$output->writeln('GeoIP: ' . ($geo['readable'] ? 'ready' : ($geo['configured'] ? 'invalid' : 'not configured (optional)')));
		$output->writeln('Statistics: ' . ($this->settings->bool('stats_enabled') ? 'enabled' : 'disabled'));
		return $ok ? self::SUCCESS : self::FAILURE;
	}
}
