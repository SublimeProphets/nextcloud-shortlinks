<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use JsonException;
use OCA\Shortlinks\Enum\AccessMode;
use OCA\Shortlinks\Exception\ConflictException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;

final class ImportExportService {
	public function __construct(
		private readonly LinkService $links,
		private readonly TargetUrlValidatorInterface $urls,
		private readonly FolderService $folders,
		private readonly TagService $tags,
		private readonly SettingsService $settings,
		private readonly UserSettingsService $userSettings,
	) {
	}

	/** @return array{filename:string,mimeType:string,content:string,count:int} */
	public function exportBackup(string $uid): array {
		$linkExport = $this->export('json');
		$linkData = json_decode($linkExport['content'], true, 32, JSON_THROW_ON_ERROR);
		$preferences = array_intersect_key($this->userSettings->get($uid), array_flip([
			'aliasStrategy', 'collisionStrategy', 'suffixLength', 'urlMode', 'baseUrl', 'urlTemplate',
			'urlPattern', 'urlReplacement', 'useThumbnails', 'metadataAutocomplete', 'showQuickStart', 'pageEditorSingleSection', 'pageAutosaveEnabled', 'pageAutosaveDelay',
		]));
		$folderPaths = $this->folderPaths();
		$folders = array_map(static function (array $folder) use ($folderPaths): array {
			return ['path' => $folderPaths[(int)$folder['id']] ?? [(string)$folder['name']], 'icon' => $folder['icon'] ?? 'folder', 'position' => (int)($folder['position'] ?? 0)];
		}, $this->folders->list());
		$tags = array_map(static fn (array $tag): array => ['name' => $tag['name'], 'color' => $tag['color'] ?? null], $this->tags->list());
		$content = json_encode([
			'format' => 'nextcloud-shortlinks-backup',
			'version' => 3,
			'exportedAt' => gmdate(DATE_ATOM),
			'preferences' => $preferences,
			'folders' => $folders,
			'tags' => $tags,
			'links' => $linkData['links'] ?? [],
		], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
		return ['filename' => 'shortlinks-backup.json', 'mimeType' => 'application/json', 'content' => $content, 'count' => (int)$linkExport['count']];
	}

	/** @return array{filename:string,mimeType:string,content:string,count:int} */
	public function export(string $format, array $filters = []): array {
		$items = [];
		for ($page = 1; $page <= 100; ++$page) {
			$result = $this->links->list($filters, $page, 200);
			array_push($items, ...$result['items']);
			if ($result['pagination']['hasMore'] === 0) {
				break;
			}
		}
		$folderPaths = $this->folderPaths();
		foreach ($items as &$item) {
			$item['folderPath'] = $item['folderId'] === null ? [] : ($folderPaths[(int)$item['folderId']] ?? []);
		}
		unset($item);
		if ($format === 'json') {
			return ['filename' => 'shortlinks.json', 'mimeType' => 'application/json', 'content' => json_encode(['version' => 1, 'links' => $items], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), 'count' => count($items)];
		}
		if ($format !== 'csv') {
			throw new ValidationException('Export format must be csv or json', ['format' => 'invalid']);
		}
		$stream = fopen('php://temp', 'w+');
		if ($stream === false) {
			throw new \RuntimeException('Could not create export');
		}
		fputcsv($stream, ['slug', 'target_url', 'title', 'description', 'folder_path_json', 'tags_json', 'active', 'favorite', 'redirect_status', 'access_mode', 'starts_at', 'expires_at', 'click_limit', 'click_count', 'created_at', 'thumbnail_url', 'thumbnail_path', 'media_path', 'color']);
		foreach ($items as $item) {
			$row = [$item['slug'], $item['targetUrl'], $item['title'], $item['description'], json_encode($item['folderPath'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), json_encode(array_column($item['tags'], 'name'), JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), $item['active'] ? '1' : '0', $item['favorite'] ? '1' : '0', $item['redirectStatus'], $item['accessMode'], $item['startsAt'], $item['expiresAt'], $item['clickLimit'], $item['clickCount'], $item['createdAt'], $item['thumbnailUrl'] ?? null, $item['thumbnailPath'] ?? null, $item['mediaPath'] ?? null, $item['color'] ?? null];
			fputcsv($stream, array_map([$this, 'csvSafe'], $row));
		}
		rewind($stream);
		$content = stream_get_contents($stream);
		fclose($stream);
		return ['filename' => 'shortlinks.csv', 'mimeType' => 'text/csv; charset=utf-8', 'content' => $content === false ? '' : $content, 'count' => count($items)];
	}

	/** @return array{dryRun:bool,format:string,total:int,created:int,skipped:int,errors:list<array{row:int,message:string}>} */
	public function import(string $format, string $content, bool $dryRun, string $conflict = 'skip', ?string $uid = null): array {
		if (strlen($content) > 5 * 1024 * 1024) {
			throw new ValidationException('Import exceeds the 5 MiB request limit', ['content' => 'too_large']);
		}
		if (!in_array($conflict, ['skip', 'new-alias'], true)) {
			throw new ValidationException('Invalid conflict strategy', ['conflict' => 'invalid']);
		}
		$format = $format === 'auto' ? $this->detectFormat($content) : $format;
		$backup = $format === 'shortlinks-backup' ? $this->backupData($content) : null;
		$rows = match ($format) {
			'json', 'shortlinks-backup' => $this->jsonRows($content),
			'csv', 'yourls-csv' => $this->csvRows($content),
			'yourls-xml' => $this->yourlsXmlRows($content),
			default => throw new ValidationException('Select a supported Shortlinks or YOURLS import format', ['format' => 'invalid']),
		};
		$result = ['dryRun' => $dryRun, 'format' => $format, 'total' => count($rows), 'created' => 0, 'skipped' => 0, 'errors' => []];
		if (count($rows) > 5000) {
			throw new ValidationException('Synchronous imports are limited to 5000 links', ['content' => 'too_many_rows']);
		}
		$folderCache = $dryRun ? [] : $this->folders->list();
		$tagCache = $dryRun ? [] : $this->tags->list();
		if (!$dryRun && $backup !== null) {
			if ($uid !== null && is_array($backup['preferences'] ?? null)) {
				$this->userSettings->save($uid, (array)$backup['preferences']);
			}
			foreach ((array)($backup['folders'] ?? []) as $folder) {
				if (is_array($folder)) {
					$id = $this->resolveFolderPath($this->stringList($folder['path'] ?? []), $folderCache);
					if ($id !== null) {
						$this->folders->update($id, null, null, false, max(0, (int)($folder['position'] ?? 0)), (string)($folder['icon'] ?? 'folder'));
					}
				}
			}
			foreach ((array)($backup['tags'] ?? []) as $tag) {
				if (is_array($tag) && trim((string)($tag['name'] ?? '')) !== '') {
					$ids = $this->resolveTagNames([trim((string)$tag['name'])], $tagCache);
					if ($ids !== []) {
						$this->tags->update($ids[0], trim((string)$tag['name']), isset($tag['color']) ? (string)$tag['color'] : null);
					}
				}
			}
		}
		foreach ($rows as $index => $row) {
			try {
				$folderPath = $this->folderPathFromRow($row);
				$tagNames = $this->tagNamesFromRow($row);
				$data = [
					'targetUrl' => (string)($row['target_url'] ?? $row['targetUrl'] ?? $row['url'] ?? $row['target'] ?? $row['destination'] ?? ''),
					'slug' => $this->importedSlug($row),
					'title' => (string)($row['title'] ?? ''),
					'description' => ($row['description'] ?? null),
					'active' => !isset($row['active']) || filter_var($row['active'], FILTER_VALIDATE_BOOL),
					'favorite' => isset($row['favorite']) && filter_var($row['favorite'], FILTER_VALIDATE_BOOL),
					'redirectStatus' => (int)($row['redirect_status'] ?? $row['redirectStatus'] ?? 302),
					'accessMode' => (string)($row['access_mode'] ?? $row['accessMode'] ?? 'public'),
					'startsAt' => $this->nullableInt($row['starts_at'] ?? $row['startsAt'] ?? null),
					'expiresAt' => $this->nullableInt($row['expires_at'] ?? $row['expiresAt'] ?? null),
					'clickLimit' => $this->nullableInt($row['click_limit'] ?? $row['clickLimit'] ?? null),
					'initialClickCount' => $this->nonNegativeInt($row['click_count'] ?? $row['clickCount'] ?? $row['clicks'] ?? 0, 'click count'),
					'createdAt' => $this->timestamp($row['created_at'] ?? $row['createdAt'] ?? $row['timestamp'] ?? null),
					'thumbnailUrl' => $row['thumbnail_url'] ?? $row['thumbnailUrl'] ?? null,
					'thumbnailPath' => $row['thumbnail_path'] ?? $row['thumbnailPath'] ?? null,
					'mediaPath' => $row['media_path'] ?? $row['mediaPath'] ?? null,
					'color' => $row['color'] ?? null,
				];
				if ($dryRun) {
					$validationData = $data;
					if ($conflict === 'new-alias' && trim($validationData['slug']) !== '' && !$this->links->isAliasAvailable($validationData['slug'])) {
						$validationData['slug'] = '';
					}
					$this->validateDryRow($validationData, $folderPath, $tagNames);
					++$result['created'];
				} else {
					$data['folderId'] = $this->resolveFolderPath($folderPath, $folderCache);
					$data['tagIds'] = $this->resolveTagNames($tagNames, $tagCache);
					try {
						$this->links->create($data);
					} catch (ConflictException $e) {
						if ($conflict !== 'new-alias' || trim($data['slug']) === '' || !str_contains(strtolower($e->getMessage()), 'alias')) {
							throw $e;
						}
						$data['slug'] = '';
						$this->links->create($data);
					}
					++$result['created'];
				}
			} catch (\Throwable $e) {
				if ($conflict === 'skip' && str_contains(strtolower($e->getMessage()), 'alias')) {
					++$result['skipped'];
				} else {
					$result['errors'][] = ['row' => $index + 2, 'message' => $e->getMessage()];
				}
			}
		}
		return $result;
	}

	private function detectFormat(string $content): string {
		$trimmed = ltrim($content, "\xEF\xBB\xBF\t\r\n ");
		if (str_starts_with($trimmed, '<')) {
			return 'yourls-xml';
		}
		if (str_starts_with($trimmed, '{') || str_starts_with($trimmed, '[')) {
			$data = $this->backupData($content, false);
			return is_array($data) && (($data['format'] ?? '') === 'nextcloud-shortlinks-backup' || isset($data['preferences'], $data['links'])) ? 'shortlinks-backup' : 'json';
		}
		$firstLine = strtolower((string)strtok($trimmed, "\r\n"));
		if (str_contains($firstLine, 'source') && (str_contains($firstLine, 'target') || str_contains($firstLine, 'destination')) && str_contains($firstLine, 'hits')) {
			return 'yourls-csv';
		}
		if (str_contains($firstLine, 'slug') && str_contains($firstLine, 'target_url')) {
			return 'csv';
		}
		throw new ValidationException('The import format could not be detected. Select it manually.', ['format' => 'unknown']);
	}

	/** @return array<string,mixed>|null */
	private function backupData(string $content, bool $throw = true): ?array {
		try {
			$data = json_decode($content, true, 32, JSON_THROW_ON_ERROR);
			return is_array($data) ? $data : null;
		} catch (JsonException) {
			if ($throw) {
				throw new ValidationException('Backup JSON is malformed', ['content' => 'invalid']);
			}
			return null;
		}
	}

	/** @return list<array<string,mixed>> */
	private function yourlsXmlRows(string $content): array {
		$previous = libxml_use_internal_errors(true);
		try {
			$xml = simplexml_load_string($content, \SimpleXMLElement::class, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
		} finally {
			libxml_clear_errors();
			libxml_use_internal_errors($previous);
		}
		if ($xml === false || $xml->getName() !== 'redirection') {
			throw new ValidationException('YOURLS XML is malformed', ['content' => 'invalid']);
		}
		$rows = [];
		foreach ($xml->xpath('//item') ?: [] as $item) {
			$action = $item->action;
			$statistic = $item->statistic;
			$rows[] = [
				'source' => trim((string)$item->source),
				'url' => trim((string)$action),
				'title' => trim((string)$item->title),
				'clicks' => trim((string)($statistic['count'] ?? '0')),
				'timestamp' => trim((string)($statistic['access'] ?? '')),
				'redirect_status' => (int)($action['code'] ?? 302),
			];
		}
		return $rows;
	}

	/** @param array<string,mixed> $row */
	private function importedSlug(array $row): string {
		$slug = trim((string)($row['slug'] ?? $row['keyword'] ?? ''));
		if ($slug !== '') {
			return $slug;
		}
		$source = trim((string)($row['source'] ?? ''));
		$path = parse_url($source, PHP_URL_PATH);
		return trim($path === false || $path === null ? $source : $path, '/');
	}

	/** @return list<string> */
	private function stringList(mixed $value): array {
		return is_array($value) ? array_values(array_filter(array_map(static fn (mixed $item): string => trim((string)$item), $value))) : [];
	}

	private function csvSafe(mixed $value): string {
		$text = $value === null ? '' : (string)$value;
		return preg_match('/^[=+\-@\t\r]/', $text) === 1 ? "'" . $text : $text;
	}

	/** @return list<array<string,mixed>> */
	private function jsonRows(string $content): array {
		try {
			$data = json_decode($content, true, 32, JSON_THROW_ON_ERROR);
		} catch (JsonException) {
			throw new ValidationException('JSON import is malformed', ['content' => 'invalid']);
		}
		$rows = is_array($data) && isset($data['links']) ? $data['links'] : $data;
		if (!is_array($rows)) {
			throw new ValidationException('JSON import must contain an array of links', ['content' => 'invalid']);
		}
		return array_values(array_filter($rows, 'is_array'));
	}

	/** @return list<array<string,mixed>> */
	private function csvRows(string $content): array {
		$stream = fopen('php://temp', 'w+');
		if ($stream === false) {
			throw new ValidationException('Could not read CSV');
		} fwrite($stream, $content);
		rewind($stream);
		$headers = fgetcsv($stream);
		if (!is_array($headers)) {
			throw new ValidationException('CSV header is missing', ['content' => 'invalid']);
		} $headers = array_map(static fn (string $h): string => strtolower(trim($h)), $headers);
		$rows = [];
		while (($values = fgetcsv($stream)) !== false) {
			if (count($values) !== count($headers)) {
				continue;
			} $rows[] = array_combine($headers, $values) ?: [];
		} fclose($stream);
		return $rows;
	}

	/** @param array<string,mixed> $data */
	private function validateDryRow(array $data, array $folderPath, array $tagNames): void {
		$this->urls->validate((string)$data['targetUrl']);
		$slug = trim((string)$data['slug']);
		if ($slug !== '' && !$this->links->isAliasAvailable($slug)) {
			throw new ValidationException('Alias is already in use', ['slug' => 'conflict']);
		}
		if (!$this->settings->isRedirectStatusAllowed((int)$data['redirectStatus'])) {
			throw new ValidationException('Invalid redirect status', ['redirectStatus' => 'invalid']);
		}
		if (AccessMode::tryFrom((string)$data['accessMode']) === null || $data['accessMode'] === AccessMode::Password->value) {
			throw new ValidationException('Imported access mode is invalid or requires an interactive password', ['accessMode' => 'invalid']);
		}
		if ($data['startsAt'] !== null && $data['expiresAt'] !== null && $data['startsAt'] >= $data['expiresAt']) {
			throw new ValidationException('Start time must precede expiry', ['expiresAt' => 'invalid']);
		}
		if ($data['clickLimit'] !== null && $data['clickLimit'] < 1) {
			throw new ValidationException('Click limit must be positive', ['clickLimit' => 'invalid']);
		}
		foreach ($folderPath as $name) {
			if ($name === '' || mb_strlen($name) > 128 || preg_match('/[\x00-\x1f\x7f]/u', $name) === 1) {
				throw new ValidationException('Imported folder name is invalid', ['content' => 'invalid']);
			}
		}
		foreach ($tagNames as $name) {
			if ($name === '' || mb_strlen($name) > 64 || preg_match('/[\x00-\x1f\x7f]/u', $name) === 1) {
				throw new ValidationException('Imported tag name is invalid', ['content' => 'invalid']);
			}
		}
	}

	private function nullableInt(mixed $value): ?int {
		return $value === null || $value === '' ? null : (int)$value;
	}

	private function nonNegativeInt(mixed $value, string $field): int {
		if ((!is_int($value) && !is_string($value)) || preg_match('/^\d+$/D', (string)$value) !== 1) {
			throw new ValidationException('Imported ' . $field . ' is invalid', ['content' => 'invalid']);
		}
		return min((int)$value, PHP_INT_MAX);
	}

	private function timestamp(mixed $value): ?int {
		if ($value === null || $value === '') {
			return null;
		}
		if ((is_int($value) || is_string($value)) && preg_match('/^\d+$/D', (string)$value) === 1) {
			return (int)$value;
		}
		if (!is_string($value) || ($timestamp = strtotime($value . ' UTC')) === false) {
			throw new ValidationException('Imported creation time is invalid', ['content' => 'invalid']);
		}
		return $timestamp;
	}

	/** @return array<int,list<string>> */
	private function folderPaths(): array {
		$folders = $this->folders->list();
		$byId = [];
		foreach ($folders as $folder) {
			$byId[(int)$folder['id']] = $folder;
		}
		$paths = [];
		foreach (array_keys($byId) as $id) {
			$path = [];
			$current = $id;
			$visited = [];
			$depth = 0;
			while (isset($byId[$current]) && !isset($visited[$current]) && $depth < 10) {
				$visited[$current] = true;
				array_unshift($path, (string)$byId[$current]['name']);
				$current = (int)($byId[$current]['parentId'] ?? 0);
				++$depth;
			}
			$paths[$id] = $path;
		}
		return $paths;
	}

	/** @param array<string,mixed> $row @return list<string> */
	private function folderPathFromRow(array $row): array {
		$value = $row['folder_path_json'] ?? $row['folderPath'] ?? [];
		if (is_string($value)) {
			try {
				$value = json_decode($value, true, 16, JSON_THROW_ON_ERROR);
			} catch (JsonException) {
				throw new ValidationException('Folder path is malformed', ['content' => 'invalid']);
			}
		}
		if (!is_array($value)) {
			throw new ValidationException('Folder path must be an array', ['content' => 'invalid']);
		}
		return array_values(array_map(static fn (mixed $name): string => trim((string)$name), array_slice($value, 0, 10)));
	}

	/** @param array<string,mixed> $row @return list<string> */
	private function tagNamesFromRow(array $row): array {
		$value = $row['tags_json'] ?? $row['tags'] ?? [];
		if (is_string($value)) {
			try {
				$decoded = json_decode($value, true, 16, JSON_THROW_ON_ERROR);
				$value = is_array($decoded) ? $decoded : [];
			} catch (JsonException) {
				$value = array_filter(array_map('trim', explode('|', $value)));
			}
		}
		if (!is_array($value)) {
			throw new ValidationException('Tags must be an array', ['content' => 'invalid']);
		}
		$names = [];
		foreach (array_slice($value, 0, 50) as $tag) {
			$name = trim((string)(is_array($tag) ? ($tag['name'] ?? '') : $tag));
			if ($name !== '') {
				$names[mb_strtolower($name)] = $name;
			}
		}
		return array_values($names);
	}

	/** @param list<string> $path @param list<array<string,mixed>> $cache */
	private function resolveFolderPath(array $path, array &$cache): ?int {
		$parentId = null;
		foreach ($path as $name) {
			$match = null;
			foreach ($cache as $folder) {
				if (($folder['parentId'] ?? null) === $parentId && mb_strtolower((string)$folder['name']) === mb_strtolower($name)) {
					$match = (int)$folder['id'];
					break;
				}
			}
			if ($match === null) {
				$created = $this->folders->create($name, $parentId);
				$cache[] = $created;
				$match = (int)$created['id'];
			}
			$parentId = $match;
		}
		return $parentId;
	}

	/** @param list<string> $names @param list<array<string,mixed>> $cache @return list<int> */
	private function resolveTagNames(array $names, array &$cache): array {
		$ids = [];
		foreach ($names as $name) {
			$id = null;
			foreach ($cache as $tag) {
				if (mb_strtolower((string)$tag['name']) === mb_strtolower($name)) {
					$id = (int)$tag['id'];
					break;
				}
			}
			if ($id === null) {
				$created = $this->tags->create($name, null);
				$cache[] = $created;
				$id = (int)$created['id'];
			}
			$ids[] = $id;
		}
		return $ids;
	}
}
