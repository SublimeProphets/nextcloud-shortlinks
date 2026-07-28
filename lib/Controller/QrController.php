<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\LinkService;
use OCA\Shortlinks\Service\QrCodeService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataDownloadResponse;
use OCP\IRequest;

final class QrController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly LinkService $links,
		private readonly QrCodeService $qr,
	) {
		parent::__construct($appName, $request);
	}
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function show(int $id, string $format = 'svg'): DataDownloadResponse {
		$link = $this->links->get($id);
		$result = $this->qr->render((string)$link['shortUrl'], $format);
		return new DataDownloadResponse($result['data'], 'shortlink-' . $link['slug'] . '.' . $result['extension'], $result['mimeType'], headers: ['X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, max-age=300']);
	}
}
