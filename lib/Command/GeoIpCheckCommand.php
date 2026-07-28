<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Command;

use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

final class GeoIpCheckCommand extends Command {
	public function __construct(
		private readonly GeoResolverInterface $geo,
	) {
		parent::__construct();
	}
	protected function configure(): void {
		$this->setName('shortlinks:geoip:check')->setDescription('Check the configured local GeoIP database');
	}
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$status = $this->geo->status();
		foreach ($status as $key => $value) {
			$output->writeln($key . ': ' . (is_bool($value) ? ($value ? 'yes' : 'no') : ($value ?? 'n/a')));
		} return $status['configured'] && !$status['readable'] ? self::FAILURE : self::SUCCESS;
	}
}
