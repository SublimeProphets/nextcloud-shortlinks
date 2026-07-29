<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Db;

use OCA\Shortlinks\Db\Folder;
use PHPUnit\Framework\TestCase;

final class FolderTest extends TestCase {
	public function testSerializesConfiguredIconAndCount(): void {
		$folder = new Folder();
		$folder->setId(7);
		$folder->setOwnerUid('alice');
		$folder->setParentId(null);
		$folder->setName('Campaigns');
		$folder->setIcon('projects');
		$folder->setPosition(2);
		$folder->setCreatedAt(1);
		$folder->setUpdatedAt(2);

		self::assertSame('projects', $folder->toArray(3)['icon']);
		self::assertSame(3, $folder->toArray(3)['count']);
	}
}
