<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Settings;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

final class AdminSection implements IIconSection {
	public function __construct(
		private readonly IL10N $l10n,
		private readonly IURLGenerator $urls,
	) {
	}
	public function getID(): string {
		return 'shortlinks';
	}
	public function getName(): string {
		return $this->l10n->t('Shortlinks');
	}
	public function getPriority(): int {
		return 70;
	}
	public function getIcon(): string {
		return $this->urls->imagePath('shortlinks', 'app.svg');
	}
}
