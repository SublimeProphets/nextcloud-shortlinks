<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLink;

final class LinkRankingService {
	/**
	 * @param list<ShortLink> $links
	 * @param array<int,array{last24:int,last7:int,previous7:int,last30:int}> $signals
	 * @return list<ShortLink>
	 */
	public function rank(array $links, array $signals, string $mode, int $now): array {
		$scores = [];
		foreach ($links as $link) {
			$signal = $signals[$link->getId()] ?? ['last24' => 0, 'last7' => 0, 'previous7' => 0, 'last30' => 0];
			$scores[$link->getId()] = $mode === 'top'
				? $this->topScore($link, $signal)
				: $this->trendingScore($link, $signal, $now);
		}

		usort($links, static function (ShortLink $left, ShortLink $right) use ($scores): int {
			$byScore = ($scores[$right->getId()] ?? 0.0) <=> ($scores[$left->getId()] ?? 0.0);
			if ($byScore !== 0) {
				return $byScore;
			}
			$byClicks = $right->getClickCount() <=> $left->getClickCount();
			return $byClicks !== 0 ? $byClicks : $right->getCreatedAt() <=> $left->getCreatedAt();
		});
		return $links;
	}

	/** @param array{last24:int,last7:int,previous7:int,last30:int} $signal */
	private function topScore(ShortLink $link, array $signal): float {
		// Lifetime clicks are only a deterministic fallback when retained events are unavailable.
		return $signal['last30'] > 0 ? (float)$signal['last30'] : min(0.99, log(1 + $link->getClickCount()) / 100);
	}

	/** @param array{last24:int,last7:int,previous7:int,last30:int} $signal */
	private function trendingScore(ShortLink $link, array $signal, int $now): float {
		$olderWeek = max(0, $signal['last7'] - $signal['last24']);
		$olderMonth = max(0, $signal['last30'] - $signal['last7']);
		$weightedActivity = $signal['last24'] * 8.0 + $olderWeek * 3.0 + $olderMonth;
		$velocity = ($signal['last7'] + 1) / ($signal['previous7'] + 1);
		$acceleration = 1 + min(2.5, max(0.0, $velocity - 1) * 0.45);

		$lastActivity = $link->getLastClickedAt() ?? $link->getCreatedAt();
		$ageDays = max(0.0, ($now - $lastActivity) / 86400);
		$recencyFallback = log(1 + $link->getClickCount()) * exp(-$ageDays / 14);
		$newLinkDiscovery = max(0.0, 1 - max(0, $now - $link->getCreatedAt()) / (7 * 86400)) * min(2, $signal['last7']);

		return $weightedActivity * $acceleration + $recencyFallback * 0.35 + $newLinkDiscovery;
	}
}
