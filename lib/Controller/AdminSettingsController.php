<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Exception\ShortlinksException;
use OCA\Shortlinks\Service\SettingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

final class AdminSettingsController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly SettingsService $settings,
	) {
		parent::__construct($appName, $request);
	}
	public function save(): DataResponse {
		try {
			$params = $this->request->getParams();
			unset($params['_route'], $params['requesttoken']);
			$this->settings->save($params);
			return new DataResponse(['data' => $this->settings->publicSettings(), 'error' => null]);
		} catch (ShortlinksException $e) {
			return new DataResponse(['data' => null, 'error' => ['code' => $e->errorCode, 'message' => $e->getMessage()]], $e->getCode());
		} catch (\Throwable) {
			return new DataResponse(['data' => null, 'error' => ['code' => 'internal_error', 'message' => 'Settings could not be saved']], Http::STATUS_INTERNAL_SERVER_ERROR);
		}
	}
}
