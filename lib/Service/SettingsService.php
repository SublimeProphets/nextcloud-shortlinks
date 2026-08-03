<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\AppInfo\Application;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IAppConfig;
use OCP\IUserManager;

final class SettingsService {
	private const UNSAFE_REDIRECT_SCHEMES = ['about', 'blob', 'data', 'file', 'javascript', 'vbscript'];
	private const STORAGE_KEY_OVERRIDES = ['enabled' => 'feature_enabled'];

	public const DEFAULTS = [
		'enabled' => true, 'public_creation' => false, 'max_links_per_user' => 10000,
		'public_owner_uid' => '',
		'alias_mode' => 'random', 'alias_length' => 7, 'alias_min_length' => 4,
		'alias_collision_mode' => 'random', 'alias_suffix_length' => 2,
		'allow_user_alias_settings' => true, 'allow_user_url_settings' => true,
		'allow_duplicate_targets' => true, 'title_fetch' => true, 'metadata_collection' => true, 'stats_enabled' => true,
		'privacy_mode' => 'detailed', 'respect_dnt' => true, 'click_retention_days' => 90,
		'aggregate_retention_days' => 365, 'audit_retention_days' => 180, 'trash_retention_days' => 30,
		'referrer_mode' => 'domain', 'log_authenticated_users' => false, 'record_bots' => true,
		'admin_manage_all' => false, 'legacy_api' => false, 'api_tokens' => false,
		'user_deletion_mode' => 'retain', 'base_url' => '', 'link_url_mode' => 'simple',
		'link_url_template' => '', 'link_url_pattern' => '', 'link_url_replacement' => '', 'geoip_path' => '',
		'allow_import_suggestions' => true, 'suggestion_recipient' => 'shortlinks@thoeni.me',
	];

	private const BOOL_KEYS = ['enabled', 'public_creation', 'allow_user_alias_settings', 'allow_user_url_settings', 'allow_duplicate_targets', 'title_fetch', 'metadata_collection', 'stats_enabled', 'respect_dnt', 'log_authenticated_users', 'record_bots', 'admin_manage_all', 'legacy_api', 'api_tokens', 'allow_import_suggestions'];
	private const INT_KEYS = ['max_links_per_user', 'alias_length', 'alias_min_length', 'alias_suffix_length', 'click_retention_days', 'aggregate_retention_days', 'audit_retention_days', 'trash_retention_days'];
	private const ARRAY_KEYS = ['allowed_schemes', 'reserved_aliases', 'domain_allowlist', 'domain_blocklist', 'creation_groups', 'public_creation_groups', 'redirect_statuses'];

	public function __construct(
		private readonly IAppConfig $config,
		private readonly ITimeFactory $time,
		private readonly ?IUserManager $users = null,
	) {
	}

	public function bool(string $key): bool {
		return $this->config->getValueBool(Application::APP_ID, self::STORAGE_KEY_OVERRIDES[$key] ?? $key, (bool)(self::DEFAULTS[$key] ?? false));
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

	/** @return list<int> */
	public function redirectStatuses(): array {
		$statuses = array_values(array_unique(array_map('intval', $this->array('redirect_statuses', ['301', '302', '307', '308']))));
		$statuses = array_values(array_filter($statuses, self::isRedirectStatus(...)));
		return $statuses === [] ? [301, 302, 307, 308] : $statuses;
	}

	public function isRedirectStatusAllowed(int $status): bool {
		return self::isRedirectStatus($status) && in_array($status, $this->redirectStatuses(), true);
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
		if (!in_array($candidate['alias_mode'], ['base36', 'base62', 'random', 'readable'], true)) {
			throw new ValidationException('Invalid alias mode', ['aliasMode' => 'invalid']);
		}
		if (!in_array($candidate['alias_collision_mode'], ['random', 'numbered'], true)) {
			throw new ValidationException('Invalid alias collision mode', ['aliasCollisionMode' => 'invalid']);
		}
		if ((int)$candidate['alias_min_length'] < 1 || (int)$candidate['alias_length'] < (int)$candidate['alias_min_length'] || (int)$candidate['alias_length'] > 64) {
			throw new ValidationException('Alias length is outside the allowed range', ['aliasLength' => 'invalid']);
		}
		if ((int)$candidate['alias_suffix_length'] < 1 || (int)$candidate['alias_suffix_length'] > 12) {
			throw new ValidationException('Alias suffix length must be between 1 and 12', ['aliasSuffixLength' => 'invalid']);
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
		if (filter_var((string)$candidate['suggestion_recipient'], FILTER_VALIDATE_EMAIL) === false || strlen((string)$candidate['suggestion_recipient']) > 254) {
			throw new ValidationException('Enter a valid suggestion recipient email address', ['suggestion_recipient' => 'invalid']);
		}
		if ((bool)$candidate['public_creation'] && ((string)$candidate['public_owner_uid'] === '' || ($this->users !== null && $this->users->get((string)$candidate['public_owner_uid']) === null))) {
			throw new ValidationException('Public creation requires an existing owner UID', ['publicOwnerUid' => 'invalid']);
		}
		$schemes = array_values(array_unique(array_map(static fn (mixed $scheme): string => strtolower(trim((string)$scheme)), (array)$candidate['allowed_schemes'])));
		if ($schemes === [] || count($schemes) > 64) {
			throw new ValidationException('At least one valid URL scheme is required', ['allowedSchemes' => 'invalid']);
		}
		foreach ($schemes as $scheme) {
			if (preg_match('/^[a-z][a-z0-9+.-]{0,63}$/D', $scheme) !== 1 || in_array($scheme, self::UNSAFE_REDIRECT_SCHEMES, true)) {
				throw new ValidationException('Invalid URL scheme configuration', ['allowedSchemes' => 'invalid']);
			}
		}
		$statuses = array_values(array_unique(array_map('intval', (array)$candidate['redirect_statuses'])));
		if ($statuses === [] || count($statuses) > 100 || array_filter($statuses, static fn (int $status): bool => !self::isRedirectStatus($status)) !== []) {
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
		$this->validateLinkUrlConfiguration([
			'mode' => (string)$candidate['link_url_mode'],
			'baseUrl' => (string)$candidate['base_url'],
			'template' => (string)$candidate['link_url_template'],
			'pattern' => (string)$candidate['link_url_pattern'],
			'replacement' => (string)$candidate['link_url_replacement'],
		]);

		$normalized['allowed_schemes'] = $schemes;
		$normalized['redirect_statuses'] = array_map('strval', $statuses);
		foreach ($normalized as $key => $value) {
			if (in_array($key, self::BOOL_KEYS, true)) {
				$this->config->setValueBool(Application::APP_ID, self::STORAGE_KEY_OVERRIDES[$key] ?? $key, (bool)$value);
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

	/** @return array{mode:string,baseUrl:string,template:string,pattern:string,replacement:string} */
	public function linkUrlConfiguration(): array {
		return $this->validateLinkUrlConfiguration([
			'mode' => $this->string('link_url_mode'),
			'baseUrl' => $this->string('base_url'),
			'template' => $this->string('link_url_template'),
			'pattern' => $this->string('link_url_pattern'),
			'replacement' => $this->string('link_url_replacement'),
		]);
	}

	/**
	 * @param array{mode:string,baseUrl:string,template:string,pattern:string,replacement:string} $configuration
	 * @return array{mode:string,baseUrl:string,template:string,pattern:string,replacement:string}
	 */
	public function validateLinkUrlConfiguration(array $configuration): array {
		$mode = trim($configuration['mode']);
		if (!in_array($mode, ['simple', 'template', 'regex'], true)) {
			throw new ValidationException('Invalid public URL mode', ['urlMode' => 'invalid']);
		}
		$baseUrl = $this->validateBaseUrl($configuration['baseUrl']) ?? '';
		$template = trim($configuration['template']);
		$pattern = trim($configuration['pattern']);
		$replacement = trim($configuration['replacement']);
		foreach (['template' => $template, 'pattern' => $pattern, 'replacement' => $replacement] as $field => $value) {
			if (strlen($value) > 1024 || preg_match('/[\x00-\x1f\x7f]/', $value) === 1) {
				throw new ValidationException('Public URL configuration is too long or contains control characters', [$field => 'invalid']);
			}
		}
		if ($mode === 'template') {
			if (!str_contains($template, '{alias}')) {
				throw new ValidationException('The public URL template must contain {alias}', ['urlTemplate' => 'missing_alias']);
			}
			if (preg_match_all('/\{([^}]+)\}/', $template, $matches) === false || array_diff($matches[1] ?? [], ['alias', 'user']) !== []) {
				throw new ValidationException('The public URL template contains an unsupported placeholder', ['urlTemplate' => 'invalid']);
			}
			$this->validateRenderedPublicUrl(str_replace(['{alias}', '{user}'], ['example-link', 'alice'], $template));
		}
		if ($mode === 'regex') {
			$this->validateRegex($pattern, $replacement);
		}
		return ['mode' => $mode, 'baseUrl' => $baseUrl, 'template' => $template, 'pattern' => $pattern, 'replacement' => $replacement];
	}

	public function validateRenderedPublicUrl(string $url): string {
		$value = trim($url);
		if (strlen($value) > 4096 || preg_match('/[\x00-\x20\x7f]/', $value) === 1 || str_contains($value, '\\')) {
			throw new ValidationException('Generated public URL is invalid', ['publicUrl' => 'invalid']);
		}
		$parts = parse_url($value);
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host']) || !in_array(strtolower($parts['scheme']), ['http', 'https'], true) || isset($parts['user']) || isset($parts['pass'])) {
			throw new ValidationException('Generated public URL must be an absolute HTTP(S) URL without credentials', ['publicUrl' => 'invalid']);
		}
		return $value;
	}

	private function validateRegex(string $pattern, string $replacement): void {
		if ($pattern === '' || $replacement === '' || preg_match('/\(\?[R0]|\(\?\(R|\\\\C|\(\*/', $pattern) === 1) {
			throw new ValidationException('The regular expression or replacement is invalid', ['urlPattern' => 'invalid']);
		}
		$compiled = '~' . str_replace('~', '\\~', $pattern) . '~u';
		if (@preg_match($compiled, 'https://cloud.example/apps/shortlinks/r/example-link') === false) {
			throw new ValidationException('The regular expression is invalid', ['urlPattern' => 'invalid']);
		}
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
			$this->config->setValueInt(Application::APP_ID, 'visitor_secret_rotated_at', $this->time->getTime(), true, true);
		}
		return $secret;
	}

	public function rotateVisitorSecret(): void {
		$this->config->setValueString(Application::APP_ID, 'visitor_secret', base64_encode(random_bytes(32)), true, true);
		$this->config->setValueInt(Application::APP_ID, 'visitor_secret_rotated_at', $this->time->getTime(), true, true);
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
		$result['redirect_statuses'] = $this->redirectStatuses();
		return $result;
	}

	private static function isRedirectStatus(int $status): bool {
		return $status >= 300 && $status <= 399;
	}
}
