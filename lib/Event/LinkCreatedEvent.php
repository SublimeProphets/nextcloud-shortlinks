<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Event;

use OCA\Shortlinks\Db\ShortLink;
use OCP\EventDispatcher\Event;

final class LinkCreatedEvent extends Event {
	public function __construct(
		public readonly ShortLink $link,
	) {
		parent::__construct();
	}
}
