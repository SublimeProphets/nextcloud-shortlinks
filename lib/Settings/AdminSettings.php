<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Settings;

use OCA\Shortlinks\Provider\Geo\GeoResolverInterface;
use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Settings\ISettings;
use OCP\Util;

final class AdminSettings implements ISettings {
	public function __construct(
		private readonly IInitialState $initialState,
		private readonly SettingsService $settings,
		private readonly GeoResolverInterface $geo,
	) {
	}
	public function getForm(): TemplateResponse {
		$this->initialState->provideInitialState('admin-settings', $this->settings->publicSettings());
		$this->initialState->provideInitialState('geo-status', $this->geo->status());
		Util::addScript('shortlinks', 'shortlinks-admin');
		Util::addStyle('shortlinks', 'shortlinks-admin');
		return new TemplateResponse('shortlinks', 'admin');
	}
	public function getSection(): string {
		return 'shortlinks';
	}
	public function getPriority(): int {
		return 10;
	}
}
