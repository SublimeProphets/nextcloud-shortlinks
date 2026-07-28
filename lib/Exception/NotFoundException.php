<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class NotFoundException extends ShortlinksException {
	public function __construct(string $message = 'Resource not found') {
		parent::__construct($message, 'not_found', 404);
	}
}
