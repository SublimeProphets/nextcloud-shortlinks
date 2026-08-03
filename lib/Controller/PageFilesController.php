<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\LinkPageService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\AppFramework\Http\Response;
use OCP\IRequest;

final class PageFilesController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly LinkPageService $pages,
	) {
		parent::__construct($appName, $request);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	public function show(string $slug, int $index, string $token = '', bool $download = false): Response {
		try {
			$file = $this->pages->publicFile($slug, $index, $token);
			$response = new FileDisplayResponse($file, Http::STATUS_OK, [
				'Content-Type' => $file->getMimeType(),
				'X-Content-Type-Options' => 'nosniff',
				'Cache-Control' => 'private, max-age=3600',
			]);
			if ($download) {
				$response->addHeader('Content-Disposition', 'attachment; filename="' . addcslashes($file->getName(), '"\\') . '"');
			}
			return $response;
		} catch (\Throwable) {
			return new DataDisplayResponse('', Http::STATUS_NOT_FOUND, ['X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'no-store']);
		}
	}
}
