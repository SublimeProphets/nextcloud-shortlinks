<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Service\QrCodeService;
use PHPUnit\Framework\TestCase;

final class QrCodeServiceTest extends TestCase {
	public function testCreatesLocalSvg(): void {
		$result = (new QrCodeService())->render('https://cloud.example/apps/shortlinks/r/Ab1', 'svg');
		self::assertSame('image/svg+xml', $result['mimeType']);
		self::assertStringContainsString('<svg', $result['data']);
		self::assertStringNotContainsString('http://www.google.com/chart', $result['data']);
	}
}
