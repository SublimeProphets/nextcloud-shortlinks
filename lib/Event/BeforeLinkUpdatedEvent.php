<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Event;

use OCA\Shortlinks\Db\ShortLink;
use OCP\EventDispatcher\Event;

final class BeforeLinkUpdatedEvent extends Event {
	/** @param array<string, mixed> $data */
	public function __construct(
		public readonly ShortLink $link,
		public array $data,
	) {
		parent::__construct();
	}
}
