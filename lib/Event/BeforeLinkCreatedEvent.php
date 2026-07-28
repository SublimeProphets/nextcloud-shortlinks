<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Event;

use OCP\EventDispatcher\Event;

final class BeforeLinkCreatedEvent extends Event {
	/** @param array<string, mixed> $data */
	public function __construct(
		public array $data,
		public readonly string $ownerUid,
	) {
		parent::__construct();
	}
}
