<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Provider;

use OCA\Shortlinks\Provider\UserAgent\DeviceDetectorParser;
use PHPUnit\Framework\TestCase;

final class DeviceDetectorParserTest extends TestCase {
	public function testDesktopFixture(): void {
		$result = (new DeviceDetectorParser())->parse('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36');
		self::assertSame('Chrome', $result['browser']);
		self::assertSame('124', $result['browserVersion']);
		self::assertSame('desktop', $result['deviceType']);
		self::assertFalse($result['isBot']);
	}
	public function testUnknownFixture(): void {
		$result = (new DeviceDetectorParser())->parse('');
		self::assertSame('Unknown', $result['browser']);
		self::assertSame('unknown', $result['deviceType']);
	}
}
