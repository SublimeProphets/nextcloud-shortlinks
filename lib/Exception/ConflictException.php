<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class ConflictException extends ShortlinksException {
	public function __construct(string $message = 'The resource conflicts with existing data') {
		parent::__construct($message, 'conflict', 409);
	}
}
