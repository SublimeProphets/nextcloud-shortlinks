<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Integration;

use PHPUnit\Framework\TestCase;

final class AppContractTest extends TestCase {
	private string $root;

	protected function setUp(): void {
		$this->root = dirname(__DIR__, 2);
	}

	public function testMetadataDeclaresSupportedRuntimeAndOperations(): void {
		$info = simplexml_load_file($this->root . '/appinfo/info.xml');
		self::assertNotFalse($info);
		self::assertSame('shortlinks', (string)$info->id);
		self::assertSame('8.3', (string)$info->dependencies->php['min-version']);
		self::assertSame('8.5', (string)$info->dependencies->php['max-version']);
		self::assertSame('34', (string)$info->dependencies->nextcloud['min-version']);
		self::assertSame('35', (string)$info->dependencies->nextcloud['max-version']);
		self::assertCount(3, $info->{'background-jobs'}->job);
		self::assertGreaterThanOrEqual(8, $info->commands->command->count());
	}

	public function testRoutesAreUniqueAndOcsRoutesAreVersioned(): void {
		/** @var array{routes:list<array{name:string,url:string,verb:string}>,ocs:list<array{name:string,url:string,verb:string}>} $routes */
		$routes = require $this->root . '/appinfo/routes.php';
		$keys = [];
		foreach (array_merge($routes['routes'], $routes['ocs']) as $route) {
			$key = $route['verb'] . ' ' . $route['url'];
			self::assertArrayNotHasKey($key, $keys, 'Duplicate route ' . $key);
			$keys[$key] = true;
		}
		foreach ($routes['ocs'] as $route) {
			self::assertStringStartsWith('/api/v1/', $route['url']);
		}
	}

	public function testProductionAssetsExistWithoutSourceMaps(): void {
		self::assertFileExists($this->root . '/js/shortlinks-main.mjs');
		self::assertFileExists($this->root . '/js/shortlinks-admin.mjs');
		self::assertFileExists($this->root . '/css/shortlinks-main.css');
		self::assertFileExists($this->root . '/css/shortlinks-admin.css');
		self::assertSame([], glob($this->root . '/js/*.map') ?: []);
		self::assertSame([], glob($this->root . '/css/*.map') ?: []);
	}

	public function testReleaseIgnoreRulesExcludeDevelopmentTrees(): void {
		$ignore = file_get_contents($this->root . '/.nextcloudignore');
		self::assertNotFalse($ignore);
		foreach (['/src', '/tests', '/scripts', '/node_modules', '/vendor-bin', '/js/*.map', '/css/*.map'] as $rule) {
			self::assertStringContainsString($rule, $ignore);
		}
	}
}
