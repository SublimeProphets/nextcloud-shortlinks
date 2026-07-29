<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Service\LinkRankingService;
use PHPUnit\Framework\TestCase;

final class LinkRankingServiceTest extends TestCase {
	public function testTrendingRewardsRecentAcceleration(): void {
		$steady = $this->link(1, 100, 900, 950);
		$accelerating = $this->link(2, 20, 990, 995);
		$signals = [
			1 => ['last24' => 1, 'last7' => 8, 'previous7' => 8, 'last30' => 30],
			2 => ['last24' => 6, 'last7' => 9, 'previous7' => 1, 'last30' => 10],
		];

		$ranked = (new LinkRankingService())->rank([$steady, $accelerating], $signals, 'trending', 1000);
		self::assertSame(2, $ranked[0]->getId());
	}

	public function testTopUsesClicksFromLastThirtyDays(): void {
		$lifetimeLeader = $this->link(1, 1000, 900, 950);
		$periodLeader = $this->link(2, 10, 900, 950);
		$signals = [
			1 => ['last24' => 0, 'last7' => 0, 'previous7' => 0, 'last30' => 2],
			2 => ['last24' => 2, 'last7' => 6, 'previous7' => 3, 'last30' => 12],
		];

		$ranked = (new LinkRankingService())->rank([$lifetimeLeader, $periodLeader], $signals, 'top', 1000);
		self::assertSame(2, $ranked[0]->getId());
	}

	private function link(int $id, int $clicks, int $createdAt, int $lastClickedAt): ShortLink {
		$link = new ShortLink();
		$link->setId($id);
		$link->setClickCount($clicks);
		$link->setCreatedAt($createdAt);
		$link->setLastClickedAt($lastClickedAt);
		return $link;
	}
}
