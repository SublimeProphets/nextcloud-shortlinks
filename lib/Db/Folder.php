<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method string getOwnerUid()
 * @method void setOwnerUid(string $value)
 * @method ?int getParentId()
 * @method void setParentId(?int $value)
 * @method int getParentKey()
 * @method void setParentKey(int $value)
 * @method string getName()
 * @method void setName(string $value)
 * @method string getNormalizedName()
 * @method void setNormalizedName(string $value)
 * @method int getPosition()
 * @method void setPosition(int $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 * @method int getUpdatedAt()
 * @method void setUpdatedAt(int $value)
 */
final class Folder extends Entity {
	protected string $ownerUid = '';
	protected ?int $parentId = null;
	protected int $parentKey = 0;
	protected string $name = '';
	protected string $normalizedName = '';
	protected int $position = 0;
	protected int $createdAt = 0;
	protected int $updatedAt = 0;

	public function __construct() {
		$this->addType('parentId', Types::BIGINT);
		$this->addType('parentKey', Types::BIGINT);
		$this->addType('position', Types::INTEGER);
		$this->addType('createdAt', Types::BIGINT);
		$this->addType('updatedAt', Types::BIGINT);
	}

	/** @return array<string, mixed> */
	public function toArray(int $count = 0): array {
		return ['id' => $this->getId(), 'parentId' => $this->getParentId(), 'name' => $this->getName(), 'position' => $this->getPosition(), 'count' => $count];
	}
}
