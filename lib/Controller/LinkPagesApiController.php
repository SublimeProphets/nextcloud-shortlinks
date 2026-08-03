<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Controller;

use OCA\Shortlinks\Service\LinkPageService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

final class LinkPagesApiController extends AbstractApiOCSController {
	private const FIELDS = ['slug', 'title', 'lead', 'accessMode', 'password', 'allowEmbedding', 'startsAt', 'expiresAt', 'folderIds', 'tagIds', 'linkIds', 'filePaths', 'contacts', 'userIds', 'groupIds', 'layout', 'grouping', 'visibleFields', 'theme', 'header', 'footer', 'sectionOrder', 'active', 'version'];
	public function __construct(
		string $appName,
		IRequest $request,
		LoggerInterface $logger,
		private readonly LinkPageService $pages,
	) {
		parent::__construct($appName, $request, $logger);
	}

	#[NoAdminRequired]
	public function index(string $filter = 'all', int $page = 1, int $perPage = 50): DataResponse {
		return $this->respond(fn (): array => $this->pages->list($filter, $page, $perPage));
	}
	#[NoAdminRequired]
	public function contacts(string $search = ''): DataResponse {
		return $this->respond(fn (): array => $this->pages->searchContacts($search));
	}
	#[NoAdminRequired]
	public function show(int $id): DataResponse {
		return $this->respond(fn (): array => $this->pages->get($id));
	}
	#[NoAdminRequired]
	public function create(): DataResponse {
		return $this->respond(fn (): array => $this->pages->create($this->payload(self::FIELDS)), Http::STATUS_CREATED);
	}
	#[NoAdminRequired]
	public function update(int $id): DataResponse {
		return $this->respond(fn (): array => $this->pages->update($id, $this->payload(self::FIELDS)));
	}
	#[NoAdminRequired]
	public function versions(int $id): DataResponse {
		return $this->respond(fn (): array => $this->pages->versions($id));
	}
	#[NoAdminRequired]
	public function version(int $id, int $versionNumber): DataResponse {
		return $this->respond(fn (): array => $this->pages->version($id, $versionNumber));
	}
	#[NoAdminRequired]
	public function restoreVersion(int $id, int $versionNumber): DataResponse {
		return $this->respond(fn (): array => $this->pages->restoreVersion($id, $versionNumber, (int)($this->request->getParam('currentVersion', 0))));
	}
	#[NoAdminRequired]
	public function destroy(int $id, bool $permanent = false): DataResponse {
		return $this->respond(function () use ($id, $permanent): array {
			$this->pages->delete($id, $permanent);
			return [];
		});
	}
	#[NoAdminRequired]
	public function restore(int $id): DataResponse {
		return $this->respond(fn (): array => $this->pages->restore($id));
	}
}
