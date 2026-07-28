<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method string getOwnerUid()
 * @method void setOwnerUid(string $value)
 * @method ?int getFolderId()
 * @method void setFolderId(?int $value)
 * @method string getSlug()
 * @method void setSlug(string $value)
 * @method string getSlugHash()
 * @method void setSlugHash(string $value)
 * @method string getTargetUrl()
 * @method void setTargetUrl(string $value)
 * @method string getTargetHash()
 * @method void setTargetHash(string $value)
 * @method string getTitle()
 * @method void setTitle(string $value)
 * @method ?string getDescription()
 * @method void setDescription(?string $value)
 * @method bool getIsFavorite()
 * @method void setIsFavorite(bool $value)
 * @method bool getIsActive()
 * @method void setIsActive(bool $value)
 * @method string getAccessMode()
 * @method void setAccessMode(string $value)
 * @method ?string getPasswordHash()
 * @method void setPasswordHash(?string $value)
 * @method int getRedirectStatus()
 * @method void setRedirectStatus(int $value)
 * @method ?int getStartsAt()
 * @method void setStartsAt(?int $value)
 * @method ?int getExpiresAt()
 * @method void setExpiresAt(?int $value)
 * @method ?int getClickLimit()
 * @method void setClickLimit(?int $value)
 * @method int getClickCount()
 * @method void setClickCount(int $value)
 * @method ?int getLastClickedAt()
 * @method void setLastClickedAt(?int $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 * @method int getUpdatedAt()
 * @method void setUpdatedAt(int $value)
 * @method ?int getDeletedAt()
 * @method void setDeletedAt(?int $value)
 * @method int getEntityVersion()
 * @method void setEntityVersion(int $value)
 */
final class ShortLink extends Entity {
	protected string $ownerUid = '';
	protected ?int $folderId = null;
	protected string $slug = '';
	protected string $slugHash = '';
	protected string $targetUrl = '';
	protected string $targetHash = '';
	protected string $title = '';
	protected ?string $description = null;
	protected bool $isFavorite = false;
	protected bool $isActive = true;
	protected string $accessMode = 'public';
	protected ?string $passwordHash = null;
	protected int $redirectStatus = 302;
	protected ?int $startsAt = null;
	protected ?int $expiresAt = null;
	protected ?int $clickLimit = null;
	protected int $clickCount = 0;
	protected ?int $lastClickedAt = null;
	protected int $createdAt = 0;
	protected int $updatedAt = 0;
	protected ?int $deletedAt = null;
	protected int $entityVersion = 1;

	public function __construct() {
		$this->addType('folderId', Types::BIGINT);
		$this->addType('isFavorite', Types::BOOLEAN);
		$this->addType('isActive', Types::BOOLEAN);
		$this->addType('redirectStatus', Types::INTEGER);
		foreach (['startsAt', 'expiresAt', 'clickLimit', 'clickCount', 'lastClickedAt', 'createdAt', 'updatedAt', 'deletedAt'] as $field) {
			$this->addType($field, Types::BIGINT);
		}
		$this->addType('entityVersion', Types::INTEGER);
	}

	/** @return array<string, mixed> */
	public function toArray(string $shortUrl, array $tags = []): array {
		return [
			'id' => $this->getId(), 'ownerUid' => $this->getOwnerUid(), 'folderId' => $this->getFolderId(),
			'slug' => $this->getSlug(), 'shortUrl' => $shortUrl, 'targetUrl' => $this->getTargetUrl(),
			'title' => $this->getTitle(), 'description' => $this->getDescription(), 'favorite' => $this->getIsFavorite(),
			'active' => $this->getIsActive(), 'accessMode' => $this->getAccessMode(), 'passwordProtected' => $this->getPasswordHash() !== null,
			'redirectStatus' => $this->getRedirectStatus(), 'startsAt' => $this->getStartsAt(), 'expiresAt' => $this->getExpiresAt(),
			'clickLimit' => $this->getClickLimit(), 'clickCount' => $this->getClickCount(), 'lastClickedAt' => $this->getLastClickedAt(),
			'createdAt' => $this->getCreatedAt(), 'updatedAt' => $this->getUpdatedAt(), 'deletedAt' => $this->getDeletedAt(),
			'version' => $this->getEntityVersion(), 'tags' => $tags,
		];
	}
}
