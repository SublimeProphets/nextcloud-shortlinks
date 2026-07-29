<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Capabilities;

use OCA\Shortlinks\Service\SettingsService;
use OCP\Capabilities\ICapability;

final class Capabilities implements ICapability {
	public function __construct(
		private readonly SettingsService $settings,
	) {
	}

	/** @return array{shortlinks:array{version:string,apiVersion:int,enabled:bool,features:list<string>,aliasModes:list<string>,redirectStatuses:list<int>}} */
	public function getCapabilities(): array {
		$features = ['folders', 'tags', 'shares', 'passwords', 'statistics', 'qr', 'import-export', 'bookmarklet'];
		if ($this->settings->bool('public_creation')) {
			$features[] = 'public-creation';
		}
		return ['shortlinks' => ['version' => '1.0.0', 'apiVersion' => 1, 'enabled' => $this->settings->bool('enabled'), 'features' => $features, 'aliasModes' => ['base36', 'base62', 'random'], 'redirectStatuses' => $this->settings->redirectStatuses()]];
	}
}
