<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Exception;

final class PasswordRequiredException extends ShortlinksException {
	public function __construct() {
		parent::__construct('Password required', 'password_required', 401);
	}
}
