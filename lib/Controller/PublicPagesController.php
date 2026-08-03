<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Exception\LinkUnavailableException;
use OCA\Shortlinks\Exception\PasswordRequiredException;
use OCA\Shortlinks\Service\LinkPageService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\AnonRateLimit;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\IRequest;

final class PublicPagesController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly LinkPageService $pages,
	) {
		parent::__construct($appName, $request);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	public function show(string $slug): PublicTemplateResponse {
		try {
			return $this->page($this->pages->publicView($slug));
		} catch (PasswordRequiredException) {
			return $this->passwordPage($slug, null, $this->pages->allowsEmbedding($slug));
		} catch (LinkUnavailableException $e) {
			return $this->error($e);
		}
	}

	#[PublicPage]
	#[NoCSRFRequired]
	#[AnonRateLimit(limit: 10, period: 60)]
	#[UserRateLimit(limit: 20, period: 60)]
	public function password(string $slug, string $password = ''): PublicTemplateResponse {
		try {
			return $this->page($this->pages->publicView($slug, $password));
		} catch (PasswordRequiredException) {
			return $this->passwordPage($slug, 'Incorrect password', $this->pages->allowsEmbedding($slug));
		} catch (LinkUnavailableException $e) {
			return $this->error($e);
		}
	}

	/** @param array{page:array<string,mixed>,links:list<array<string,mixed>>,footerLinks:list<array<string,mixed>>,files:list<array<string,mixed>>,contacts:list<array<string,mixed>>,owner:string} $data */
	private function page(array $data): PublicTemplateResponse {
		$response = new PublicTemplateResponse('shortlinks', 'link-page', $data, Http::STATUS_OK, ['Cache-Control' => 'no-store', 'Referrer-Policy' => 'strict-origin-when-cross-origin']);
		$response->setHeaderTitle((string)$data['page']['title']);
		$response->setHeaderDetails('Shortlinks Page');
		$this->applyEmbeddingPolicy($response, (bool)($data['page']['allowEmbedding'] ?? false));
		return $response;
	}

	private function passwordPage(string $slug, ?string $error = null, bool $allowEmbedding = false): PublicTemplateResponse {
		$response = new PublicTemplateResponse('shortlinks', 'page-password', ['slug' => $slug, 'error' => $error], $error === null ? Http::STATUS_OK : Http::STATUS_UNAUTHORIZED, ['Cache-Control' => 'no-store']);
		$response->setHeaderTitle('Protected Page');
		$this->applyEmbeddingPolicy($response, $allowEmbedding);
		return $response;
	}

	private function applyEmbeddingPolicy(PublicTemplateResponse $response, bool $allowEmbedding): void {
		$policy = new ContentSecurityPolicy();
		if ($allowEmbedding) {
			$policy->addAllowedFrameAncestorDomain('*');
		} else {
			$policy->disallowFrameAncestorDomain("'self'");
		}
		$response->setContentSecurityPolicy($policy);
	}

	private function error(LinkUnavailableException $error): PublicTemplateResponse {
		$response = new PublicTemplateResponse('shortlinks', 'error', ['message' => $error->getMessage()], $error->getCode(), ['Cache-Control' => 'no-store']);
		$response->setHeaderTitle('Shortlinks Pages');
		return $response;
	}
}
