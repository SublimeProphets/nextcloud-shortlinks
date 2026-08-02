<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\LinkService;
use OCA\Shortlinks\Service\TitleFetcher;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IRequest;

final class ThumbnailController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly LinkService $links,
		private readonly TitleFetcher $titles,
	) {
		parent::__construct($appName, $request);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	#[UserRateLimit(limit: 120, period: 60)]
	public function show(int $id): DataDisplayResponse {
		$link = $this->links->get($id);
		return $this->image((string)$link['targetUrl']);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	#[UserRateLimit(limit: 30, period: 60)]
	public function preview(string $url): DataDisplayResponse {
		return $this->image($url);
	}

	private function image(string $url): DataDisplayResponse {
		try {
			$image = $this->titles->fetchImage($url);
			return new DataDisplayResponse($image['data'], Http::STATUS_OK, [
				'Content-Type' => $image['mimeType'],
				'X-Content-Type-Options' => 'nosniff',
				'Cache-Control' => 'private, max-age=900',
			]);
		} catch (\Throwable) {
			return new DataDisplayResponse('', Http::STATUS_NOT_FOUND, [
				'X-Content-Type-Options' => 'nosniff',
				'Cache-Control' => 'private, max-age=60',
			]);
		}
	}
}
