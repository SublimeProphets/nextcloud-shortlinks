<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class ValidationException extends ShortlinksException {
	/** @param array<string, string> $fields */
	public function __construct(string $message, public readonly array $fields = []) {
		parent::__construct($message, 'validation_error', 422);
	}
}
