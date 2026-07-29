<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;

final class StatsSeriesService {
	/**
	 * @param list<array<string,mixed>> $rows
	 * @return list<array{day:string,value:string,clicks:int,uniqueVisitors:int}>
	 */
	public function groupDaily(array $rows, string $granularity): array {
		if (!in_array($granularity, ['day', 'week', 'month'], true)) {
			throw new ValidationException('Statistics granularity must be hour, day, week, or month', ['granularity' => 'invalid']);
		}
		$buckets = [];
		foreach ($rows as $row) {
			$day = (string)($row['day'] ?? '');
			$timestamp = strtotime($day . ' 00:00:00 UTC');
			if ($timestamp === false) {
				continue;
			}
			$key = match ($granularity) {
				'week' => gmdate('o-\\WW', $timestamp),
				'month' => gmdate('Y-m', $timestamp),
				default => gmdate('Y-m-d', $timestamp),
			};
			$buckets[$key] ??= ['day' => $key, 'value' => 'all', 'clicks' => 0, 'uniqueVisitors' => 0];
			$buckets[$key]['clicks'] += (int)($row['clicks'] ?? 0);
			$buckets[$key]['uniqueVisitors'] += (int)($row['uniqueVisitors'] ?? 0);
		}
		ksort($buckets);
		return array_values($buckets);
	}
}
