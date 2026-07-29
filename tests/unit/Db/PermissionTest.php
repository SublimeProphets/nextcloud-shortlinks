<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Db;

use OCA\Shortlinks\Db\Permission;
use PHPUnit\Framework\TestCase;

final class PermissionTest extends TestCase {
	public function testDefaultShareValuesAreMarkedForInsertion(): void {
		$permission = new Permission();
		$permission->setPrincipalType('user');
		$permission->setPurpose('management');
		$permission->setPermission('view');

		self::assertArrayHasKey('principalType', $permission->getUpdatedFields());
		self::assertArrayHasKey('purpose', $permission->getUpdatedFields());
		self::assertArrayHasKey('permission', $permission->getUpdatedFields());
	}
}
