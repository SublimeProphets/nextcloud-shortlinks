<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\Geo;

use GeoIp2\Database\Reader;
use OCA\Shortlinks\Service\SettingsService;

final class MaxMindGeoResolver implements GeoResolverInterface {
	public function __construct(
		private readonly SettingsService $settings,
	) {
	}

	public function resolve(string $ipAddress): array {
		$path = $this->settings->string('geoip_path');
		if ($path === '' || !is_readable($path) || filter_var($ipAddress, FILTER_VALIDATE_IP) === false) {
			return ['country' => null, 'region' => null];
		}
		try {
			$reader = new Reader($path);
			$record = $reader->city($ipAddress);
			$region = $record->mostSpecificSubdivision->name;
			$country = $record->country->isoCode;
			$reader->close();
			return ['country' => $country, 'region' => $region];
		} catch (\Throwable) {
			return ['country' => null, 'region' => null];
		}
	}

	public function status(): array {
		$path = $this->settings->string('geoip_path');
		$readable = $path !== '' && is_file($path) && is_readable($path);
		return ['configured' => $path !== '', 'readable' => $readable, 'path' => $path === '' ? null : $path, 'updatedAt' => $readable ? (filemtime($path) ?: null) : null, 'error' => $path !== '' && !$readable ? 'Database is not readable' : null];
	}
}
