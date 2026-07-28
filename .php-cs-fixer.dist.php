<?php

declare(strict_types=1);

use Nextcloud\CodingStandard\Config;

require_once __DIR__ . '/vendor-bin/cs-fixer/vendor/autoload.php';

$finder = PhpCsFixer\Finder::create()
	->in([__DIR__ . '/appinfo', __DIR__ . '/lib', __DIR__ . '/templates', __DIR__ . '/tests'])
	->exclude(['vendor', 'vendor-bin']);

return (new Config())
	->setFinder($finder)
	->setRiskyAllowed(true);
