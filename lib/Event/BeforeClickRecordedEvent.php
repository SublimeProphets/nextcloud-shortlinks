<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Event;

use OCA\Shortlinks\Db\ClickEvent;
use OCP\EventDispatcher\Event;

/** Trusted extensions can refine locally derived classifications before persistence. */
final class BeforeClickRecordedEvent extends Event {
	public function __construct(
		public readonly ClickEvent $click,
	) {
		parent::__construct();
	}
}
