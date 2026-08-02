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

	/** @param list<int> $ids */
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function bulk(array $ids = []): DataDownloadResponse {
		if (!class_exists(\ZipArchive::class)) {
			throw new \RuntimeException('The ZIP extension is required for bulk QR downloads');
		}
		$ids = array_slice(array_unique(array_filter(array_map('intval', $ids), static fn (int $id): bool => $id > 0)), 0, 200);
		if ($ids === []) {
			throw new \InvalidArgumentException('Select at least one link');
		}
		$temporary = tempnam(sys_get_temp_dir(), 'shortlinks-qr-');
		if ($temporary === false) {
			throw new \RuntimeException('Could not create the QR archive');
		}
		$zip = new \ZipArchive();
		try {
			if ($zip->open($temporary, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
				throw new \RuntimeException('Could not open the QR archive');
			}
			foreach ($ids as $id) {
				$link = $this->links->get($id);
				$rendered = $this->qr->render((string)$link['shortUrl'], 'svg');
				$filename = preg_replace('/[^A-Za-z0-9_-]+/', '-', (string)$link['slug']) ?: (string)$id;
				$zip->addFromString($filename . '.svg', $rendered['data']);
			}
			$zip->close();
			$data = file_get_contents($temporary);
			if ($data === false) {
				throw new \RuntimeException('Could not read the QR archive');
			}
			return new DataDownloadResponse($data, 'shortlinks-qr-codes.zip', 'application/zip', headers: ['X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, no-store']);
		} finally {
			if (is_file($temporary)) {
				unlink($temporary);
			}
		}
	}
}
