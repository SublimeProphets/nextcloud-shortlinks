<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\UserAgent;

interface UserAgentParserInterface {
	/** @return array{browser:string,browserVersion:?string,os:string,osVersion:?string,deviceType:string,isBot:bool} */
	public function parse(string $userAgent): array;
}
