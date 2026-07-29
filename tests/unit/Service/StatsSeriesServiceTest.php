<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\StatsSeriesService;
use PHPUnit\Framework\TestCase;

final class StatsSeriesServiceTest extends TestCase {
	public function testGroupsDailyRowsByIsoWeek(): void {
		$rows = [
			['day' => '2026-07-27', 'clicks' => 2, 'uniqueVisitors' => 1],
			['day' => '2026-07-28', 'clicks' => 3, 'uniqueVisitors' => 2],
			['day' => '2026-08-03', 'clicks' => 5, 'uniqueVisitors' => 4],
		];
		self::assertSame([
			['day' => '2026-W31', 'value' => 'all', 'clicks' => 5, 'uniqueVisitors' => 3],
			['day' => '2026-W32', 'value' => 'all', 'clicks' => 5, 'uniqueVisitors' => 4],
		], (new StatsSeriesService())->groupDaily($rows, 'week'));
	}

	public function testRejectsUnknownGranularity(): void {
		$this->expectException(ValidationException::class);
		(new StatsSeriesService())->groupDaily([], 'year');
	}
}
