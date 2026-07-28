<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Policy;

use OCA\Shortlinks\Db\PermissionMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Policy\LinkPolicy;
use OCA\Shortlinks\Tests\Unit\SettingsFactory;
use OCP\IDBConnection;
use OCP\IGroupManager;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\TestCase;

final class LinkPolicyTest extends TestCase {
	use SettingsFactory;

	public function testOwnerCanManageShares(): void {
		self::assertTrue($this->policy('owner')->canShare($this->link('owner')));
	}

	public function testEditorCannotDelegateShares(): void {
		self::assertFalse($this->policy('editor')->canShare($this->link('owner')));
	}

	public function testConfiguredAdministratorCanManageShares(): void {
		self::assertTrue($this->policy('admin', true, true)->canShare($this->link('owner')));
	}

	private function link(string $ownerUid): ShortLink {
		$link = new ShortLink();
		$link->setOwnerUid($ownerUid);
		return $link;
	}

	private function policy(string $uid, bool $adminManageAll = false, bool $isAdmin = false): LinkPolicy {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn($uid);
		$session = $this->createMock(IUserSession::class);
		$session->method('getUser')->willReturn($user);
		$groups = $this->createMock(IGroupManager::class);
		$groups->method('isAdmin')->with($uid)->willReturn($isAdmin);
		$permissions = new PermissionMapper($this->createMock(IDBConnection::class));
		return new LinkPolicy($session, $groups, $permissions, $this->settings(['admin_manage_all' => $adminManageAll]));
	}
}
