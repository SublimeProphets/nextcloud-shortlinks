<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Db;

use OCP\AppFramework\Db\Entity;
use OCP\DB\Types;

/**
 * @method int getLinkId()
 * @method void setLinkId(int $value)
 * @method int getClickedAt()
 * @method void setClickedAt(int $value)
 * @method ?string getUserUid()
 * @method void setUserUid(?string $value)
 * @method ?string getVisitorHash()
 * @method void setVisitorHash(?string $value)
 * @method string getReferrerType()
 * @method void setReferrerType(string $value)
 * @method ?string getReferrerDomain()
 * @method void setReferrerDomain(?string $value)
 * @method ?string getReferrerUrl()
 * @method void setReferrerUrl(?string $value)
 * @method string getBrowser()
 * @method void setBrowser(string $value)
 * @method ?string getBrowserVersion()
 * @method void setBrowserVersion(?string $value)
 * @method string getOs()
 * @method void setOs(string $value)
 * @method ?string getOsVersion()
 * @method void setOsVersion(?string $value)
 * @method string getDeviceType()
 * @method void setDeviceType(string $value)
 * @method ?string getCountry()
 * @method void setCountry(?string $value)
 * @method ?string getRegion()
 * @method void setRegion(?string $value)
 * @method bool getIsBot()
 * @method void setIsBot(bool $value)
 * @method string getOutcome()
 * @method void setOutcome(string $value)
 */
final class ClickEvent extends Entity {
	protected int $linkId = 0;
	protected int $clickedAt = 0;
	protected ?string $userUid = null;
	protected ?string $visitorHash = null;
	protected string $referrerType = 'unknown';
	protected ?string $referrerDomain = null;
	protected ?string $referrerUrl = null;
	protected string $browser = 'Unknown';
	protected ?string $browserVersion = null;
	protected string $os = 'Unknown';
	protected ?string $osVersion = null;
	protected string $deviceType = 'unknown';
	protected ?string $country = null;
	protected ?string $region = null;
	protected bool $isBot = false;
	protected string $outcome = 'redirected';

	public function __construct() {
		$this->addType('linkId', Types::BIGINT);
		$this->addType('clickedAt', Types::BIGINT);
		$this->addType('isBot', Types::BOOLEAN);
	}

	/** @return array<string, mixed> */
	public function toArray(): array {
		return ['id' => $this->getId(), 'clickedAt' => $this->getClickedAt(), 'userUid' => $this->getUserUid(), 'visitorHash' => $this->getVisitorHash(), 'referrerType' => $this->getReferrerType(), 'referrerDomain' => $this->getReferrerDomain(), 'referrerUrl' => $this->getReferrerUrl(), 'browser' => $this->getBrowser(), 'browserVersion' => $this->getBrowserVersion(), 'os' => $this->getOs(), 'osVersion' => $this->getOsVersion(), 'deviceType' => $this->getDeviceType(), 'country' => $this->getCountry(), 'region' => $this->getRegion(), 'isBot' => $this->getIsBot(), 'outcome' => $this->getOutcome()];
	}
}
