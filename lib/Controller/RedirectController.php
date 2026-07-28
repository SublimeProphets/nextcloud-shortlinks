<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Exception\LinkUnavailableException;
use OCA\Shortlinks\Exception\PasswordRequiredException;
use OCA\Shortlinks\Service\RedirectService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\AnonRateLimit;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\Attribute\UserRateLimit;
use OCP\AppFramework\Http\RedirectResponse;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\IRequest;

final class RedirectController extends Controller {
	public function __construct(
		string $appName,
		IRequest $request,
		private readonly RedirectService $redirects,
	) {
		parent::__construct($appName, $request);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	public function follow(string $slug): Response {
		try {
			return $this->redirect($this->redirects->resolve($slug, $this->request));
		} catch (PasswordRequiredException) {
			return $this->passwordPage($slug);
		} catch (LinkUnavailableException $e) {
			return $this->errorPage($e);
		}
	}

	#[PublicPage]
	#[NoCSRFRequired]
	public function passwordForm(string $slug): PublicTemplateResponse {
		return $this->passwordPage($slug);
	}

	#[PublicPage]
	#[NoCSRFRequired]
	#[AnonRateLimit(limit: 10, period: 60)]
	#[UserRateLimit(limit: 20, period: 60)]
	public function passwordSubmit(string $slug, string $password = ''): Response {
		try {
			return $this->redirect($this->redirects->resolve($slug, $this->request, $password));
		} catch (PasswordRequiredException) {
			return $this->passwordPage($slug, 'Incorrect password');
		} catch (LinkUnavailableException $e) {
			return $this->errorPage($e);
		}
	}

	/** @param array{url:string,status:int,protected:bool} $resolved */
	private function redirect(array $resolved): RedirectResponse {
		return new RedirectResponse($resolved['url'], $resolved['status'], ['Cache-Control' => 'no-store, private', 'Pragma' => 'no-cache', 'Referrer-Policy' => 'no-referrer']);
	}

	private function passwordPage(string $slug, ?string $error = null): PublicTemplateResponse {
		$response = new PublicTemplateResponse('shortlinks', 'password', ['slug' => $slug, 'error' => $error], $error === null ? Http::STATUS_OK : Http::STATUS_UNAUTHORIZED, ['Cache-Control' => 'no-store']);
		$response->setHeaderTitle('Shortlinks');
		$response->setHeaderDetails('Protected link');
		return $response;
	}

	private function errorPage(LinkUnavailableException $error): PublicTemplateResponse {
		$response = new PublicTemplateResponse('shortlinks', 'error', ['message' => $error->getMessage()], $error->getCode(), ['Cache-Control' => 'no-store']);
		$response->setHeaderTitle('Shortlinks');
		return $response;
	}
}
