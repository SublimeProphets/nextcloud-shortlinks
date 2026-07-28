<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\Alias;

interface AliasGeneratorInterface {
	public function generate(): string;
}
