<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\Geo;

interface GeoResolverInterface {
	/** @return array{country:?string,region:?string} */
	public function resolve(string $ipAddress): array;

	/** @return array{configured:bool,readable:bool,path:?string,updatedAt:?int,error:?string} */
	public function status(): array;
}
