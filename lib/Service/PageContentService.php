<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\LinkPage;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\Contacts\IManager;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\IURLGenerator;

final class PageContentService {
	private const MAX_FILES = 100;
	private const MAX_CONTACTS = 100;

	public function __construct(
		private readonly IRootFolder $rootFolder,
		private readonly IManager $contacts,
		private readonly IURLGenerator $urls,
		private readonly SettingsService $settings,
	) {
	}

	/** @param list<mixed> $values @return list<string> */
	public function validateFilePaths(string $ownerUid, array $values): array {
		$paths = [];
		foreach (array_slice($values, 0, self::MAX_FILES) as $value) {
			$path = $this->normalizePath($value);
			try {
				$node = $this->rootFolder->getUserFolder($ownerUid)->get(ltrim($path, '/'));
			} catch (\Throwable) {
				throw new ValidationException('A selected file could not be found', ['filePaths' => 'not_found']);
			}
			if (!$node instanceof File || !$node->isReadable()) {
				throw new ValidationException('Select readable files from Nextcloud Files', ['filePaths' => 'invalid']);
			}
			$paths[] = $path;
		}

		return array_values(array_unique($paths));
	}

	/** @param list<mixed> $values @return list<array{key:string,name:string,emails:list<string>,phones:list<string>,organization:string}> */
	public function validateContacts(array $values): array {
		$result = [];
		foreach (array_slice($values, 0, self::MAX_CONTACTS) as $value) {
			if (!is_array($value)) {
				continue;
			}
			$name = substr(trim((string)($value['name'] ?? '')), 0, 255);
			if ($name === '') {
				throw new ValidationException('Every selected contact needs a name', ['contacts' => 'invalid']);
			}
			$emails = array_values(array_unique(array_filter(array_map(static fn (mixed $email): string => substr(trim((string)$email), 0, 254), (array)($value['emails'] ?? [])), static fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false)));
			$phones = array_values(array_unique(array_filter(array_map(static fn (mixed $phone): string => substr(trim((string)$phone), 0, 64), (array)($value['phones'] ?? [])), static fn (string $phone): bool => $phone !== '' && preg_match('/^[0-9+().\/ -]+$/D', $phone) === 1)));
			$organization = substr(trim((string)($value['organization'] ?? '')), 0, 255);
			$key = substr(trim((string)($value['key'] ?? '')), 0, 128);
			if ($key === '') {
				$key = substr(hash('sha256', $name . '|' . implode('|', $emails) . '|' . implode('|', $phones)), 0, 24);
			}
			$result[$key] = ['key' => $key, 'name' => $name, 'emails' => array_slice($emails, 0, 10), 'phones' => array_slice($phones, 0, 10), 'organization' => $organization];
		}
		return array_values($result);
	}

	/** @return array{enabled:bool,items:list<array{key:string,name:string,emails:list<string>,phones:list<string>,organization:string}>} */
	public function searchContacts(string $search): array {
		$search = trim($search);
		if (!$this->contacts->isEnabled() || strlen($search) < 2) {
			return ['enabled' => $this->contacts->isEnabled(), 'items' => []];
		}

		try {
			$matches = $this->contacts->search($search, ['FN', 'EMAIL', 'TEL', 'ORG', 'UID'], [
				'types' => true,
				'limit' => 30,
				'enumeration' => false,
				'fullmatch' => false,
				'strict_search' => false,
			]);
		} catch (\Throwable) {
			return ['enabled' => true, 'items' => []];
		}

		$items = [];
		foreach ((array)$matches as $match) {
			if (!is_array($match)) {
				continue;
			}
			$name = $this->firstValue($match['FN'] ?? null);
			if ($name === '') {
				continue;
			}
			$emails = array_values(array_filter($this->values($match['EMAIL'] ?? null), static fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false));
			$phones = array_values(array_filter($this->values($match['TEL'] ?? null), static fn (string $phone): bool => preg_match('/^[0-9+().\/ -]+$/D', $phone) === 1));
			$organization = $this->firstValue($match['ORG'] ?? null);
			$identity = implode('|', [(string)($match['addressbook-key'] ?? ''), (string)($match['id'] ?? ''), $this->firstValue($match['UID'] ?? null), $name, implode(',', $emails), implode(',', $phones)]);
			$key = substr(hash('sha256', $identity), 0, 24);
			$items[$key] = [
				'key' => $key,
				'name' => substr($name, 0, 255),
				'emails' => array_slice(array_values(array_unique($emails)), 0, 10),
				'phones' => array_slice(array_values(array_unique($phones)), 0, 10),
				'organization' => substr($organization, 0, 255),
			];
		}
		return ['enabled' => true, 'items' => array_values($items)];
	}

	/** @return list<array{path:string,name:string,mime:string,size:int,modifiedAt:int,inlineUrl:string,downloadUrl:string,isImage:bool}> */
	public function files(LinkPage $page): array {
		$result = [];
		foreach ($this->decodePaths($page->getFilePaths()) as $index => $path) {
			try {
				$file = $this->resolve($page->getOwnerUid(), $path);
			} catch (NotFoundException) {
				continue;
			}
			$params = ['slug' => $page->getSlug(), 'index' => $index, 'token' => $this->token($page, $index, $path)];
			$result[] = [
				'path' => $path,
				'name' => $file->getName(),
				'mime' => $file->getMimeType(),
				'size' => (int)$file->getSize(),
				'modifiedAt' => $file->getMTime(),
				'inlineUrl' => $this->urls->linkToRouteAbsolute('shortlinks.page_files.show', $params),
				'downloadUrl' => $this->urls->linkToRouteAbsolute('shortlinks.page_files.show', $params + ['download' => 1]),
				'isImage' => str_starts_with(strtolower($file->getMimeType()), 'image/'),
			];
		}
		return $result;
	}

	public function read(LinkPage $page, int $index, string $token): File {
		$paths = $this->decodePaths($page->getFilePaths());
		if (!isset($paths[$index]) || $token === '' || !hash_equals($this->token($page, $index, $paths[$index]), $token)) {
			throw new NotFoundException();
		}
		return $this->resolve($page->getOwnerUid(), $paths[$index]);
	}

	private function token(LinkPage $page, int $index, string $path): string {
		return hash_hmac('sha256', implode('|', [$page->getId(), $page->getOwnerUid(), $page->getSlug(), $page->getEntityVersion(), $index, $path]), $this->settings->visitorSecret());
	}

	private function normalizePath(mixed $value): string {
		$path = '/' . ltrim(str_replace('\\', '/', trim((string)$value)), '/');
		if ($path === '/' || strlen($path) > 4000 || str_contains($path, "\0") || preg_match('#(?:^|/)\.\.?(/|$)#', $path) === 1) {
			throw new ValidationException('Select a valid file from Nextcloud Files', ['filePaths' => 'invalid']);
		}
		return $path;
	}

	private function resolve(string $ownerUid, string $path): File {
		try {
			$node = $this->rootFolder->getUserFolder($ownerUid)->get(ltrim($path, '/'));
			if (!$node instanceof File || !$node->isReadable()) {
				throw new NotFoundException();
			}
			return $node;
		} catch (NotFoundException $e) {
			throw $e;
		} catch (\Throwable) {
			throw new NotFoundException();
		}
	}

	/** @return list<string> */
	private function decodePaths(?string $json): array {
		$value = json_decode($json ?? '[]', true);
		return is_array($value) ? array_values(array_filter(array_map('strval', $value), static fn (string $path): bool => $path !== '')) : [];
	}

	/** @return list<string> */
	private function values(mixed $value): array {
		if (is_scalar($value)) {
			$trimmed = trim((string)$value);
			return $trimmed === '' ? [] : [$trimmed];
		}
		if (!is_array($value)) {
			return [];
		}
		if (array_key_exists('value', $value)) {
			return $this->values($value['value']);
		}
		$result = [];
		foreach ($value as $item) {
			$result = [...$result, ...$this->values($item)];
		}
		return $result;
	}

	private function firstValue(mixed $value): string {
		return $this->values($value)[0] ?? '';
	}
}
