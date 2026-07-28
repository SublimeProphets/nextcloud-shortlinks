<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

use RuntimeException;

class ShortlinksException extends RuntimeException {
	public function __construct(string $message, public readonly string $errorCode, int $httpStatus = 400) {
		parent::__construct($message, $httpStatus);
	}
}
