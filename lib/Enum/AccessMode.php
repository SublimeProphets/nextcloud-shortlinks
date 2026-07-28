<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Enum;

enum AccessMode: string {
	case Public = 'public';
	case Authenticated = 'authenticated';
	case Users = 'users';
	case Groups = 'groups';
	case Password = 'password';
	case Disabled = 'disabled';
}
