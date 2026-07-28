<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method string getOwnerUid()
 * @method void setOwnerUid(string $value)
 * @method string getName()
 * @method void setName(string $value)
 * @method string getNormalizedName()
 * @method void setNormalizedName(string $value)
 * @method ?string getColor()
 * @method void setColor(?string $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 * @method int getUpdatedAt()
 * @method void setUpdatedAt(int $value)
 */
final class Tag extends Entity {
	protected string $ownerUid = '';
	protected string $name = '';
	protected string $normalizedName = '';
	protected ?string $color = null;
	protected int $createdAt = 0;
	protected int $updatedAt = 0;

	public function __construct() {
		$this->addType('createdAt', Types::BIGINT);
		$this->addType('updatedAt', Types::BIGINT);
	}

	/** @return array<string, mixed> */
	public function toArray(int $count = 0): array {
		return ['id' => $this->getId(), 'name' => $this->getName(), 'color' => $this->getColor(), 'count' => $count];
	}
}
