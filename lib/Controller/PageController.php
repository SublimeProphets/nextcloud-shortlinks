<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Capabilities\Capabilities;
use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IRequest;
use OCP\Util;

final class PageController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly IInitialState $initialState,
		private readonly SettingsService $settings,
		private readonly Capabilities $capabilities,
	) {
		parent::__construct($appName, $request);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function index(): TemplateResponse {
		$this->initialState->provideInitialState('capabilities', $this->capabilities->getCapabilities()['shortlinks']);
		$this->initialState->provideInitialState('settings', ['aliasMode' => $this->settings->string('alias_mode'), 'aliasLength' => $this->settings->int('alias_length'), 'titleFetch' => $this->settings->bool('title_fetch')]);
		Util::addScript('shortlinks', 'shortlinks-main');
		Util::addStyle('shortlinks', 'shortlinks-main');
		return new TemplateResponse('shortlinks', 'index');
	}
}
