<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$directories = ['appinfo', 'lib', 'templates', 'tests'];
$failed = false;

foreach ($directories as $directory) {
	$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root . DIRECTORY_SEPARATOR . $directory));
	foreach ($iterator as $file) {
		if (!$file->isFile() || $file->getExtension() !== 'php') {
			continue;
		}
		$command = escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg($file->getPathname());
		passthru($command, $exitCode);
		$failed = $failed || $exitCode !== 0;
	}
}

exit($failed ? 1 : 0);
