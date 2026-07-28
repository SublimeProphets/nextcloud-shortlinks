<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method ?int getLinkId()
 * @method void setLinkId(?int $value)
 * @method string getOwnerUid()
 * @method void setOwnerUid(string $value)
 * @method ?string getActorUid()
 * @method void setActorUid(?string $value)
 * @method string getEventType()
 * @method void setEventType(string $value)
 * @method ?string getMetadata()
 * @method void setMetadata(?string $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 */
final class AuditLog extends Entity {
	protected ?int $linkId = null;
	protected string $ownerUid = '';
	protected ?string $actorUid = null;
	protected string $eventType = '';
	protected ?string $metadata = null;
	protected int $createdAt = 0;

	public function __construct() {
		$this->addType('linkId', Types::BIGINT);
		$this->addType('createdAt', Types::BIGINT);
	}

	/** @return array<string, mixed> */
	public function toArray(): array {
		return ['id' => $this->getId(), 'linkId' => $this->getLinkId(), 'actorUid' => $this->getActorUid(), 'eventType' => $this->getEventType(), 'metadata' => json_decode($this->getMetadata() ?? '{}', true), 'createdAt' => $this->getCreatedAt()];
	}
}
