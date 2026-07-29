<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Service\AliasSuggestionService;
use OCA\Shortlinks\Service\LinkUrlService;
use OCA\Shortlinks\Service\UserSettingsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\OpenAPI;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

#[OpenAPI(tags: ['user_settings'])]
final class UserSettingsApiController extends AbstractApiOCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly UserSettingsService $settings,
		private readonly AliasSuggestionService $aliases,
		private readonly LinkUrlService $linkUrls,
		private readonly LinkPolicy $policy,
	) {
		parent::__construct($appName, $request, $logger);
	}

	/**
	 * Return personal alias and public URL preferences
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: User settings and preview
	 */
	#[NoAdminRequired]
	public function index(): DataResponse {
		return $this->respond(fn (): array => $this->response($this->policy->currentUid()));
	}

	/**
	 * Update personal alias and public URL preferences
	 *
	 * @return DataResponse<Http::STATUS_OK, array<string, mixed>, array{}>
	 *
	 * 200: Updated user settings and preview
	 */
	#[NoAdminRequired]
	public function update(): DataResponse {
		return $this->respond(function (): array {
			$uid = $this->policy->currentUid();
			$this->settings->save($uid, $this->payload(['aliasStrategy', 'collisionStrategy', 'suffixLength', 'urlMode', 'baseUrl', 'urlTemplate', 'urlPattern', 'urlReplacement']));
			return $this->response($uid);
		});
	}

	/** @return array<string, mixed> */
	private function response(string $uid): array {
		$settings = $this->settings->get($uid);
		$alias = $this->aliases->preview($uid, 'Summer campaign', 'https://example.com/campaign');
		$settings['previewAlias'] = $alias;
		$settings['shortUrlTemplate'] = $this->linkUrls->templateFor($uid);
		$settings['previewUrl'] = $this->linkUrls->forSlug($alias, $uid);
		return $settings;
	}
}
