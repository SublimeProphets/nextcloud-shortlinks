<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method int getLinkId()
 * @method void setLinkId(int $value)
 * @method string getPrincipalType()
 * @method void setPrincipalType(string $value)
 * @method string getPrincipalId()
 * @method void setPrincipalId(string $value)
 * @method string getPurpose()
 * @method void setPurpose(string $value)
 * @method string getPermission()
 * @method void setPermission(string $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 */
final class Permission extends Entity {
	protected int $linkId = 0;
	protected string $principalType = 'user';
	protected string $principalId = '';
	protected string $purpose = 'management';
	protected string $permission = 'view';
	protected int $createdAt = 0;

	public function __construct() {
		$this->addType('linkId', Types::BIGINT);
		$this->addType('createdAt', Types::BIGINT);
	}

	/** @return array<string, mixed> */
	public function toArray(): array {
		return ['id' => $this->getId(), 'type' => $this->getPrincipalType(), 'principalId' => $this->getPrincipalId(), 'purpose' => $this->getPurpose(), 'permission' => $this->getPermission()];
	}
}
