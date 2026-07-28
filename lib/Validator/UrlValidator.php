<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Validator;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\SettingsService;

final class UrlValidator {
	public function __construct(private readonly SettingsService $settings) {
	}

	public function validate(string $url): string {
		$url = trim($url);
		if ($url === '' || strlen($url) > 8192 || preg_match('/[\x00-\x1F\x7F]/', $url) === 1) {
			throw new ValidationException('Invalid target URL', ['targetUrl' => 'invalid']);
		}
		$parts = parse_url($url);
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
			throw new ValidationException('Target URL must be an absolute URL without credentials', ['targetUrl' => 'invalid']);
		}
		$scheme = strtolower((string)$parts['scheme']);
		if (!in_array($scheme, $this->settings->allowedSchemes(), true)) {
			throw new ValidationException('URL scheme is not allowed', ['targetUrl' => 'scheme']);
		}
		$host = strtolower(rtrim((string)$parts['host'], '.'));
		if ($host === '' || !$this->settings->isDomainAllowed($host)) {
			throw new ValidationException('Target domain is not allowed', ['targetUrl' => 'domain']);
		}
		return $url;
	}

	public function assertSafeForServerRequest(string $url): void {
		$this->validate($url);
		$host = (string)parse_url($url, PHP_URL_HOST);
		if ($this->isUnsafeHost($host)) {
			throw new ValidationException('Private and local targets are blocked for server-side requests', ['targetUrl' => 'ssrf']);
		}
	}

	private function isUnsafeHost(string $host): bool {
		$host = strtolower(rtrim($host, '.'));
		if ($host === 'localhost' || str_ends_with($host, '.localhost') || str_ends_with($host, '.local')) {
			return true;
		}
		$addresses = filter_var($host, FILTER_VALIDATE_IP) ? [$host] : (gethostbynamel($host) ?: []);
		if ($addresses === []) {
			return true;
		}
		foreach ($addresses as $address) {
			if (filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
				return true;
			}
		}
		return false;
	}
}
