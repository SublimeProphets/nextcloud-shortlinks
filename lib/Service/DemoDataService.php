<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Provider\Alias\AliasGeneratorInterface;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IUserManager;

final class DemoDataService {
	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly AliasGeneratorInterface $aliases,
		private readonly IUserManager $users,
		private readonly ITimeFactory $time,
	) {
	}

	public function seed(string $uid): int {
		if ($this->users->get($uid) === null) {
			throw new \InvalidArgumentException('User does not exist');
		} $created = 0;
		foreach ([['https://nextcloud.com/', 'Nextcloud'], ['https://docs.nextcloud.com/', 'Nextcloud documentation']] as [$url, $title]) {
			if ($this->links->findOwnerTarget($uid, hash('sha256', $url)) !== null) {
				continue;
			} $slug = $this->aliases->generate();
			$link = new ShortLink();
			$now = $this->time->getTime();
			$link->setOwnerUid($uid);
			$link->setSlug($slug);
			$link->setSlugHash(hash('sha256', $slug));
			$link->setTargetUrl($url);
			$link->setTargetHash(hash('sha256', $url));
			$link->setTitle($title);
			$link->setDescription('Demo link');
			$link->setIsFavorite(false);
			$link->setIsActive(true);
			$link->setAccessMode('public');
			$link->setRedirectStatus(302);
			$link->setClickCount(0);
			$link->setCreatedAt($now);
			$link->setUpdatedAt($now);
			$link->setEntityVersion(1);
			$this->links->insert($link);
			++$created;
		}
		return $created;
	}
}
