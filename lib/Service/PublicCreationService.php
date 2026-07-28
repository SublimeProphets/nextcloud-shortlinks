<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ForbiddenException;
use OCA\Shortlinks\Exception\ValidationException;
use OCP\IGroupManager;
use OCP\IUserManager;
use OCP\IUserSession;

final class PublicCreationService {
	public function __construct(
		private readonly SettingsService $settings,
		private readonly LinkService $links,
		private readonly IUserManager $users,
		private readonly IUserSession $session,
		private readonly IGroupManager $groups,
	) {
	}

	/** @param array<string, mixed> $data @return array<string, mixed> */
	public function create(array $data): array {
		if (!$this->settings->bool('enabled') || !$this->settings->bool('public_creation')) {
			throw new ForbiddenException('Public short-link creation is disabled');
		}
		$allowedGroups = $this->settings->array('public_creation_groups');
		$user = $this->session->getUser();
		if ($allowedGroups !== [] && ($user === null || array_intersect($allowedGroups, $this->groups->getUserGroupIds($user)) === [])) {
			throw new ForbiddenException('Public creation is restricted to configured groups');
		}
		$ownerUid = $this->settings->string('public_owner_uid');
		if ($ownerUid === '' || $this->users->get($ownerUid) === null) {
			throw new ValidationException('Public creation requires a valid owner configured by an administrator');
		}
		$unexpected = array_diff(array_keys($data), ['targetUrl', 'slug', 'title', 'description']);
		if ($unexpected !== []) {
			throw new ValidationException('Unexpected public creation fields', array_fill_keys($unexpected, 'unexpected'));
		}
		return $this->links->createForOwner([
			'targetUrl' => $data['targetUrl'] ?? '',
			'slug' => $data['slug'] ?? '',
			'title' => $data['title'] ?? '',
			'description' => $data['description'] ?? null,
			'active' => true,
			'accessMode' => 'public',
			'redirectStatus' => 302,
		], $ownerUid);
	}
}
