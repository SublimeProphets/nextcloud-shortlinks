<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit;

use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IAppConfig;
use PHPUnit\Framework\TestCase;

trait SettingsFactory {
	/** @param array<string,mixed> $values */
	private function settings(array $values = []): SettingsService {
		/** @var TestCase $this */
		$config = $this->createMock(IAppConfig::class);
		$config->method('getValueString')->willReturnCallback(static fn (string $app, string $key, string $default = ''): string => (string)($values[$key] ?? $default));
		$config->method('getValueInt')->willReturnCallback(static fn (string $app, string $key, int $default = 0): int => (int)($values[$key] ?? $default));
		$config->method('getValueBool')->willReturnCallback(static fn (string $app, string $key, bool $default = false): bool => (bool)($values[$key] ?? $default));
		$config->method('getValueArray')->willReturnCallback(static fn (string $app, string $key, array $default = []): array => (array)($values[$key] ?? $default));
		$time = $this->createStub(ITimeFactory::class);
		$time->method('getTime')->willReturn(1700000000);
		return new SettingsService($config, $time);
	}
}
