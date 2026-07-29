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

	public function testFrontendManagementRoutesAndFolderIconMigrationExist(): void {
		/** @var array{ocs:list<array{name:string,url:string,verb:string}>} $routes */
		$routes = require $this->root . '/appinfo/routes.php';
		$routeKeys = array_map(static fn (array $route): string => $route['verb'] . ' ' . $route['url'], $routes['ocs']);
		self::assertContains('POST /api/v1/aliases/suggest', $routeKeys);
		self::assertContains('PUT /api/v1/folders/order', $routeKeys);
		self::assertFileExists($this->root . '/lib/Migration/Version1100Date20260729143000.php');
		self::assertFileExists($this->root . '/lib/Migration/Version1101Date20260729220000.php');
		$migration = file_get_contents($this->root . '/lib/Migration/Version1100Date20260729143000.php');
		self::assertNotFalse($migration);
		self::assertStringContainsString("hasColumn('icon')", $migration);
		$counterMigration = file_get_contents($this->root . '/lib/Migration/Version1101Date20260729220000.php');
		self::assertNotFalse($counterMigration);
		self::assertStringContainsString("createNamedParameter('sequential')", $counterMigration);
	}

	public function testReleaseIgnoreRulesExcludeDevelopmentTrees(): void {
		$ignore = file_get_contents($this->root . '/.nextcloudignore');
		self::assertNotFalse($ignore);
		foreach (['/src', '/tests', '/scripts', '/node_modules', '/vendor-bin', '/js/*.map', '/css/*.map'] as $rule) {
			self::assertStringContainsString($rule, $ignore);
		}
		self::assertStringNotContainsString('/vendor\n', str_replace("\r\n", "\n", $ignore));
		self::assertFileExists($this->root . '/vendor/autoload.php');
		$application = file_get_contents($this->root . '/lib/AppInfo/Application.php');
		self::assertNotFalse($application);
		self::assertStringContainsString("include_once __DIR__ . '/../../vendor/autoload.php'", $application);
	}
}
