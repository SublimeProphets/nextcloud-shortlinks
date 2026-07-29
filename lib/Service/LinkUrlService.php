<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCP\IURLGenerator;

final class LinkUrlService {
	public function __construct(
		private readonly IURLGenerator $urlGenerator,
		private readonly SettingsService $settings,
		private readonly UserSettingsService $userSettings,
	) {
	}

	public function forSlug(string $slug, ?string $ownerUid = null): string {
		$canonical = $this->urlGenerator->linkToRouteAbsolute('shortlinks.redirect.follow', ['slug' => $slug]);
		$configuration = $ownerUid === null ? $this->settings->linkUrlConfiguration() : $this->userSettings->effectiveUrlConfiguration($ownerUid);
		return $this->format($configuration, $slug, $ownerUid ?? '', $canonical);
	}

	public function templateFor(string $ownerUid): string {
		$marker = 'shortlinks-alias-placeholder';
		return str_replace($marker, '{alias}', $this->forSlug($marker, $ownerUid));
	}

	/** @param array{mode:string,baseUrl:string,template:string,pattern:string,replacement:string} $configuration */
	private function format(array $configuration, string $slug, string $ownerUid, string $canonical): string {
		try {
			$result = match ($configuration['mode']) {
				'simple' => $configuration['baseUrl'] !== '' ? rtrim($configuration['baseUrl'], '/') . '/' . rawurlencode($slug) : $canonical,
				'template' => str_replace(['{alias}', '{user}'], [rawurlencode($slug), rawurlencode($ownerUid)], $configuration['template']),
				'regex' => $this->replace($configuration['pattern'], $configuration['replacement'], $canonical),
				default => $canonical,
			};
			return $this->settings->validateRenderedPublicUrl($result);
		} catch (\Throwable) {
			return $canonical;
		}
	}

	private function replace(string $pattern, string $replacement, string $canonical): string {
		$compiled = '~' . str_replace('~', '\\~', $pattern) . '~u';
		$result = @preg_replace($compiled, $replacement, $canonical, 1);
		return is_string($result) && $result !== $canonical ? $result : $canonical;
	}
}
