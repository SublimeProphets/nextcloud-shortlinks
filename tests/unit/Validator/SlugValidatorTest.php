<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Validator;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Tests\Unit\SettingsFactory;
use OCA\Shortlinks\Validator\SlugValidator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class SlugValidatorTest extends TestCase {
	use SettingsFactory;

	public function testAliasIsCaseSensitive(): void {
		$validator = new SlugValidator($this->settings());
		self::assertSame('AbZ9', $validator->normalize('AbZ9'));
		self::assertNotSame($validator->normalize('Ab'), $validator->normalize('ab'));
	}
	public function testReservedAliasIsCaseInsensitive(): void {
		$this->expectException(ValidationException::class);
		(new SlugValidator($this->settings(['reserved_aliases' => ['Campaign']])))->normalize('campaign');
	}
	#[DataProvider('invalidAliases')]
	public function testRejectsInvalidAlias(string $alias): void {
		$this->expectException(ValidationException::class);
		(new SlugValidator($this->settings()))->normalize($alias);
	}
	/** @return list<array{string}> */
	public static function invalidAliases(): array {
		return [[''], ['has space'], ['ü'], ['../admin'], [str_repeat('a', 129)], ['api']];
	}
}
