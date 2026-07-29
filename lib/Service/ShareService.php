<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\Permission;
use OCA\Shortlinks\Db\PermissionMapper;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Enum\SharePermission;
use OCA\Shortlinks\Exception\NotFoundException;
use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IGroupManager;
use OCP\IUserManager;

final class ShareService {
	public function __construct(
		private readonly PermissionMapper $permissions,
		private readonly ShortLinkMapper $links,
		private readonly LinkPolicy $policy,
		private readonly IUserManager $users,
		private readonly IGroupManager $groups,
		private readonly ITimeFactory $time,
		private readonly AuditService $audit,
	) {
	}

	/** @return list<array<string,mixed>> */
	public function list(int $linkId): array {
		$link = $this->link($linkId);
		$this->policy->requireShare($link);
		return array_map(static fn (Permission $p): array => $p->toArray(), $this->permissions->findForLink($linkId));
	}

	/** @return array<string,mixed> */
	public function create(int $linkId, string $type, string $principalId, string $permission, string $purpose = 'management'): array {
		$link = $this->link($linkId);
		$this->policy->requireShare($link);
		if (!in_array($type, ['user', 'group'], true) || !in_array($purpose, ['management', 'access'], true) || SharePermission::tryFrom($permission) === null || ($purpose === 'access' && $permission !== 'view')) {
			throw new ValidationException('Invalid share', ['share' => 'invalid']);
		}
		if (($type === 'user' && $this->users->get($principalId) === null) || ($type === 'group' && $this->groups->get($principalId) === null)) {
			throw new ValidationException('Share recipient not found', ['principalId' => 'not_found']);
		}
		foreach ($this->permissions->findForLink($linkId) as $existing) {
			if ($existing->getPurpose() === $purpose && $existing->getPrincipalType() === $type && $existing->getPrincipalId() === $principalId) {
				$existing->setPermission($permission);
				$this->permissions->update($existing);
				$this->audit->record('permissions_changed', $link->getOwnerUid(), $link, ['shareId' => $existing->getId(), 'type' => $type, 'principalId' => $principalId, 'purpose' => $purpose, 'permission' => $permission]);
				return $existing->toArray();
			}
		}
		$share = new Permission();
		$share->setLinkId($linkId);
		$share->setPrincipalType($type);
		$share->setPrincipalId($principalId);
		$share->setPurpose($purpose);
		$share->setPermission($permission);
		$share->setCreatedAt($this->time->getTime());
		$share = $this->permissions->insert($share);
		$this->audit->record('permissions_changed', $link->getOwnerUid(), $link, ['shareId' => $share->getId(), 'type' => $type, 'principalId' => $principalId, 'purpose' => $purpose, 'permission' => $permission]);
		return $share->toArray();
	}

	public function delete(int $linkId, int $shareId): void {
		$link = $this->link($linkId);
		$this->policy->requireShare($link);
		$share = $this->permissions->findOne($shareId, $linkId);
		if ($share === null) {
			throw new NotFoundException('Share not found');
		} $this->permissions->delete($share);
		$this->audit->record('permissions_changed', $link->getOwnerUid(), $link, ['shareId' => $shareId, 'removed' => true]);
	}

	private function link(int $id): \OCA\Shortlinks\Db\ShortLink {
		try {
			return $this->links->find($id);
		} catch (DoesNotExistException) {
			throw new NotFoundException();
		}
	}
}
