<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Capabilities\Capabilities;
use OCA\Shortlinks\Service\LinkUrlService;
use OCA\Shortlinks\Service\SettingsService;
use OCA\Shortlinks\Service\UserSettingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\Util;

final class PageController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly IInitialState $initialState,
		private readonly SettingsService $settings,
		private readonly Capabilities $capabilities,
		private readonly LinkUrlService $linkUrls,
		private readonly IUserSession $userSession,
		private readonly UserSettingsService $userSettings,
	) {
		parent::__construct($appName, $request);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function index(): TemplateResponse {
		$this->initialState->provideInitialState('capabilities', $this->capabilities->getCapabilities()['shortlinks']);
		$uid = $this->userSession->getUser()?->getUID();
		$personal = $uid === null ? [] : $this->userSettings->get($uid);
		$this->initialState->provideInitialState('settings', [
			'aliasMode' => $this->settings->string('alias_mode'),
			'aliasLength' => $this->settings->int('alias_length'),
			'allowedSchemes' => $this->settings->allowedSchemes(),
			'shortUrlTemplate' => $uid === null ? null : $this->linkUrls->templateFor($uid),
			'titleFetch' => $uid !== null && $this->userSettings->allowsMetadataAutocomplete($uid),
			'useThumbnails' => (bool)($personal['useThumbnails'] ?? true),
			'showQuickStart' => (bool)($personal['showQuickStart'] ?? true),
			'pageEditorSingleSection' => (bool)($personal['pageEditorSingleSection'] ?? true),
			'pageAutosaveEnabled' => (bool)($personal['pageAutosaveEnabled'] ?? true),
			'pageAutosaveDelay' => (int)($personal['pageAutosaveDelay'] ?? 10),
		]);
		Util::addScript('shortlinks', 'shortlinks-main');
		Util::addStyle('shortlinks', 'shortlinks-main');
		return new TemplateResponse('shortlinks', 'index');
	}
}
