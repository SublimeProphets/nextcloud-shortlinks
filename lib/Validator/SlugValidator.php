<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Validator;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\SettingsService;

final class SlugValidator {
	private const BUILTIN_RESERVED = ['admin', 'api', 'apps', 'css', 'index.php', 'js', 'login', 'logout', 'ocs', 'ocs-provider', 'ocs-public', 'remote.php', 'robots.txt', 'settings', 'status.php', 'themes'];

	public function __construct(private readonly SettingsService $settings) {
	}

	public function normalize(string $slug): string {
		$slug = trim($slug);
		if ($slug === '' || strlen($slug) > 128 || preg_match('/^[a-z0-9][a-z0-9_-]*$/D', $slug) !== 1) {
			throw new ValidationException('Alias must contain 1–128 lowercase ASCII letters, digits, underscores, or hyphens', ['slug' => 'invalid']);
		}
		$slug = strtolower($slug);
		if (in_array($slug, array_merge(self::BUILTIN_RESERVED, $this->settings->reservedAliases()), true)) {
			throw new ValidationException('This alias is reserved', ['slug' => 'reserved']);
		}
		return $slug;
	}
}
