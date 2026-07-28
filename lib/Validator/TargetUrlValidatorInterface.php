<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Validator;

interface TargetUrlValidatorInterface {
	public function validate(string $url): string;

	public function assertSafeForServerRequest(string $url): void;
}
