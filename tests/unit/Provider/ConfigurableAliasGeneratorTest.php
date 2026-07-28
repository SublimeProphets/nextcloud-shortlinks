<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Provider;

use OCA\Shortlinks\Provider\Alias\ConfigurableAliasGenerator;
use OCA\Shortlinks\Tests\Unit\SettingsFactory;
use OCP\IDBConnection;
use PHPUnit\Framework\TestCase;

final class ConfigurableAliasGeneratorTest extends TestCase {
	use SettingsFactory;

	public function testRandomAliasesUseConfiguredLengthAndBase62Alphabet(): void {
		$db = $this->createMock(IDBConnection::class);
		$generator = new ConfigurableAliasGenerator($db, $this->settings(['alias_mode' => 'random', 'alias_length' => 32]));
		$first = $generator->generate();
		$second = $generator->generate();
		self::assertMatchesRegularExpression('/^[A-Za-z0-9]{32}$/D', $first);
		self::assertMatchesRegularExpression('/^[A-Za-z0-9]{32}$/D', $second);
		self::assertNotSame($first, $second);
	}
}
