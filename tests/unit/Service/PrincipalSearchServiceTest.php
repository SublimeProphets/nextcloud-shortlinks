<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\PrincipalSearchService;
use OCP\IGroup;
use OCP\IGroupManager;
use OCP\IUser;
use OCP\IUserManager;
use PHPUnit\Framework\TestCase;

final class PrincipalSearchServiceTest extends TestCase {
	public function testReturnsEnabledUsersBeforeGroups(): void {
		$enabled = $this->user('alice', 'Alice Example', true);
		$disabled = $this->user('archived', 'Archived User', false);
		$group = $this->createMock(IGroup::class);
		$group->method('getGID')->willReturn('sales');
		$group->method('getDisplayName')->willReturn('Sales');
		$users = $this->createMock(IUserManager::class);
		$users->expects(self::once())->method('searchDisplayName')->with('al', 20, 0)->willReturn([$enabled, $disabled]);
		$groups = $this->createMock(IGroupManager::class);
		$groups->expects(self::once())->method('search')->with('al', 20, 0)->willReturn([$group]);

		$result = (new PrincipalSearchService($users, $groups))->search('al');

		self::assertSame([
			['type' => 'user', 'id' => 'alice', 'label' => 'Alice Example'],
			['type' => 'group', 'id' => 'sales', 'label' => 'Sales'],
		], $result);
	}

	public function testRequiresMeaningfulSearchText(): void {
		$service = new PrincipalSearchService($this->createMock(IUserManager::class), $this->createMock(IGroupManager::class));
		$this->expectException(ValidationException::class);
		$service->search('a');
	}

	private function user(string $uid, string $displayName, bool $enabled): IUser {
		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn($uid);
		$user->method('getDisplayName')->willReturn($displayName);
		$user->method('isEnabled')->willReturn($enabled);
		return $user;
	}
}
