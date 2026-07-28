<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Enum;

enum SharePermission: string {
	case View = 'view';
	case Edit = 'edit';
}
