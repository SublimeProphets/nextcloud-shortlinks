<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method string getOwnerUid()
 * @method void setOwnerUid(string $value)
 * @method string getSlug()
 * @method void setSlug(string $value)
 * @method string getSlugHash()
 * @method void setSlugHash(string $value)
 * @method string getTitle()
 * @method void setTitle(string $value)
 * @method ?string getLead()
 * @method void setLead(?string $value)
 * @method string getAccessMode()
 * @method void setAccessMode(string $value)
 * @method ?string getPasswordHash()
 * @method void setPasswordHash(?string $value)
 * @method bool getAllowEmbedding()
 * @method void setAllowEmbedding(bool $value)
 * @method ?int getStartsAt()
 * @method void setStartsAt(?int $value)
 * @method ?int getExpiresAt()
 * @method void setExpiresAt(?int $value)
 * @method string getFolderIds()
 * @method void setFolderIds(string $value)
 * @method string getTagIds()
 * @method void setTagIds(string $value)
 * @method string getLinkIds()
 * @method void setLinkIds(string $value)
 * @method ?string getFilePaths()
 * @method void setFilePaths(?string $value)
 * @method ?string getContactsJson()
 * @method void setContactsJson(?string $value)
 * @method string getUserIds()
 * @method void setUserIds(string $value)
 * @method string getGroupIds()
 * @method void setGroupIds(string $value)
 * @method string getLayout()
 * @method void setLayout(string $value)
 * @method string getGrouping()
 * @method void setGrouping(string $value)
 * @method string getVisibleFields()
 * @method void setVisibleFields(string $value)
 * @method string getThemeJson()
 * @method void setThemeJson(string $value)
 * @method string getHeaderJson()
 * @method void setHeaderJson(string $value)
 * @method string getFooterJson()
 * @method void setFooterJson(string $value)
 * @method bool getIsActive()
 * @method void setIsActive(bool $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 * @method int getUpdatedAt()
 * @method void setUpdatedAt(int $value)
 * @method ?int getDeletedAt()
 * @method void setDeletedAt(?int $value)
 * @method int getEntityVersion()
 * @method void setEntityVersion(int $value)
 */
final class LinkPage extends Entity {
	protected string $ownerUid = '';
	protected string $slug = '';
	protected string $slugHash = '';
	protected string $title = '';
	protected ?string $lead = null;
	protected string $accessMode = 'private';
	protected ?string $passwordHash = null;
	protected bool $allowEmbedding = false;
	protected ?int $startsAt = null;
	protected ?int $expiresAt = null;
	protected string $folderIds = '[]';
	protected string $tagIds = '[]';
	protected string $linkIds = '[]';
	protected ?string $filePaths = '[]';
	protected ?string $contactsJson = '[]';
	protected string $userIds = '[]';
	protected string $groupIds = '[]';
	protected string $layout = 'cards';
	protected string $grouping = 'none';
	protected string $visibleFields = '["title","thumbnail","media","domain"]';
	protected string $themeJson = '{}';
	protected string $headerJson = '{}';
	protected string $footerJson = '{}';
	protected bool $isActive = true;
	protected int $createdAt = 0;
	protected int $updatedAt = 0;
	protected ?int $deletedAt = null;
	protected int $entityVersion = 1;

	public function __construct() {
		$this->addType('isActive', Types::BOOLEAN);
		$this->addType('allowEmbedding', Types::BOOLEAN);
		foreach (['startsAt', 'expiresAt', 'createdAt', 'updatedAt', 'deletedAt'] as $field) {
			$this->addType($field, Types::BIGINT);
		}
		$this->addType('entityVersion', Types::INTEGER);
	}
}
