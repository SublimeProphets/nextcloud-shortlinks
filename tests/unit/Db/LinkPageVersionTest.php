<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Db;

use OCA\Shortlinks\Db\LinkPageVersion;
use PHPUnit\Framework\TestCase;

final class LinkPageVersionTest extends TestCase {
	public function testFirstVersionNumberIsMarkedForInsertion(): void {
		$version = new LinkPageVersion();
		$version->setVersionNumber(1);

		self::assertSame(1, $version->getVersionNumber());
		self::assertArrayHasKey('versionNumber', $version->getUpdatedFields());
	}
}
