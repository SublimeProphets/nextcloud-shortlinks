<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method int getPageId()
 * @method void setPageId(int $value)
 * @method int getVersionNumber()
 * @method void setVersionNumber(int $value)
 * @method string getModifiedBy()
 * @method void setModifiedBy(string $value)
 * @method string getSnapshotJson()
 * @method void setSnapshotJson(string $value)
 * @method int getCreatedAt()
 * @method void setCreatedAt(int $value)
 */
final class LinkPageVersion extends Entity {
	protected int $pageId = 0;
	protected int $versionNumber = 0;
	protected string $modifiedBy = '';
	protected string $snapshotJson = '{}';
	protected int $createdAt = 0;

	public function __construct() {
		$this->addType('pageId', Types::BIGINT);
		$this->addType('versionNumber', Types::INTEGER);
		$this->addType('createdAt', Types::BIGINT);
	}
}
