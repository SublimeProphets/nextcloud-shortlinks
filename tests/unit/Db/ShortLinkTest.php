<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Db;

use OCA\Shortlinks\Db\ShortLink;
use PHPUnit\Framework\TestCase;

final class ShortLinkTest extends TestCase {
	public function testSerializesPersistedThumbnailMetadata(): void {
		$link = new ShortLink();
		$link->setId(7);
		$link->setOwnerUid('alice');
		$link->setSlug('campaign');
		$link->setTargetUrl('https://example.com');
		$link->setTitle('Campaign');
		$link->setThumbnailUrl('https://cdn.example.com/share.jpg');
		$link->setThumbnailRefreshedAt(1700000000);

		$result = $link->toArray('https://go.example/campaign');

		self::assertSame('https://cdn.example.com/share.jpg', $result['thumbnailUrl']);
		self::assertSame(1700000000, $result['thumbnailRefreshedAt']);
	}
}
