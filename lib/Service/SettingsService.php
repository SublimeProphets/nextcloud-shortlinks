<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\AppInfo\Application;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\IAppConfig;

final class SettingsService {
	public const DEFAULTS = [
		'enabled' => true, 'public_creation' => false, 'max_links_per_user' => 10000,
		'public_owner_uid' => '',
		'alias_mode' => 'random', 'alias_length' => 7, 'alias_min_length' => 4,
		'allow_duplicate_targets' => true, 'title_fetch' => false, 'stats_enabled' => true,
		'privacy_mode' => 'detailed', 'respect_dnt' => true, 'click_retention_days' => 90,
		'aggregate_retention_days' => 365, 'audit_retention_days' => 180, 'trash_retention_days' => 30,
		'referrer_mode' => 'domain', 'log_authenticated_users' => false, 'record_bots' => true,
		'admin_manage_all' => false, 'legacy_api' => false, 'api_tokens' => false,
		'user_deletion_mode' => 'retain', 'base_url' => '', 'geoip_path' => '',
	];

	private const BOOL_KEYS = ['enabled', 'public_creation', 'allow_duplicate_targets', 'title_fetch', 'stats_enabled', 'respect_dnt', 'log_authenticated_users', 'record_bots', 'admin_manage_all', 'legacy_api', 'api_tokens'];
	private const INT_KEYS = ['max_links_per_user', 'alias_length', 'alias_min_length', 'click_retention_days', 'aggregate_retention_days', 'audit_retention_days', 'trash_retention_days'];
	private const ARRAY_KEYS = ['allowed_schemes', 'reserved_aliases', 'domain_allowlist', 'domain_blocklist', 'creation_groups', 'public_creation_groups', 'redirect_statuses'];

	public function __construct(
		private readonly IAppConfig $config,
	) {
	}

	public function bool(string $key): bool {
		return $this->config->getValueBool(Application::APP_ID, $key, (bool)(self::DEFAULTS[$key] ?? false));
	}

	public function int(string $key): int {
		return $this->config->getValueInt(Application::APP_ID, $key, (int)(self::DEFAULTS[$key] ?? 0));
	}

	public function string(string $key): string {
		return $this->config->getValueString(Application::APP_ID, $key, (string)(self::DEFAULTS[$key] ?? ''));
	}

	/** @return list<string> */
	public function array(string $key, array $default = []): array {
		$value = $this->config->getValueArray(Application::APP_ID, $key, $default);
		return array_values(array_filter($value, 'is_string'));
	}

	/** @return list<string> */
	public function allowedSchemes(): array {
		return $this->array('allowed_schemes', ['http', 'https']);
	}

	/** @return list<string> */
	public function reservedAliases(): array {
		return $this->array('reserved_aliases', []);
	}

	public function isDomainAllowed(string $host): bool {
		$host = strtolower($host);
		foreach ($this->array('domain_blocklist') as $blocked) {
			if ($this->domainMatches($host, $blocked)) {
				return false;
			}
		}
		$allowlist = $this->array('domain_allowlist');
		if ($allowlist === []) {
			return true;
		}
		foreach ($allowlist as $allowed) {
			if ($this->domainMatches($host, $allowed)) {
				return true;
			}
		}
		return false;
	}

	private function domainMatches(string $host, string $rule): bool {
		$host = $this->asciiDomain($host);
		$rule = strtolower(trim($rule));
		$wildcard = str_starts_with($rule, '*.');
		$rule = $this->asciiDomain($wildcard ? substr($rule, 2) : $rule);
		if ($wildcard) {
			return str_ends_with($host, '.' . $rule) && $host !== $rule;
		}
		return $host === $rule;
	}

	private function asciiDomain(string $host): string {
		$host = strtolower(trim(rtrim($host, '.'), '[]'));
		if (function_exists('idn_to_ascii') && !filter_var($host, FILTER_VALIDATE_IP)) {
			$ascii = idn_to_ascii($host);
			return $ascii === false ? '' : strtolower($ascii);
		}
		return $host;
	}

	/** @param array<string, mixed> $values */
	public function save(array $values): void {
		$normalized = [];
		foreach ($values as $key => $value) {
			if (in_array($key, self::BOOL_KEYS, true) && is_bool($value)) {
				$normalized[$key] = $value;
			} elseif (in_array($key, self::INT_KEYS, true) && (is_int($value) || (is_string($value) && preg_match('/^\d+$/D', $value) === 1))) {
				$normalized[$key] = (int)$value;
			} elseif (in_array($key, self::ARRAY_KEYS, true) && is_array($value)) {
				$items = [];
				foreach (array_slice($value, 0, 500) as $item) {
					if (!is_string($item) && !is_int($item)) {
						throw new ValidationException('Invalid administration setting', [$key => 'invalid']);
					}
					$item = trim((string)$item);
					if ($item !== '') {
						$items[] = $item;
					}
				}
				$normalized[$key] = array_values(array_unique($items));
			} elseif (array_key_exists($key, self::DEFAULTS) && is_string($value)) {
				$normalized[$key] = trim($value);
			} else {
				throw new ValidationException('Invalid administration setting', [$key => 'invalid']);
			}
		}
		$candidate = array_replace($this->publicSettings(), $normalized);
		if (!in_array($candidate['alias_mode'], ['base36', 'base62', 'random'], true)) {
			throw new ValidationException('Invalid alias mode', ['aliasMode' => 'invalid']);
		}
		if ((int)$candidate['alias_min_length'] < 1 || (int)$candidate['alias_length'] < (int)$candidate['alias_min_length'] || (int)$candidate['alias_length'] > 64) {
			throw new ValidationException('Alias length is outside the allowed range', ['aliasLength' => 'invalid']);
		}
		if ((int)$candidate['max_links_per_user'] < 1 || (int)$candidate['max_links_per_user'] > 1000000) {
			throw new ValidationException('Maximum links per user must be between 1 and 1000000', ['maxLinksPerUser' => 'invalid']);
		}
		foreach (['click_retention_days', 'aggregate_retention_days', 'audit_retention_days', 'trash_retention_days'] as $key) {
			if ((int)$candidate[$key] < 0 || (int)$candidate[$key] > 36500) {
				throw new ValidationException('Retention must be between 0 and 36500 days', [$key => 'invalid']);
			}
		}
		if (!in_array($candidate['privacy_mode'], ['counts', 'detailed'], true)) {
			throw new ValidationException('Invalid privacy mode', ['privacyMode' => 'invalid']);
		}
		if (!in_array($candidate['referrer_mode'], ['none', 'domain', 'path', 'full'], true)) {
			throw new ValidationException('Invalid referrer mode', ['referrerMode' => 'invalid']);
		}
		if ($candidate['user_deletion_mode'] !== 'retain') {
			throw new ValidationException('Invalid account deletion mode', ['userDeletionMode' => 'invalid']);
		}
		$schemes = array_values(array_unique(array_map('strtolower', (array)$candidate['allowed_schemes'])));
		if ($schemes === [] || array_diff($schemes, ['http', 'https']) !== []) {
			throw new ValidationException('Only HTTP and HTTPS URL schemes are supported', ['allowedSchemes' => 'invalid']);
		}
		$statuses = array_values(array_unique(array_map('intval', (array)$candidate['redirect_statuses'])));
		if ($statuses === [] || array_diff($statuses, [301, 302, 307, 308]) !== []) {
			throw new ValidationException('Invalid redirect status configuration', ['redirectStatuses' => 'invalid']);
		}
		foreach (['domain_allowlist', 'domain_blocklist'] as $list) {
			foreach ((array)$candidate[$list] as $rule) {
				if (!$this->validDomainRule((string)$rule)) {
					throw new ValidationException('Invalid domain rule', [$list => 'invalid']);
				}
			}
		}
		foreach ((array)$candidate['reserved_aliases'] as $alias) {
			if (preg_match('/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/D', (string)$alias) !== 1) {
				throw new ValidationException('Invalid reserved alias', ['reservedAliases' => 'invalid']);
			}
		}
		foreach (['creation_groups', 'public_creation_groups'] as $key) {
			foreach ((array)$candidate[$key] as $groupId) {
				if (strlen((string)$groupId) > 64 || preg_match('/[\x00-\x1f\x7f]/', (string)$groupId) === 1) {
					throw new ValidationException('Invalid group identifier', [$key => 'invalid']);
				}
			}
		}
		foreach (['public_owner_uid' => 64, 'geoip_path' => 4096] as $key => $maximum) {
			if (strlen((string)$candidate[$key]) > $maximum || preg_match('/[\x00-\x1f\x7f]/', (string)$candidate[$key]) === 1) {
				throw new ValidationException('Invalid administration setting', [$key => 'invalid']);
			}
		}
		$this->validateBaseUrl((string)$candidate['base_url']);

		$normalized['allowed_schemes'] = $schemes;
		$normalized['redirect_statuses'] = array_map('strval', $statuses);
		foreach ($normalized as $key => $value) {
			if (in_array($key, self::BOOL_KEYS, true)) {
				$this->config->setValueBool(Application::APP_ID, $key, (bool)$value);
			} elseif (in_array($key, self::INT_KEYS, true)) {
				$this->config->setValueInt(Application::APP_ID, $key, (int)$value);
			} elseif (in_array($key, self::ARRAY_KEYS, true)) {
				$this->config->setValueArray(Application::APP_ID, $key, (array)$value);
			} else {
				$this->config->setValueString(Application::APP_ID, $key, (string)$value);
			}
		}
	}

	public function validatedBaseUrl(): ?string {
		return $this->validateBaseUrl($this->string('base_url'));
	}

	private function validateBaseUrl(string $baseUrl): ?string {
		$value = rtrim(trim($baseUrl), '/');
		if ($value === '') {
			return null;
		}
		if (strlen($value) > 4096) {
			throw new ValidationException('Public base URL is too long', ['baseUrl' => 'invalid']);
		}
		$parts = parse_url($value);
		$host = is_array($parts) && isset($parts['host']) ? $this->asciiDomain($parts['host']) : '';
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host']) || $host === '' || !in_array(strtolower($parts['scheme']), ['http', 'https'], true) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment']) || str_contains($value, '\\') || preg_match('/[\x00-\x20\x7f]/', $value) === 1) {
			throw new ValidationException('Public base URL must be an absolute HTTP(S) URL without credentials, query, or fragment', ['baseUrl' => 'invalid']);
		}
		$hostForUrl = filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) ? '[' . $host . ']' : $host;
		return strtolower($parts['scheme']) . '://' . $hostForUrl . (isset($parts['port']) ? ':' . $parts['port'] : '') . ($parts['path'] ?? '');
	}

	private function validDomainRule(string $rule): bool {
		$rule = strtolower(trim($rule));
		if (str_starts_with($rule, '*.')) {
			$rule = substr($rule, 2);
		}
		if ($rule === '' || str_contains($rule, '/') || str_contains($rule, ':')) {
			return false;
		}
		if (function_exists('idn_to_ascii')) {
			$ascii = idn_to_ascii($rule);
			if ($ascii === false) {
				return false;
			}
			$rule = $ascii;
		}
		return strlen($rule) <= 253 && preg_match('/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/D', $rule) === 1;
	}

	public function visitorSecret(): string {
		$secret = $this->config->getValueString(Application::APP_ID, 'visitor_secret', '', true);
		if ($secret === '') {
			$secret = base64_encode(random_bytes(32));
			$this->config->setValueString(Application::APP_ID, 'visitor_secret', $secret, true, true);
			$this->config->setValueInt(Application::APP_ID, 'visitor_secret_rotated_at', time(), true, true);
		}
		return $secret;
	}

	public function rotateVisitorSecret(): void {
		$this->config->setValueString(Application::APP_ID, 'visitor_secret', base64_encode(random_bytes(32)), true, true);
		$this->config->setValueInt(Application::APP_ID, 'visitor_secret_rotated_at', time(), true, true);
	}

	/** @return array<string, mixed> */
	public function publicSettings(): array {
		$result = self::DEFAULTS;
		foreach ($result as $key => $default) {
			$result[$key] = is_bool($default) ? $this->bool($key) : (is_int($default) ? $this->int($key) : $this->string($key));
		}
		$result['allowed_schemes'] = $this->allowedSchemes();
		$result['reserved_aliases'] = $this->reservedAliases();
		$result['domain_allowlist'] = $this->array('domain_allowlist');
		$result['domain_blocklist'] = $this->array('domain_blocklist');
		$result['creation_groups'] = $this->array('creation_groups');
		$result['public_creation_groups'] = $this->array('public_creation_groups');
		$result['redirect_statuses'] = array_map('intval', $this->array('redirect_statuses', ['301', '302', '307', '308']));
		return $result;
	}
}
