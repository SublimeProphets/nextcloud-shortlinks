<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Validator;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\SettingsService;

final class UrlValidator implements TargetUrlValidatorInterface {
	public function __construct(
		private readonly SettingsService $settings,
	) {
	}

	public function validate(string $url): string {
		$url = trim($url);
		if ($url === '' || strlen($url) > 8192 || str_contains($url, '\\') || preg_match('/[\x00-\x20\x7F]/', $url) === 1) {
			throw new ValidationException('Invalid target URL', ['targetUrl' => 'invalid']);
		}
		$parts = parse_url($url);
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
			throw new ValidationException('Target URL must be an absolute URL without credentials', ['targetUrl' => 'invalid']);
		}
		$scheme = strtolower($parts['scheme']);
		if (!in_array($scheme, $this->settings->allowedSchemes(), true)) {
			throw new ValidationException('URL scheme is not allowed', ['targetUrl' => 'scheme']);
		}
		$host = $this->asciiHost((string)$parts['host']);
		if ($host === '' || !$this->settings->isDomainAllowed($host)) {
			throw new ValidationException('Target domain is not allowed', ['targetUrl' => 'domain']);
		}
		if (isset($parts['port']) && ($parts['port'] < 1 || $parts['port'] > 65535)) {
			throw new ValidationException('Target URL port is invalid', ['targetUrl' => 'invalid']);
		}
		$hostForUrl = filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) ? '[' . $host . ']' : $host;
		$normalized = $scheme . '://' . $hostForUrl . (isset($parts['port']) ? ':' . $parts['port'] : '');
		$normalized .= $parts['path'] ?? '';
		$normalized .= isset($parts['query']) ? '?' . $parts['query'] : '';
		$normalized .= isset($parts['fragment']) ? '#' . $parts['fragment'] : '';
		return $normalized;
	}

	public function assertSafeForServerRequest(string $url): void {
		$this->validate($url);
		$host = $this->asciiHost((string)parse_url($url, PHP_URL_HOST));
		if ($this->isUnsafeHost($host)) {
			throw new ValidationException('Private and local targets are blocked for server-side requests', ['targetUrl' => 'ssrf']);
		}
	}

	private function isUnsafeHost(string $host): bool {
		$host = strtolower(trim(rtrim($host, '.'), '[]'));
		if ($host === 'localhost' || str_ends_with($host, '.localhost') || str_ends_with($host, '.local')) {
			return true;
		}
		$addresses = filter_var($host, FILTER_VALIDATE_IP) ? [$host] : $this->resolveAddresses($host);
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

	private function asciiHost(string $host): string {
		$host = strtolower(trim(rtrim($host, '.'), '[]'));
		if ($host === '' || filter_var($host, FILTER_VALIDATE_IP)) {
			return $host;
		}
		if (function_exists('idn_to_ascii')) {
			$ascii = idn_to_ascii($host, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
			if ($ascii === false) {
				throw new ValidationException('Target domain is invalid', ['targetUrl' => 'domain']);
			}
			$host = strtolower($ascii);
		}
		if (strlen($host) > 253 || preg_match('/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/D', $host) !== 1) {
			throw new ValidationException('Target domain is invalid', ['targetUrl' => 'domain']);
		}
		return $host;
	}

	/** @return list<string> */
	private function resolveAddresses(string $host): array {
		$addresses = [];
		if (function_exists('dns_get_record')) {
			$records = dns_get_record($host, DNS_A | DNS_AAAA);
			if (is_array($records)) {
				foreach ($records as $record) {
					$address = $record['ip'] ?? $record['ipv6'] ?? null;
					if (is_string($address)) {
						$addresses[] = $address;
					}
				}
			}
		}
		if ($addresses === []) {
			$addresses = gethostbynamel($host) ?: [];
		}
		return array_values(array_unique($addresses));
	}
}
