<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\AppFramework\Utility\ITimeFactory;
use Psr\Log\LoggerInterface;

final class ThumbnailService {
	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly TitleFetcher $titles,
		private readonly TargetUrlValidatorInterface $urlValidator,
		private readonly SettingsService $settings,
		private readonly ITimeFactory $time,
		private readonly LoggerInterface $logger,
	) {
	}

	/** Store metadata returned by the protected preview endpoint. */
	public function storeDiscovered(ShortLink $link, ?string $thumbnailUrl): bool {
		if ($thumbnailUrl !== null) {
			$thumbnailUrl = trim($thumbnailUrl);
			if ($thumbnailUrl === '') {
				$thumbnailUrl = null;
			} else {
				$this->urlValidator->assertSafeForServerRequest($thumbnailUrl);
			}
		}
		return $this->persist($link, $thumbnailUrl, $this->time->getTime());
	}

	/** Re-read one target page and persist its current share image. */
	public function refresh(ShortLink $link): ?bool {
		if (!$this->settings->bool('title_fetch')) {
			return null;
		}
		$refreshedAt = $this->time->getTime();
		try {
			$metadata = $this->titles->fetchMetadata($link->getTargetUrl());
			return $this->persist($link, $metadata['imageUrl'], $refreshedAt);
		} catch (\Throwable $e) {
			// A temporary upstream failure must not remove a previously working image.
			$this->persist($link, $link->getThumbnailUrl(), $refreshedAt);
			$this->logger->debug('Could not refresh a Shortlinks share thumbnail', [
				'app' => 'shortlinks',
				'linkId' => $link->getId(),
				'exception' => $e,
			]);
			return null;
		}
	}

	/** @return array{processed:int,found:int,failed:int,nextAfterId:int,hasMore:bool,stats:array{total:int,found:int,refreshed:int,lastRefresh:?int}} */
	public function refreshBatch(int $afterId, int $limit, bool $onlyMissing): array {
		$limit = max(1, min(10, $limit));
		$entities = $this->links->findThumbnailBatch(max(0, $afterId), $limit + 1, $onlyMissing);
		$hasMore = count($entities) > $limit;
		$entities = array_slice($entities, 0, $limit);
		$found = 0;
		$failed = 0;
		$nextAfterId = $afterId;
		foreach ($entities as $link) {
			$nextAfterId = max($nextAfterId, (int)$link->getId());
			$result = $this->refresh($link);
			if ($result === true) {
				++$found;
			} elseif ($result === null) {
				++$failed;
			}
		}
		return [
			'processed' => count($entities),
			'found' => $found,
			'failed' => $failed,
			'nextAfterId' => $nextAfterId,
			'hasMore' => $hasMore,
			'stats' => $this->stats(),
		];
	}

	/** @return array{total:int,found:int,refreshed:int,lastRefresh:?int} */
	public function stats(): array {
		return $this->links->thumbnailStats();
	}

	private function persist(ShortLink $link, ?string $thumbnailUrl, int $refreshedAt): bool {
		try {
			$this->links->updateThumbnail((int)$link->getId(), $thumbnailUrl, $refreshedAt);
			$link->setThumbnailUrl($thumbnailUrl);
			$link->setThumbnailRefreshedAt($refreshedAt);
			return $thumbnailUrl !== null;
		} catch (\Throwable $e) {
			$this->logger->error('Could not persist a Shortlinks share thumbnail', [
				'app' => 'shortlinks',
				'linkId' => $link->getId(),
				'exception' => $e,
			]);
			return false;
		}
	}
}
