<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

final class VisitorHasher {
	public function __construct(
		private readonly SettingsService $settings,
	) {
	}

	public function hash(int $linkId, int $timestamp, string $ipAddress, string $userAgent): string {
		$scope = gmdate('Y-m-d', $timestamp) . ':' . $linkId;
		$key = hash_hmac('sha256', $scope, $this->settings->visitorSecret(), true);
		return hash_hmac('sha256', $ipAddress . "\0" . substr($userAgent, 0, 256), $key);
	}
}
