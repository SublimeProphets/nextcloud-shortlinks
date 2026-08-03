<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCP\AppFramework\Services\IAppConfig;

final class UserSettingsService {
	private const DEFAULTS = [
		'aliasStrategy' => 'inherit',
		'collisionStrategy' => 'random',
		'suffixLength' => '2',
		'urlMode' => 'inherit',
		'baseUrl' => '',
		'urlTemplate' => '',
		'urlPattern' => '',
		'urlReplacement' => '',
		'useThumbnails' => '1',
		'metadataAutocomplete' => '1',
		'showQuickStart' => '1',
	];
	private const BOOL_KEYS = ['useThumbnails', 'metadataAutocomplete', 'showQuickStart'];

	public function __construct(
		private readonly IAppConfig $config,
		private readonly SettingsService $globalSettings,
	) {
	}

	/** @return array<string, mixed> */
	public function get(string $uid): array {
		$result = [];
		foreach (self::DEFAULTS as $key => $default) {
			$result[$key] = $this->config->getUserValue($uid, $this->storageKey($key), $default);
		}
		$result['suffixLength'] = (int)$result['suffixLength'];
		foreach (self::BOOL_KEYS as $key) {
			$result[$key] = $result[$key] === '1';
		}
		$result['allowAliasSettings'] = $this->globalSettings->bool('allow_user_alias_settings');
		$result['allowUrlSettings'] = $this->globalSettings->bool('allow_user_url_settings');
		$result['metadataCollectionEnabled'] = $this->globalSettings->bool('title_fetch') && $this->globalSettings->bool('metadata_collection');
		$result['allowImportSuggestions'] = $this->globalSettings->bool('allow_import_suggestions');
		$result['globalAliasMode'] = $this->globalSettings->string('alias_mode');
		$result['globalUrlMode'] = $this->globalSettings->string('link_url_mode');
		return $result;
	}

	/** @param array<string, mixed> $values @return array<string, mixed> */
	public function save(string $uid, array $values): array {
		$unexpected = array_diff(array_keys($values), array_keys(self::DEFAULTS));
		if ($unexpected !== []) {
			throw new ValidationException('Unexpected user setting', array_fill_keys($unexpected, 'unexpected'));
		}
		$current = $this->get($uid);
		$candidate = array_replace(array_intersect_key($current, self::DEFAULTS), $values);
		foreach (array_keys(self::DEFAULTS) as $key) {
			if (in_array($key, self::BOOL_KEYS, true)) {
				if (!is_bool($candidate[$key])) {
					throw new ValidationException('Invalid user setting', [$key => 'invalid']);
				}
				continue;
			}
			if (!is_string($candidate[$key]) && !($key === 'suffixLength' && is_int($candidate[$key]))) {
				throw new ValidationException('Invalid user setting', [$key => 'invalid']);
			}
			if (is_string($candidate[$key])) {
				$candidate[$key] = trim($candidate[$key]);
			}
		}
		if (!in_array($candidate['aliasStrategy'], ['inherit', 'shortest', 'random', 'readable'], true)) {
			throw new ValidationException('Invalid alias strategy', ['aliasStrategy' => 'invalid']);
		}
		if (!in_array($candidate['collisionStrategy'], ['random', 'numbered'], true)) {
			throw new ValidationException('Invalid alias collision strategy', ['collisionStrategy' => 'invalid']);
		}
		$suffixLength = (int)$candidate['suffixLength'];
		if ($suffixLength < 1 || $suffixLength > 12) {
			throw new ValidationException('Alias suffix length must be between 1 and 12', ['suffixLength' => 'invalid']);
		}
		if (!$this->globalSettings->bool('allow_user_alias_settings') && $candidate['aliasStrategy'] !== 'inherit') {
			throw new ValidationException('Personal alias settings are disabled by the administrator', ['aliasStrategy' => 'forbidden']);
		}
		if (!in_array($candidate['urlMode'], ['inherit', 'simple', 'template', 'regex'], true)) {
			throw new ValidationException('Invalid public URL mode', ['urlMode' => 'invalid']);
		}
		if (!$this->globalSettings->bool('allow_user_url_settings') && $candidate['urlMode'] !== 'inherit') {
			throw new ValidationException('Personal public URL settings are disabled by the administrator', ['urlMode' => 'forbidden']);
		}
		if ($candidate['urlMode'] !== 'inherit') {
			$validated = $this->globalSettings->validateLinkUrlConfiguration([
				'mode' => (string)$candidate['urlMode'],
				'baseUrl' => (string)$candidate['baseUrl'],
				'template' => (string)$candidate['urlTemplate'],
				'pattern' => (string)$candidate['urlPattern'],
				'replacement' => (string)$candidate['urlReplacement'],
			]);
			if ($candidate['urlMode'] === 'simple' && $validated['baseUrl'] === '') {
				throw new ValidationException('Enter a base URL for the personal short-link domain', ['baseUrl' => 'required']);
			}
			$candidate['baseUrl'] = $validated['baseUrl'];
			$candidate['urlTemplate'] = $validated['template'];
			$candidate['urlPattern'] = $validated['pattern'];
			$candidate['urlReplacement'] = $validated['replacement'];
		}
		$candidate['suffixLength'] = (string)$suffixLength;
		foreach (array_keys(self::DEFAULTS) as $key) {
			$value = in_array($key, self::BOOL_KEYS, true) ? ($candidate[$key] ? '1' : '0') : (string)$candidate[$key];
			$this->config->setUserValue($uid, $this->storageKey($key), $value);
		}
		return $this->get($uid);
	}

	/** @return array{strategy:string,collisionStrategy:string,suffixLength:int} */
	public function effectiveAliasConfiguration(string $uid): array {
		$user = $this->get($uid);
		$strategy = $this->globalSettings->bool('allow_user_alias_settings') ? (string)$user['aliasStrategy'] : 'inherit';
		if ($strategy === 'inherit') {
			$strategy = $this->globalSettings->string('alias_mode') === 'readable' ? 'readable' : 'global';
			$collisionStrategy = $this->globalSettings->string('alias_collision_mode');
			$suffixLength = $this->globalSettings->int('alias_suffix_length');
		} else {
			$collisionStrategy = (string)$user['collisionStrategy'];
			$suffixLength = (int)$user['suffixLength'];
		}
		return ['strategy' => $strategy, 'collisionStrategy' => $collisionStrategy, 'suffixLength' => $suffixLength];
	}

	public function usesThumbnails(string $uid): bool {
		return (bool)$this->get($uid)['useThumbnails'];
	}

	public function allowsMetadataAutocomplete(string $uid): bool {
		$settings = $this->get($uid);
		return (bool)$settings['metadataCollectionEnabled'] && (bool)$settings['metadataAutocomplete'];
	}

	/** @return array{mode:string,baseUrl:string,template:string,pattern:string,replacement:string} */
	public function effectiveUrlConfiguration(string $uid): array {
		$user = $this->get($uid);
		if (!$this->globalSettings->bool('allow_user_url_settings') || $user['urlMode'] === 'inherit') {
			return $this->globalSettings->linkUrlConfiguration();
		}
		return $this->globalSettings->validateLinkUrlConfiguration([
			'mode' => (string)$user['urlMode'],
			'baseUrl' => (string)$user['baseUrl'],
			'template' => (string)$user['urlTemplate'],
			'pattern' => (string)$user['urlPattern'],
			'replacement' => (string)$user['urlReplacement'],
		]);
	}

	private function storageKey(string $key): string {
		return 'preferences_' . strtolower((string)preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
	}
}
