<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Service\LinkMediaService;
use OCA\Shortlinks\Service\TitleFetcher;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IRequest;

final class LinkMediaController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly ShortLinkMapper $links,
		private readonly LinkPolicy $policy,
		private readonly LinkMediaService $media,
		private readonly TitleFetcher $titles,
	) {
		parent::__construct($appName, $request);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	public function show(int $id, string $kind, string $token = ''): DataDisplayResponse {
		try {
			$link = $this->links->find($id);
			if (!$this->media->tokenValid($link, $kind, $token)) {
				$this->policy->requireView($link);
			}
			try {
				$file = $this->media->read($link, $kind);
			} catch (NotFoundException $e) {
				if ($kind !== 'thumbnail' || $link->getThumbnailUrl() === null) {
					throw $e;
				}
				$image = $this->titles->fetchImageUrl($link->getThumbnailUrl());
				$file = ['data' => $image['data'], 'mime' => $image['mimeType'], 'name' => 'thumbnail'];
			}
			return new DataDisplayResponse($file['data'], Http::STATUS_OK, [
				'Content-Type' => $file['mime'],
				'Content-Disposition' => 'inline; filename="' . addcslashes($file['name'], '"\\') . '"',
				'X-Content-Type-Options' => 'nosniff',
				'Cache-Control' => 'private, max-age=3600',
			]);
		} catch (\Throwable) {
			return new DataDisplayResponse('', Http::STATUS_NOT_FOUND, ['X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'no-store']);
		}
	}
}
