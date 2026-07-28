<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\SvgWriter;

final class QrCodeService {
	/** @return array{data:string,mimeType:string,extension:string} */
	public function render(string $url, string $format): array {
		$qr = new QrCode(data: $url, errorCorrectionLevel: ErrorCorrectionLevel::Medium, size: 512, margin: 16);
		if ($format === 'png' && extension_loaded('gd')) {
			return ['data' => (new PngWriter())->write($qr)->getString(), 'mimeType' => 'image/png', 'extension' => 'png'];
		}
		return ['data' => (new SvgWriter())->write($qr)->getString(), 'mimeType' => 'image/svg+xml', 'extension' => 'svg'];
	}
}
