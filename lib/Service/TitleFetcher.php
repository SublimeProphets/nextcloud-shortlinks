<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\Http\Client\IClientService;

final class TitleFetcher {
	private const MAX_REDIRECTS = 3;
	private const MAX_BYTES = 65536;

	public function __construct(
		private readonly IClientService $clients,
		private readonly TargetUrlValidatorInterface $validator,
		private readonly SettingsService $settings,
	) {
	}

	public function fetch(string $url): string {
		if (!$this->settings->bool('title_fetch')) {
			throw new ValidationException('Automatic title fetching is disabled', ['targetUrl' => 'title_fetch_disabled']);
		}
		$client = $this->clients->newClient();
		for ($redirects = 0; $redirects <= self::MAX_REDIRECTS; ++$redirects) {
			$this->validator->assertSafeForServerRequest($url);
			$response = $client->get($url, [
				'allow_redirects' => false,
				'http_errors' => false,
				'stream' => true,
				'timeout' => 5,
				'connect_timeout' => 3,
				'headers' => ['Accept' => 'text/html,application/xhtml+xml;q=0.9', 'Range' => 'bytes=0-' . (self::MAX_BYTES - 1)],
			]);
			$status = $response->getStatusCode();
			if (in_array($status, [301, 302, 303, 307, 308], true)) {
				if ($redirects === self::MAX_REDIRECTS) {
					throw new ValidationException('Title fetch redirect limit exceeded', ['targetUrl' => 'redirect_limit']);
				}
				$location = trim($response->getHeader('Location'));
				if ($location === '') {
					throw new ValidationException('Title fetch redirect has no location', ['targetUrl' => 'invalid_redirect']);
				}
				$url = $this->resolveLocation($url, $location);
				continue;
			}
			if ($status < 200 || $status >= 300) {
				throw new ValidationException('Title fetch returned an unsuccessful response', ['targetUrl' => 'fetch_failed']);
			}
			$contentType = strtolower($response->getHeader('Content-Type'));
			if ($contentType !== '' && !str_starts_with($contentType, 'text/html') && !str_starts_with($contentType, 'application/xhtml+xml')) {
				throw new ValidationException('Title fetch only accepts HTML', ['targetUrl' => 'not_html']);
			}
			$body = $response->getBody();
			$html = is_resource($body) ? (string)stream_get_contents($body, self::MAX_BYTES + 1) : substr((string)$body, 0, self::MAX_BYTES + 1);
			if (strlen($html) > self::MAX_BYTES) {
				throw new ValidationException('Title fetch response is too large', ['targetUrl' => 'too_large']);
			}
			if (preg_match('~<title(?:\\s[^>]*)?>(.*?)</title\\s*>~isu', $html, $match) !== 1) {
				return '';
			}
			$title = trim(html_entity_decode(strip_tags($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
			return mb_substr(preg_replace('/\\s+/u', ' ', $title) ?? $title, 0, 255);
		}
		throw new ValidationException('Title fetch failed', ['targetUrl' => 'fetch_failed']);
	}

	private function resolveLocation(string $base, string $location): string {
		if (preg_match('~^https?://~i', $location) === 1) {
			return $location;
		}
		$parts = parse_url($base);
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host'])) {
			throw new ValidationException('Invalid redirect target', ['targetUrl' => 'invalid_redirect']);
		}
		$origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
		if (str_starts_with($location, '//')) {
			return $parts['scheme'] . ':' . $location;
		}
		if (str_starts_with($location, '/')) {
			return $origin . $location;
		}
		$path = $parts['path'] ?? '/';
		if (str_starts_with($location, '?')) {
			return $origin . $path . $location;
		}
		if (str_starts_with($location, '#')) {
			return $origin . $path . (isset($parts['query']) ? '?' . $parts['query'] : '') . $location;
		}
		$directory = rtrim(str_replace('\\', '/', dirname($path)), '/');
		$combined = ($directory === '' ? '' : $directory) . '/' . $location;
		$segments = [];
		foreach (explode('/', $combined) as $segment) {
			if ($segment === '' || $segment === '.') {
				continue;
			}
			if ($segment === '..') {
				array_pop($segments);
				continue;
			}
			$segments[] = $segment;
		}
		return $origin . '/' . implode('/', $segments);
	}
}
