<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Service\ReferrerSanitizer;
use OCA\Shortlinks\Service\SettingsService;
use OCA\Shortlinks\Service\VisitorHasher;
use OCP\IAppConfig;
use PHPUnit\Framework\TestCase;

final class PrivacyTest extends TestCase {
	public function testVisitorHashIsScopedByLinkAndDay(): void {
		$config = $this->createMock(IAppConfig::class);
		$config->method('getValueString')->willReturn('fixed-test-secret');
		$settings = new SettingsService($config);
		$hasher = new VisitorHasher($settings);
		$one = $hasher->hash(1, 1720000000, '203.0.113.2', 'Fixture/1');
		self::assertSame($one, $hasher->hash(1, 1720000000, '203.0.113.2', 'Fixture/1'));
		self::assertNotSame($one, $hasher->hash(2, 1720000000, '203.0.113.2', 'Fixture/1'));
		self::assertNotSame($one, $hasher->hash(1, 1720100000, '203.0.113.2', 'Fixture/1'));
		self::assertStringNotContainsString('203.0.113.2', $one);
	}
	public function testReferrerRemovesSensitiveQueryValues(): void {
		$result = (new ReferrerSanitizer())->sanitize('https://search.example/path?q=hello&token=secret', 'cloud.example', 'full');
		self::assertSame('search.example', $result['domain']);
		self::assertStringContainsString('token=%5Bredacted%5D', (string)$result['url']);
		self::assertStringNotContainsString('secret', (string)$result['url']);
	}
	public function testDirectAndSelfAreDistinct(): void {
		$sanitizer = new ReferrerSanitizer();
		self::assertSame('direct', $sanitizer->sanitize('', 'cloud.example', 'domain')['type']);
		self::assertSame('self', $sanitizer->sanitize('https://cloud.example/apps/files', 'cloud.example', 'domain')['type']);
	}
}
