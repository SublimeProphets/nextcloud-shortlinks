<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class LinkUnavailableException extends ShortlinksException {
	public function __construct(string $message = 'This short link is unavailable', int $status = 404, string $code = 'unavailable') {
		parent::__construct($message, $code, $status);
	}
}
