<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCP\IURLGenerator;

final class LinkUrlService {
	public function __construct(
		private readonly IURLGenerator $urlGenerator,
		private readonly SettingsService $settings,
	) {
	}

	public function forSlug(string $slug): string {
		$baseUrl = $this->settings->validatedBaseUrl();
		return $baseUrl !== null
			? $baseUrl . '/' . rawurlencode($slug)
			: $this->urlGenerator->linkToRouteAbsolute('shortlinks.redirect.follow', ['slug' => $slug]);
	}
}
