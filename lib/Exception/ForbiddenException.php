<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class ForbiddenException extends ShortlinksException {
	public function __construct(string $message = 'Access denied') {
		parent::__construct($message, 'forbidden', 403);
	}
}
