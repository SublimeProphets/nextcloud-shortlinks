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
		$imageUrl = isset($link['thumbnailUrl']) ? (string)$link['thumbnailUrl'] : '';
		return $this->imageUrl($imageUrl);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	#[UserRateLimit(limit: 30, period: 60)]
	public function preview(string $url, string $imageUrl = ''): DataDisplayResponse {
		if ($imageUrl !== '') {
			return $this->imageUrl($imageUrl);
		}
		try {
			return $this->response($this->titles->fetchImage($url));
		} catch (\Throwable) {
			return $this->notFound();
		}
	}

	private function imageUrl(string $imageUrl): DataDisplayResponse {
		try {
			if ($imageUrl === '') {
				return $this->notFound();
			}
			return $this->response($this->titles->fetchImageUrl($imageUrl));
		} catch (\Throwable) {
			return $this->notFound();
		}
	}

	/** @param array{data:string,mimeType:string} $image */
	private function response(array $image): DataDisplayResponse {
		return new DataDisplayResponse($image['data'], Http::STATUS_OK, [
			'Content-Type' => $image['mimeType'],
			'X-Content-Type-Options' => 'nosniff',
			'Cache-Control' => 'private, max-age=3600',
		]);
	}

	private function notFound(): DataDisplayResponse {
		return new DataDisplayResponse('', Http::STATUS_NOT_FOUND, [
			'X-Content-Type-Options' => 'nosniff',
			'Cache-Control' => 'private, max-age=60',
		]);
	}
}
