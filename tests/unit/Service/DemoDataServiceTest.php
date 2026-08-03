<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Service\DemoDataService;
use PHPUnit\Framework\TestCase;
use ReflectionMethod;

final class DemoDataServiceTest extends TestCase {
	public function testFolderTreeHasFourRootsAndRequestedChildCounts(): void {
		$folders = $this->definitions('folderDefinitions');
		$roots = array_values(array_filter($folders, static fn (array $folder): bool => $folder['parent'] === null));
		$children = [];
		foreach ($folders as $folder) {
			if ($folder['parent'] !== null) {
				$children[$folder['parent']][] = $folder['key'];
			}
		}

		self::assertCount(4, $roots);
		self::assertCount(9, $folders);
		self::assertSame([2, 3], array_values(array_filter(array_map('count', $children), static fn (int $count): bool => $count > 1)));
	}

	public function testTagsAreEightReusableWorkflowConcepts(): void {
		$tags = $this->definitions('tagDefinitions');
		self::assertCount(8, $tags);
		self::assertCount(8, array_unique(array_column($tags, 'name')));
		foreach ($tags as $tag) {
			self::assertMatchesRegularExpression('/^#[0-9a-f]{6}$/D', (string)$tag['color']);
		}
	}

	public function testLinksCoverAllUseCasesAndFeatureCombinations(): void {
		$links = $this->definitions('linkDefinitions');
		self::assertGreaterThanOrEqual(30, count($links));
		self::assertSame(['agency', 'music', 'tech'], $this->sortedUnique($links, 'useCase'));
		foreach (['agency', 'music', 'tech'] as $useCase) {
			self::assertGreaterThanOrEqual(10, count(array_filter($links, static fn (array $link): bool => $link['useCase'] === $useCase)));
		}
		foreach ($links as $link) {
			self::assertNotFalse(filter_var($link['url'], FILTER_VALIDATE_URL));
			self::assertStringContainsString('—', (string)$link['title']);
			self::assertNotEmpty($link['tags']);
		}

		self::assertSame([301, 302, 307, 308], $this->sortedUnique($links, 'status'));
		self::assertSame(['authenticated', 'disabled', 'password', 'public'], $this->sortedUnique($links, 'access'));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => $link['favorite']));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => !$link['active']));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => $link['deleted']));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => isset($link['startsIn'])));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => isset($link['expiredAgo'])));
		self::assertTrue((bool)array_filter($links, static fn (array $link): bool => $link['clickLimit'] !== null));
		self::assertGreaterThan(1000, array_sum(array_column($links, 'clicks')));
	}

	public function testOneDesignedPageExistsForEveryUseCase(): void {
		$pages = $this->definitions('pageDefinitions');
		self::assertCount(3, $pages);
		self::assertSame(['agency', 'music', 'tech'], $this->sortedUnique($pages, 'useCase'));
		self::assertCount(3, array_unique(array_column($pages, 'access')));
		self::assertCount(3, array_unique(array_map(static fn (array $page): string => $page['theme']['preset'], $pages)));
	}

	/** @return list<array<string,mixed>> */
	private function definitions(string $method): array {
		/** @var list<array<string,mixed>> $definitions */
		$definitions = (new ReflectionMethod(DemoDataService::class, $method))->invoke(null);
		return $definitions;
	}

	/** @param list<array<string,mixed>> $items @return list<int|string> */
	private function sortedUnique(array $items, string $key): array {
		$values = array_values(array_unique(array_column($items, $key)));
		sort($values);
		return $values;
	}
}
