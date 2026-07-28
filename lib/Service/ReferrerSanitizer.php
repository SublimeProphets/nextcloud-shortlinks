<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

final class ReferrerSanitizer {
	/** @return array{type:string,domain:?string,url:?string} */
	public function sanitize(string $referrer, string $shortHost, string $mode): array {
		$referrer = trim($referrer);
		if ($referrer === '') {
			return ['type' => 'direct', 'domain' => null, 'url' => null];
		}
		$parts = parse_url(substr($referrer, 0, 4096));
		if (!is_array($parts) || !isset($parts['host'])) {
			return ['type' => 'unknown', 'domain' => null, 'url' => null];
		}
		$host = strtolower(rtrim($parts['host'], '.'));
		if ($host === strtolower(rtrim($shortHost, '.'))) {
			return ['type' => 'self', 'domain' => $host, 'url' => null];
		}
		if ($mode === 'none') {
			return ['type' => 'external', 'domain' => null, 'url' => null];
		}
		$scheme = strtolower($parts['scheme'] ?? 'https');
		$path = isset($parts['path']) ? substr($parts['path'], 0, 1024) : '';
		$url = $mode === 'path' || $mode === 'full' ? $scheme . '://' . $host . $path : null;
		if ($mode === 'full' && isset($parts['query'])) {
			parse_str($parts['query'], $query);
			foreach (array_keys($query) as $key) {
				if (preg_match('/token|secret|password|pass|auth|key|code|session|email/i', (string)$key)) {
					$query[$key] = '[redacted]';
				}
			}
			if ($query !== []) {
				$url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
			}
		}
		return ['type' => 'external', 'domain' => substr($host, 0, 255), 'url' => $url];
	}
}
