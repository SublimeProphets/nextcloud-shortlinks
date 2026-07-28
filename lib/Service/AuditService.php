<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\AuditLog;
use OCA\Shortlinks\Db\AuditLogMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IUserSession;

final class AuditService {
	public function __construct(
		private readonly AuditLogMapper $mapper,
		private readonly IUserSession $userSession,
		private readonly ITimeFactory $time,
	) {
	}

	/** @param array<string, scalar|null> $metadata */
	public function record(string $eventType, string $ownerUid, ?ShortLink $link = null, array $metadata = []): void {
		$safe = [];
		foreach ($metadata as $key => $value) {
			if (!preg_match('/password|token|secret|referrer|target/i', $key)) {
				$safe[$key] = is_string($value) ? substr(str_replace(["\r", "\n"], ' ', $value), 0, 255) : $value;
			}
		}
		$entry = new AuditLog();
		$entry->setLinkId($link?->getId());
		$entry->setOwnerUid($ownerUid);
		$entry->setActorUid($this->userSession->getUser()?->getUID());
		$entry->setEventType($eventType);
		$entry->setMetadata(json_encode($safe, JSON_THROW_ON_ERROR));
		$entry->setCreatedAt($this->time->getTime());
		$this->mapper->insert($entry);
	}
}
