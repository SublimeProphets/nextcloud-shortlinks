<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Provider\Alias\AliasGeneratorInterface;
use OCA\Shortlinks\Validator\SlugValidator;

final class AliasSuggestionService {
	private const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly AliasGeneratorInterface $generator,
		private readonly SlugValidator $slugValidator,
		private readonly UserSettingsService $userSettings,
		private readonly SettingsService $globalSettings,
	) {
	}

	public function suggest(string $ownerUid, string $title = '', string $targetUrl = ''): string {
		for ($attempt = 0; $attempt < 40; ++$attempt) {
			try {
				$slug = $this->slugValidator->normalize($this->candidate($ownerUid, $title, $targetUrl, $attempt));
			} catch (ValidationException) {
				continue;
			}
			if (!$this->links->slugExists($slug)) {
				return $slug;
			}
		}
		throw new ConflictException('Could not generate an available alias');
	}

	public function preview(string $ownerUid, string $title = '', string $targetUrl = ''): string {
		$configuration = $this->userSettings->effectiveAliasConfiguration($ownerUid);
		if ($configuration['strategy'] === 'global') {
			$mode = $this->globalSettings->string('alias_mode');
			return $mode === 'random' ? strtolower($this->random($this->globalSettings->int('alias_length'))) : str_repeat('0', max(1, $this->globalSettings->int('alias_min_length') - 1)) . '1';
		}
		return $this->candidate($ownerUid, $title, $targetUrl, 0);
	}

	public function candidate(string $ownerUid, string $title, string $targetUrl, int $attempt): string {
		$configuration = $this->userSettings->effectiveAliasConfiguration($ownerUid);
		if (in_array($configuration['strategy'], ['global', 'shortest'], true)) {
			return $this->generator->generate();
		}
		if ($configuration['strategy'] === 'random') {
			return $this->random(max(1, min(64, $this->globalSettings->int('alias_length'))));
		}
		$base = $this->readableBase($title, $targetUrl);
		if ($attempt === 0) {
			return $base;
		}
		if ($configuration['collisionStrategy'] === 'numbered') {
			$suffix = '-' . ($attempt + 1);
		} else {
			$length = min(12, $configuration['suffixLength'] + intdiv($attempt - 1, 8));
			$suffix = '-' . strtolower($this->random($length));
		}
		return substr($base, 0, 128 - strlen($suffix)) . $suffix;
	}

	private function readableBase(string $title, string $targetUrl): string {
		$source = trim($title);
		if ($source === '') {
			$parts = parse_url($targetUrl);
			$path = is_array($parts) ? trim($parts['path'] ?? '', '/') : '';
			if ($path !== '') {
				$segments = explode('/', $path);
				$source = (string)end($segments);
			}
			if ($source === '' && is_array($parts)) {
				$host = preg_replace('/^www\./i', '', $parts['host'] ?? '');
				$source = explode('.', (string)$host)[0] ?? '';
			}
		}
		$ascii = function_exists('iconv') ? iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $source) : $source;
		$ascii = $ascii === false ? $source : $ascii;
		$slug = strtolower(trim((string)preg_replace('/[^A-Za-z0-9]+/', '-', $ascii), '-'));
		return substr($slug !== '' ? $slug : 'short', 0, 128);
	}

	private function random(int $length): string {
		$result = '';
		for ($index = 0; $index < $length; ++$index) {
			$result .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
		}
		return $result;
	}
}
