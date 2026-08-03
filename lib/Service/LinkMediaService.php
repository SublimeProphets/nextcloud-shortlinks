<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\IURLGenerator;

final class LinkMediaService {
	private const MAX_BYTES = 50 * 1024 * 1024;

	public function __construct(
		private readonly IRootFolder $rootFolder,
		private readonly IURLGenerator $urls,
		private readonly SettingsService $settings,
	) {
	}

	/** @return array{path:string,mime:string} */
	public function validatePath(string $ownerUid, mixed $value, bool $allowVideo): array {
		$field = $allowVideo ? 'mediaPath' : 'thumbnailPath';
		$path = '/' . ltrim(trim((string)$value), '/');
		if ($path === '/' || strlen($path) > 4000 || str_contains($path, "\0")) {
			throw new ValidationException('Select a valid file from Nextcloud Files', [$field => 'invalid']);
		}
		try {
			$node = $this->rootFolder->getUserFolder($ownerUid)->get(ltrim($path, '/'));
		} catch (\Throwable) {
			throw new ValidationException('The selected media file could not be found', [$field => 'not_found']);
		}
		if (!$node instanceof File || $node->getSize() > self::MAX_BYTES) {
			throw new ValidationException('Select a file no larger than 50 MiB', [$field => 'invalid']);
		}
		$mime = strtolower($node->getMimeType());
		if (!str_starts_with($mime, 'image/') && !($allowVideo && str_starts_with($mime, 'video/'))) {
			throw new ValidationException($allowVideo ? 'Select an image or video' : 'Select an image', [$field => 'invalid_type']);
		}
		return ['path' => $path, 'mime' => substr($mime, 0, 128)];
	}

	public function url(ShortLink $link, string $kind): ?string {
		$path = $kind === 'thumbnail' ? $link->getThumbnailPath() : $link->getMediaPath();
		if ($path === null && !($kind === 'thumbnail' && $link->getThumbnailUrl() !== null)) {
			return null;
		}
		return $this->urls->linkToRouteAbsolute('shortlinks.link_media.show', [
			'id' => $link->getId(),
			'kind' => $kind,
			'token' => $this->token($link, $kind),
		]);
	}

	public function token(ShortLink $link, string $kind): string {
		$path = $kind === 'thumbnail' ? $link->getThumbnailPath() : $link->getMediaPath();
		$source = $path ?? ($kind === 'thumbnail' ? $link->getThumbnailUrl() : null) ?? '';
		return hash_hmac('sha256', $link->getId() . '|' . $link->getOwnerUid() . '|' . $kind . '|' . $source, $this->settings->visitorSecret());
	}

	public function tokenValid(ShortLink $link, string $kind, string $token): bool {
		return $token !== '' && hash_equals($this->token($link, $kind), $token);
	}

	/** @return array{data:string,mime:string,name:string} */
	public function read(ShortLink $link, string $kind): array {
		if (!in_array($kind, ['thumbnail', 'media'], true)) {
			throw new NotFoundException();
		}
		$path = $kind === 'thumbnail' ? $link->getThumbnailPath() : $link->getMediaPath();
		if ($path === null) {
			throw new NotFoundException();
		}
		try {
			$node = $this->rootFolder->getUserFolder($link->getOwnerUid())->get(ltrim($path, '/'));
			if (!$node instanceof File || $node->getSize() > self::MAX_BYTES) {
				throw new NotFoundException();
			}
			$mime = strtolower($node->getMimeType());
			if (!str_starts_with($mime, 'image/') && !($kind === 'media' && str_starts_with($mime, 'video/'))) {
				throw new NotFoundException();
			}
			return ['data' => $node->getContent(), 'mime' => $mime, 'name' => $node->getName()];
		} catch (NotFoundException $e) {
			throw $e;
		} catch (\Throwable) {
			throw new NotFoundException();
		}
	}
}
