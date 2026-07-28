<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Validator;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Tests\Unit\SettingsFactory;
use OCA\Shortlinks\Validator\UrlValidator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class UrlValidatorTest extends TestCase {
	use SettingsFactory;
	public function testAllowsHttpUrlWithQueryAndFragment(): void {
		$url = 'https://example.com/a?b=1#c';
		self::assertSame($url, (new UrlValidator($this->settings()))->validate($url));
	}
	#[DataProvider('unsafeUrls')]
	public function testRejectsUnsafeUrls(string $url): void {
		$this->expectException(ValidationException::class);
		(new UrlValidator($this->settings()))->validate($url);
	}
	/** @return list<array{string}> */
	public static function unsafeUrls(): array {
		return [['javascript:alert(1)'], ['data:text/html,x'], ['file:///etc/passwd'], ['https://user:pass@example.com/'], ["\u{0000}https://example.com"]];
	}
	public function testDomainRulesUseLabelsNotSubstring(): void {
		$validator = new UrlValidator($this->settings(['domain_allowlist' => ['*.example.com'], 'domain_blocklist' => ['evil.example.com']]));
		self::assertSame('https://safe.example.com/', $validator->validate('https://safe.example.com/'));
		$this->expectException(ValidationException::class);
		$validator->validate('https://example.com.evil.test/');
	}
	public function testBlocksPrivateServerRequests(): void {
		$this->expectException(ValidationException::class);
		(new UrlValidator($this->settings()))->assertSafeForServerRequest('http://127.0.0.1/admin');
	}
}
