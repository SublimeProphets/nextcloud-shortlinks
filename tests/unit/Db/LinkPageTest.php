<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Db;

use OCA\Shortlinks\Db\LinkPage;
use PHPUnit\Framework\TestCase;

final class LinkPageTest extends TestCase {
	public function testProvidesSafePageDefaults(): void {
		$page = new LinkPage();

		self::assertSame('private', $page->getAccessMode());
		self::assertSame('cards', $page->getLayout());
		self::assertSame('none', $page->getGrouping());
		self::assertSame('[]', $page->getFolderIds());
		self::assertSame('[]', $page->getTagIds());
		self::assertSame('[]', $page->getFilePaths());
		self::assertSame('[]', $page->getContactsJson());
		self::assertFalse($page->getAllowEmbedding());
		self::assertTrue($page->getIsActive());
		self::assertSame(1, $page->getEntityVersion());
	}

	public function testStoresPageCompositionAsJson(): void {
		$page = new LinkPage();
		$page->setFolderIds('[2,4]');
		$page->setTagIds('[8]');
		$page->setFilePaths('["/Documents/guide.pdf"]');
		$page->setContactsJson('[{"key":"contact-1","name":"Ada"}]');
		$page->setVisibleFields('["title","media"]');
		$page->setThemeJson('{"primary":"#0082c9"}');

		self::assertSame('[2,4]', $page->getFolderIds());
		self::assertSame('[8]', $page->getTagIds());
		self::assertSame('["/Documents/guide.pdf"]', $page->getFilePaths());
		self::assertSame('[{"key":"contact-1","name":"Ada"}]', $page->getContactsJson());
		self::assertSame('["title","media"]', $page->getVisibleFields());
		self::assertSame('{"primary":"#0082c9"}', $page->getThemeJson());
	}
}
