<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Db\LinkPage;
use OCA\Shortlinks\Service\LinkPageService;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionMethod;

final class LinkPageDesignOptionsTest extends TestCase {
	private LinkPageService $service;

	protected function setUp(): void {
		$this->service = (new ReflectionClass(LinkPageService::class))->newInstanceWithoutConstructor();
	}

	public function testThemeOptionsAreWhitelistedAndClamped(): void {
		$theme = $this->invoke('sanitizeTheme', [[
			'preset' => 'modern', 'primary' => '#ABCDEF', 'background' => 'url(javascript:bad)',
			'font' => 'remote-font', 'baseSize' => 80, 'scale' => 5,
		]]);

		self::assertSame('modern', $theme['preset']);
		self::assertSame('#abcdef', $theme['primary']);
		self::assertSame('#0f172a', $theme['background']);
		self::assertSame('inter', $theme['font']);
		self::assertSame(20, $theme['baseSize']);
		self::assertSame(85, $theme['scale']);
	}

	public function testHeaderAndFooterOptionsReceiveSafeDefaults(): void {
		$header = $this->invoke('sanitizeHeader', [['alignment' => 'unsupported', 'compact' => true]]);
		$footer = $this->invoke('sanitizeFooter', [[
			'attribution' => str_repeat('a', 200),
			'linkIds' => [5, 5, -1, 8],
		]]);

		self::assertSame('center', $header['alignment']);
		self::assertTrue($header['compact']);
		self::assertTrue($header['mark']);
		self::assertSame([5, 8], $footer['linkIds']);
		self::assertSame(160, mb_strlen($footer['attribution']));
	}

	public function testNewPageCompositionDefaultsAreMarkedForInsertion(): void {
		$page = new LinkPage();
		(new ReflectionMethod(LinkPageService::class, 'initializeComposition'))->invoke($this->service, $page);

		foreach (['folderIds', 'tagIds', 'linkIds', 'userIds', 'groupIds', 'visibleFields', 'themeJson', 'headerJson', 'footerJson'] as $field) {
			self::assertArrayHasKey($field, $page->getUpdatedFields());
		}
		self::assertSame('[]', $page->getFolderIds());
		self::assertSame('{}', $page->getFooterJson());
	}

	/** @param list<mixed> $arguments @return array<string,mixed> */
	private function invoke(string $method, array $arguments): array {
		/** @var array<string,mixed> $result */
		$result = (new ReflectionMethod(LinkPageService::class, $method))->invokeArgs($this->service, $arguments);
		return $result;
	}
}
