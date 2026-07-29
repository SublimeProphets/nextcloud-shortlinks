<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IAppConfig;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class SettingsServiceTest extends TestCase {
	#[DataProvider('invalidSettings')]
	public function testRejectsInvalidSettingsBeforeWriting(array $values): void {
		$config = $this->config();
		$config->expects(self::never())->method('setValueBool');
		$config->expects(self::never())->method('setValueInt');
		$config->expects(self::never())->method('setValueArray');
		$config->expects(self::never())->method('setValueString');
		$this->expectException(ValidationException::class);
		(new SettingsService($config, $this->createStub(ITimeFactory::class)))->save($values);
	}

	/** @return list<array{array<string,mixed>}> */
	public static function invalidSettings(): array {
		return [
			[['click_retention_days' => -1]],
			[['allowed_schemes' => ['https', 'ftp']]],
			[['creation_groups' => [['nested']]]],
			[['base_url' => 'https://user:password@example.com']],
			[['max_links_per_user' => 1000001]],
		];
	}

	public function testSavesValidatedIntegerAndSafeDefaults(): void {
		$config = $this->config();
		$config->expects(self::once())->method('setValueInt')->with('shortlinks', 'max_links_per_user', 250);
		$config->expects(self::exactly(2))->method('setValueArray');
		(new SettingsService($config, $this->createStub(ITimeFactory::class)))->save(['max_links_per_user' => 250]);
	}

	private function config(): IAppConfig {
		$config = $this->createMock(IAppConfig::class);
		$config->method('getValueString')->willReturnCallback(static fn (string $app, string $key, string $default = ''): string => $default);
		$config->method('getValueInt')->willReturnCallback(static fn (string $app, string $key, int $default = 0): int => $default);
		$config->method('getValueBool')->willReturnCallback(static fn (string $app, string $key, bool $default = false): bool => $default);
		$config->method('getValueArray')->willReturnCallback(static fn (string $app, string $key, array $default = []): array => $default);
		return $config;
	}
}
