<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\Http\Client\IClientService;

final class TitleFetcher {
	private const MAX_REDIRECTS = 3;
	private const MAX_BYTES = 65536;
	private const MAX_IMAGE_BYTES = 2097152;

	public function __construct(
		private readonly IClientService $clients,
		private readonly TargetUrlValidatorInterface $validator,
		private readonly SettingsService $settings,
	) {
	}

	public function fetch(string $url): string {
		return $this->fetchMetadata($url)['title'];
	}

	/** @return array{title:string,imageUrl:?string} */
	public function fetchMetadata(string $url): array {
		if (!$this->settings->bool('title_fetch')) {
			throw new ValidationException('Automatic title fetching is disabled', ['targetUrl' => 'title_fetch_disabled']);
		}
		$document = $this->fetchDocument($url);
		$dom = new \DOMDocument();
		if (@$dom->loadHTML($document['html'], LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING) === false) {
			return ['title' => '', 'imageUrl' => null];
		}
		$xpath = new \DOMXPath($dom);
		$title = $this->firstContent($xpath, [
			'//meta[translate(@property,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="og:title"]/@content',
			'//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="twitter:title"]/@content',
			'//title',
		]);
		$image = $this->firstContent($xpath, [
			'//meta[translate(@property,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="og:image:secure_url"]/@content',
			'//meta[translate(@property,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="og:image"]/@content',
			'//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="twitter:image"]/@content',
			'//link[contains(concat(" ", normalize-space(translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")), " "), " image_src ")]/@href',
		]);
		$imageUrl = $image === '' ? null : $this->resolveLocation($document['url'], html_entity_decode($image, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
		if ($imageUrl !== null) {
			$this->validator->assertSafeForServerRequest($imageUrl);
		}
		$title = trim(html_entity_decode(strip_tags($title), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
		$title = mb_substr(preg_replace('/\s+/u', ' ', $title) ?? $title, 0, 255);
		return ['title' => $title, 'imageUrl' => $imageUrl];
	}

	/** @return array{data:string,mimeType:string} */
	public function fetchImage(string $pageUrl): array {
		$imageUrl = $this->fetchMetadata($pageUrl)['imageUrl'];
		if ($imageUrl === null) {
			throw new ValidationException('No share thumbnail is available', ['targetUrl' => 'no_thumbnail']);
		}
		$client = $this->clients->newClient();
		for ($redirects = 0; $redirects <= self::MAX_REDIRECTS; ++$redirects) {
			$this->validator->assertSafeForServerRequest($imageUrl);
			$response = $client->get($imageUrl, [
				'allow_redirects' => false,
				'http_errors' => false,
				'stream' => true,
				'timeout' => 5,
				'connect_timeout' => 3,
				'headers' => ['Accept' => 'image/avif,image/webp,image/png,image/jpeg,image/gif;q=0.9', 'Range' => 'bytes=0-' . (self::MAX_IMAGE_BYTES - 1)],
			]);
			$status = $response->getStatusCode();
			if (in_array($status, [301, 302, 303, 307, 308], true)) {
				if ($redirects === self::MAX_REDIRECTS) {
					throw new ValidationException('Thumbnail redirect limit exceeded', ['targetUrl' => 'redirect_limit']);
				}
				$location = trim($response->getHeader('Location'));
				if ($location === '') {
					throw new ValidationException('Thumbnail redirect has no location', ['targetUrl' => 'invalid_redirect']);
				}
				$imageUrl = $this->resolveLocation($imageUrl, $location);
				continue;
			}
			if ($status < 200 || $status >= 300) {
				throw new ValidationException('Thumbnail fetch returned an unsuccessful response', ['targetUrl' => 'fetch_failed']);
			}
			$contentType = strtolower(trim(explode(';', $response->getHeader('Content-Type'))[0]));
			if (!in_array($contentType, ['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'], true)) {
				throw new ValidationException('Thumbnail fetch only accepts safe raster images', ['targetUrl' => 'not_image']);
			}
			$body = $response->getBody();
			$data = is_resource($body) ? (string)stream_get_contents($body, self::MAX_IMAGE_BYTES + 1) : substr((string)$body, 0, self::MAX_IMAGE_BYTES + 1);
			if ($data === '' || strlen($data) > self::MAX_IMAGE_BYTES) {
				throw new ValidationException('Thumbnail response is empty or too large', ['targetUrl' => 'too_large']);
			}
			return ['data' => $data, 'mimeType' => $contentType];
		}
		throw new ValidationException('Thumbnail fetch failed', ['targetUrl' => 'fetch_failed']);
	}

	/** @return array{url:string,html:string} */
	private function fetchDocument(string $url): array {
		$client = $this->clients->newClient();
		for ($redirects = 0; $redirects <= self::MAX_REDIRECTS; ++$redirects) {
			$this->validator->assertSafeForServerRequest($url);
			$response = $client->get($url, [
				'allow_redirects' => false,
				'http_errors' => false,
				'stream' => true,
				'timeout' => 5,
				'connect_timeout' => 3,
				'headers' => ['Accept' => 'text/html,application/xhtml+xml;q=0.9', 'Range' => 'bytes=0-' . (self::MAX_BYTES - 1)],
			]);
			$status = $response->getStatusCode();
			if (in_array($status, [301, 302, 303, 307, 308], true)) {
				if ($redirects === self::MAX_REDIRECTS) {
					throw new ValidationException('Title fetch redirect limit exceeded', ['targetUrl' => 'redirect_limit']);
				}
				$location = trim($response->getHeader('Location'));
				if ($location === '') {
					throw new ValidationException('Title fetch redirect has no location', ['targetUrl' => 'invalid_redirect']);
				}
				$url = $this->resolveLocation($url, $location);
				continue;
			}
			if ($status < 200 || $status >= 300) {
				throw new ValidationException('Title fetch returned an unsuccessful response', ['targetUrl' => 'fetch_failed']);
			}
			$contentType = strtolower($response->getHeader('Content-Type'));
			if ($contentType !== '' && !str_starts_with($contentType, 'text/html') && !str_starts_with($contentType, 'application/xhtml+xml')) {
				throw new ValidationException('Title fetch only accepts HTML', ['targetUrl' => 'not_html']);
			}
			$body = $response->getBody();
			$html = is_resource($body) ? (string)stream_get_contents($body, self::MAX_BYTES + 1) : substr((string)$body, 0, self::MAX_BYTES + 1);
			if (strlen($html) > self::MAX_BYTES) {
				throw new ValidationException('Title fetch response is too large', ['targetUrl' => 'too_large']);
			}
			return ['url' => $url, 'html' => $html];
		}
		throw new ValidationException('Title fetch failed', ['targetUrl' => 'fetch_failed']);
	}

	/** @param list<string> $queries */
	private function firstContent(\DOMXPath $xpath, array $queries): string {
		foreach ($queries as $query) {
			$nodes = $xpath->query($query);
			if ($nodes !== false && $nodes->length > 0) {
				$value = trim((string)$nodes->item(0)?->nodeValue);
				if ($value !== '') {
					return $value;
				}
			}
		}
		return '';
	}

	private function resolveLocation(string $base, string $location): string {
		if (preg_match('~^https?://~i', $location) === 1) {
			return $location;
		}
		$parts = parse_url($base);
		if (!is_array($parts) || !isset($parts['scheme'], $parts['host'])) {
			throw new ValidationException('Invalid redirect target', ['targetUrl' => 'invalid_redirect']);
		}
		$origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
		if (str_starts_with($location, '//')) {
			return $parts['scheme'] . ':' . $location;
		}
		if (str_starts_with($location, '/')) {
			return $origin . $location;
		}
		$path = $parts['path'] ?? '/';
		if (str_starts_with($location, '?')) {
			return $origin . $path . $location;
		}
		if (str_starts_with($location, '#')) {
			return $origin . $path . (isset($parts['query']) ? '?' . $parts['query'] : '') . $location;
		}
		$directory = rtrim(str_replace('\\', '/', dirname($path)), '/');
		$combined = ($directory === '' ? '' : $directory) . '/' . $location;
		$segments = [];
		foreach (explode('/', $combined) as $segment) {
			if ($segment === '' || $segment === '.') {
				continue;
			}
			if ($segment === '..') {
				array_pop($segments);
				continue;
			}
			$segments[] = $segment;
		}
		return $origin . '/' . implode('/', $segments);
	}
}
