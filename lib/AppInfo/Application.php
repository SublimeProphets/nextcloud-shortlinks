<?php

declare(strict_types=1);

namespace OCA\Shortlinks\AppInfo;

use OCA\Shortlinks\Capabilities\Capabilities;
use OCA\Shortlinks\Provider\Alias\AliasGeneratorInterface;
use OCA\Shortlinks\Provider\Alias\ConfigurableAliasGenerator;
use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use OCA\Shortlinks\Provider\Geo\MaxMindGeoResolver;
use OCA\Shortlinks\Provider\UserAgent\DeviceDetectorParser;
use OCA\Shortlinks\Provider\UserAgent\UserAgentParserInterface;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCA\Shortlinks\Validator\UrlValidator;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

final class Application extends App implements IBootstrap {
	public const APP_ID = 'shortlinks';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}

	public function register(IRegistrationContext $context): void {
		include_once __DIR__ . '/../../vendor/autoload.php';

		$context->registerServiceAlias(AliasGeneratorInterface::class, ConfigurableAliasGenerator::class);
		$context->registerServiceAlias(UserAgentParserInterface::class, DeviceDetectorParser::class);
		$context->registerServiceAlias(GeoResolverInterface::class, MaxMindGeoResolver::class);
		$context->registerServiceAlias(TargetUrlValidatorInterface::class, UrlValidator::class);
		$context->registerCapability(Capabilities::class);
	}

	public function boot(IBootContext $context): void {
	}
}
