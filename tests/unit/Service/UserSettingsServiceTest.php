<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Provider\Alias\AliasGeneratorInterface;
use OCA\Shortlinks\Service\AliasSuggestionService;
use OCA\Shortlinks\Service\LinkUrlService;
use OCA\Shortlinks\Service\UserSettingsService;
use OCA\Shortlinks\Tests\Unit\SettingsFactory;
use OCA\Shortlinks\Validator\SlugValidator;
use OCP\AppFramework\Services\IAppConfig;
use OCP\IDBConnection;
use OCP\IURLGenerator;
use PHPUnit\Framework\TestCase;

final class UserSettingsServiceTest extends TestCase {
	use SettingsFactory;

	public function testPageEditorUsesSingleOpenSectionByDefaultAndCanBeChanged(): void {
		$values = [];
		$settings = new UserSettingsService($this->userConfig($values), $this->settings());

		self::assertTrue($settings->get('alice')['pageEditorSingleSection']);
		self::assertFalse($settings->save('alice', ['pageEditorSingleSection' => false])['pageEditorSingleSection']);
	}

	public function testPageAutosaveDefaultsToTenSecondsAndAcceptsSupportedDelays(): void {
		$values = [];
		$settings = new UserSettingsService($this->userConfig($values), $this->settings());

		self::assertTrue($settings->get('alice')['pageAutosaveEnabled']);
		self::assertSame(10, $settings->get('alice')['pageAutosaveDelay']);
		$updated = $settings->save('alice', ['pageAutosaveEnabled' => false, 'pageAutosaveDelay' => 30]);
		self::assertFalse($updated['pageAutosaveEnabled']);
		self::assertSame(30, $updated['pageAutosaveDelay']);
	}

	public function testPageAutosaveRejectsUnsupportedDelays(): void {
		$values = [];
		$settings = new UserSettingsService($this->userConfig($values), $this->settings());

		$this->expectException(ValidationException::class);
		$settings->save('alice', ['pageAutosaveDelay' => 4]);
	}

	public function testReadableAliasesUseAConfiguredMinimalRandomSuffixAfterCollisions(): void {
		$values = [];
		$userSettings = new UserSettingsService($this->userConfig($values), $this->settings());
		$userSettings->save('alice', ['aliasStrategy' => 'readable', 'collisionStrategy' => 'random', 'suffixLength' => 2]);
		$generator = $this->createStub(AliasGeneratorInterface::class);
		$generator->method('generate')->willReturn('fallback');
		$suggestions = new AliasSuggestionService(
			new ShortLinkMapper($this->createStub(IDBConnection::class)),
			$generator,
			new SlugValidator($this->settings()),
			$userSettings,
			$this->settings(),
		);

		self::assertSame('summer-campaign', $suggestions->candidate('alice', 'Summer Campaign', 'https://example.com', 0));
		self::assertMatchesRegularExpression('/^summer-campaign-[a-z0-9]{2}$/D', $suggestions->candidate('alice', 'Summer Campaign', 'https://example.com', 1));
	}

	public function testNumberedCollisionStrategyUsesAscendingSuffixes(): void {
		$values = [];
		$userSettings = new UserSettingsService($this->userConfig($values), $this->settings());
		$userSettings->save('alice', ['aliasStrategy' => 'readable', 'collisionStrategy' => 'numbered']);
		$suggestions = new AliasSuggestionService(
			new ShortLinkMapper($this->createStub(IDBConnection::class)),
			$this->createStub(AliasGeneratorInterface::class),
			new SlugValidator($this->settings()),
			$userSettings,
			$this->settings(),
		);

		self::assertSame('news-item-2', $suggestions->candidate('alice', '', 'https://example.com/news-item', 1));
		self::assertSame('news-item-3', $suggestions->candidate('alice', '', 'https://example.com/news-item', 2));
	}

	public function testPersonalTemplateFormatsPublicLinkUrl(): void {
		$values = [];
		$global = $this->settings();
		$userSettings = new UserSettingsService($this->userConfig($values), $global);
		$userSettings->save('alice', ['urlMode' => 'template', 'urlTemplate' => 'https://go.example/{user}/{alias}']);
		$urls = $this->urlService($global, $userSettings);

		self::assertSame('https://go.example/alice/summer', $urls->forSlug('summer', 'alice'));
		self::assertSame('https://go.example/alice/{alias}', $urls->templateFor('alice'));
	}

	public function testRegexReplacementFormatsCanonicalUrlAndFallsBackWhenItDoesNotMatch(): void {
		$values = [];
		$global = $this->settings();
		$userSettings = new UserSettingsService($this->userConfig($values), $global);
		$userSettings->save('alice', [
			'urlMode' => 'regex',
			'urlPattern' => '^https://cloud\\.example/apps/shortlinks/r/(.+)$',
			'urlReplacement' => 'https://go.example/$1',
		]);
		$urls = $this->urlService($global, $userSettings);

		self::assertSame('https://go.example/summer', $urls->forSlug('summer', 'alice'));
		$userSettings->save('alice', ['urlPattern' => '^https://another\\.example/(.+)$']);
		self::assertSame('https://cloud.example/apps/shortlinks/r/summer', $urls->forSlug('summer', 'alice'));
	}

	public function testRejectsTemplatesWithoutAliasPlaceholder(): void {
		$values = [];
		$userSettings = new UserSettingsService($this->userConfig($values), $this->settings());
		$this->expectException(ValidationException::class);
		$userSettings->save('alice', ['urlMode' => 'template', 'urlTemplate' => 'https://go.example/static']);
	}

	/** @param array<string,string> $values */
	private function userConfig(array &$values): IAppConfig {
		$config = $this->createMock(IAppConfig::class);
		$config->method('getUserValue')->willReturnCallback(static function (string $uid, string $key, string $default = '') use (&$values): string {
			return $values[$uid . ':' . $key] ?? $default;
		});
		$config->method('setUserValue')->willReturnCallback(static function (string $uid, string $key, string $value) use (&$values): void {
			$values[$uid . ':' . $key] = $value;
		});
		return $config;
	}

	private function urlService(\OCA\Shortlinks\Service\SettingsService $global, UserSettingsService $userSettings): LinkUrlService {
		$generator = $this->createMock(IURLGenerator::class);
		$generator->method('linkToRouteAbsolute')->willReturnCallback(static fn (string $route, array $parameters): string => 'https://cloud.example/apps/shortlinks/r/' . $parameters['slug']);
		return new LinkUrlService($generator, $global, $userSettings);
	}
}
