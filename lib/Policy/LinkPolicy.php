<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Policy;

use OCA\Shortlinks\Db\PermissionMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Exception\ForbiddenException;
use OCA\Shortlinks\Service\SettingsService;
use OCP\IGroupManager;
use OCP\IUserSession;

final class LinkPolicy {
	public function __construct(
		private readonly IUserSession $userSession,
		private readonly IGroupManager $groupManager,
		private readonly PermissionMapper $permissions,
		private readonly SettingsService $settings,
	) {
	}

	public function currentUid(): string {
		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new ForbiddenException('Authentication required');
		}
		return $user->getUID();
	}

	/** @return list<string> */
	public function currentGroupIds(): array {
		$user = $this->userSession->getUser();
		return $user === null ? [] : $this->groupManager->getUserGroupIds($user);
	}

	public function canManageAll(): bool {
		$user = $this->userSession->getUser();
		return $user !== null && $this->settings->bool('admin_manage_all') && $this->isAdmin();
	}

	public function isAdmin(): bool {
		$user = $this->userSession->getUser();
		return $user !== null && $this->groupManager->isAdmin($user->getUID());
	}

	public function canView(ShortLink $link): bool {
		$user = $this->userSession->getUser();
		if ($user === null) {
			return false;
		}
		$uid = $user->getUID();
		return $link->getOwnerUid() === $uid
			|| ($this->settings->bool('admin_manage_all') && $this->isAdmin())
			|| $this->permissions->permissionFor($link->getId(), $uid, $this->currentGroupIds()) !== null;
	}

	public function canEdit(ShortLink $link): bool {
		$user = $this->userSession->getUser();
		if ($user === null) {
			return false;
		}
		$uid = $user->getUID();
		return $link->getOwnerUid() === $uid
			|| ($this->settings->bool('admin_manage_all') && $this->isAdmin())
			|| $this->permissions->permissionFor($link->getId(), $uid, $this->currentGroupIds()) === 'edit';
	}

	public function canShare(ShortLink $link): bool {
		$user = $this->userSession->getUser();
		if ($user === null) {
			return false;
		}
		return $link->getOwnerUid() === $user->getUID()
			|| ($this->settings->bool('admin_manage_all') && $this->isAdmin());
	}

	public function requireView(ShortLink $link): void {
		if (!$this->canView($link)) {
			throw new ForbiddenException();
		}
	}

	public function requireEdit(ShortLink $link): void {
		if (!$this->canEdit($link)) {
			throw new ForbiddenException();
		}
	}

	public function requireShare(ShortLink $link): void {
		if (!$this->canShare($link)) {
			throw new ForbiddenException();
		}
	}
}
