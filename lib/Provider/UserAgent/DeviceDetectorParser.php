<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\UserAgent;

use DeviceDetector\DeviceDetector;
use DeviceDetector\Parser\Device\AbstractDeviceParser;

final class DeviceDetectorParser implements UserAgentParserInterface {
	public function parse(string $userAgent): array {
		if ($userAgent === '') {
			return ['browser' => 'Unknown', 'browserVersion' => null, 'os' => 'Unknown', 'osVersion' => null, 'deviceType' => 'unknown', 'isBot' => false];
		}
		AbstractDeviceParser::setVersionTruncation(AbstractDeviceParser::VERSION_TRUNCATION_MAJOR);
		$detector = new DeviceDetector(substr($userAgent, 0, 1024));
		$detector->discardBotInformation();
		$detector->parse();
		$client = $detector->getClient();
		$os = $detector->getOs();
		return [
			'browser' => is_array($client) ? (string)($client['name'] ?? 'Unknown') : 'Unknown',
			'browserVersion' => is_array($client) && isset($client['version']) ? explode('.', (string)$client['version'])[0] : null,
			'os' => is_array($os) ? (string)($os['name'] ?? 'Unknown') : 'Unknown',
			'osVersion' => is_array($os) && isset($os['version']) ? explode('.', (string)$os['version'])[0] : null,
			'deviceType' => $detector->isBot() ? 'bot' : ($detector->getDeviceName() ?: 'unknown'),
			'isBot' => $detector->isBot(),
		];
	}
}
