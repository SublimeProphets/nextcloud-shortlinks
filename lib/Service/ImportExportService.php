<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use JsonException;
use OCA\Shortlinks\Enum\AccessMode;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;

final class ImportExportService {
	public function __construct(
		private readonly LinkService $links,
		private readonly TargetUrlValidatorInterface $urls,
	) {
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
		fputcsv($stream, ['slug', 'target_url', 'title', 'description', 'folder_id', 'tags', 'active', 'favorite', 'redirect_status', 'access_mode', 'starts_at', 'expires_at', 'click_limit', 'click_count', 'created_at']);
		foreach ($items as $item) {
			$row = [$item['slug'], $item['targetUrl'], $item['title'], $item['description'], $item['folderId'], implode('|', array_column($item['tags'], 'name')), $item['active'] ? '1' : '0', $item['favorite'] ? '1' : '0', $item['redirectStatus'], $item['accessMode'], $item['startsAt'], $item['expiresAt'], $item['clickLimit'], $item['clickCount'], $item['createdAt']];
			fputcsv($stream, array_map([$this, 'csvSafe'], $row));
		}
		rewind($stream);
		$content = stream_get_contents($stream);
		fclose($stream);
		return ['filename' => 'shortlinks.csv', 'mimeType' => 'text/csv; charset=utf-8', 'content' => $content === false ? '' : $content, 'count' => count($items)];
	}

	/** @return array{dryRun:bool,total:int,created:int,skipped:int,errors:list<array{row:int,message:string}>} */
	public function import(string $format, string $content, bool $dryRun, string $conflict = 'skip'): array {
		if (strlen($content) > 5 * 1024 * 1024) {
			throw new ValidationException('Import exceeds the 5 MiB request limit', ['content' => 'too_large']);
		}
		if (!in_array($conflict, ['skip', 'new-alias'], true)) {
			throw new ValidationException('Invalid conflict strategy', ['conflict' => 'invalid']);
		}
		$rows = $format === 'json' ? $this->jsonRows($content) : ($format === 'csv' ? $this->csvRows($content) : throw new ValidationException('Import format must be csv or json', ['format' => 'invalid']));
		$result = ['dryRun' => $dryRun, 'total' => count($rows), 'created' => 0, 'skipped' => 0, 'errors' => []];
		if (count($rows) > 5000) {
			throw new ValidationException('Synchronous imports are limited to 5000 links', ['content' => 'too_many_rows']);
		}
		foreach ($rows as $index => $row) {
			try {
				$data = ['targetUrl' => (string)($row['target_url'] ?? $row['targetUrl'] ?? $row['url'] ?? ''), 'slug' => $conflict === 'new-alias' ? '' : (string)($row['slug'] ?? $row['keyword'] ?? ''), 'title' => (string)($row['title'] ?? ''), 'description' => ($row['description'] ?? null), 'active' => !isset($row['active']) || filter_var($row['active'], FILTER_VALIDATE_BOOL), 'favorite' => isset($row['favorite']) && filter_var($row['favorite'], FILTER_VALIDATE_BOOL), 'redirectStatus' => (int)($row['redirect_status'] ?? $row['redirectStatus'] ?? 302), 'accessMode' => (string)($row['access_mode'] ?? $row['accessMode'] ?? 'public')];
				if ($dryRun) {
					$this->validateDryRow($data);
					++$result['created'];
				} else {
					$this->links->create($data);
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
	private function validateDryRow(array $data): void {
		$this->urls->validate((string)$data['targetUrl']);
		$slug = trim((string)$data['slug']);
		if ($slug !== '' && !$this->links->isAliasAvailable($slug)) {
			throw new ValidationException('Alias is already in use', ['slug' => 'conflict']);
		}
		if (!in_array((int)$data['redirectStatus'], [301, 302, 307, 308], true)) {
			throw new ValidationException('Invalid redirect status', ['redirectStatus' => 'invalid']);
		}
		if (AccessMode::tryFrom((string)$data['accessMode']) === null || $data['accessMode'] === AccessMode::Password->value) {
			throw new ValidationException('Imported access mode is invalid or requires an interactive password', ['accessMode' => 'invalid']);
		}
	}
}
