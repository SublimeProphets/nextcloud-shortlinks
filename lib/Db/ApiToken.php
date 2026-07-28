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
 * @method string getTokenPrefix()
 * @method void setTokenPrefix(string $value)
 * @method string getTokenHash()
 * @method void setTokenHash(string $value)
 * @method string getScopes()
 * @method void setScopes(string $value)
 * @method ?int getExpiresAt()
 * @method void setExpiresAt(?int $value)
 * @method ?int getLastUsedAt()
 * @method void setLastUsedAt(?int $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 * @method ?int getRevokedAt()
 * @method void setRevokedAt(?int $value)
 */
final class ApiToken extends Entity {
	protected string $ownerUid = '';
	protected string $name = '';
	protected string $tokenPrefix = '';
	protected string $tokenHash = '';
	protected string $scopes = '';
	protected ?int $expiresAt = null;
	protected ?int $lastUsedAt = null;
	protected int $createdAt = 0;
	protected ?int $revokedAt = null;

	public function __construct() {
		foreach (['expiresAt', 'lastUsedAt', 'createdAt', 'revokedAt'] as $field) {
			$this->addType($field, Types::BIGINT);
		}
	}
}
