<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Db\PermissionMapper;
use OCA\Shortlinks\Db\ShortLink;
use OCA\Shortlinks\Db\ShortLinkMapper;
use OCA\Shortlinks\Enum\AccessMode;
use OCA\Shortlinks\Event\AfterRedirectEvent;
use OCA\Shortlinks\Event\BeforeRedirectEvent;
use OCA\Shortlinks\Exception\LinkUnavailableException;
use OCA\Shortlinks\Exception\PasswordRequiredException;
use OCA\Shortlinks\Validator\SlugValidator;
use OCA\Shortlinks\Validator\TargetUrlValidatorInterface;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IGroupManager;
use OCP\IRequest;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;

final class RedirectService {
	public function __construct(
		private readonly ShortLinkMapper $links,
		private readonly PermissionMapper $permissions,
		private readonly SlugValidator $slugs,
		private readonly TargetUrlValidatorInterface $urls,
		private readonly StatsService $stats,
		private readonly IUserSession $userSession,
		private readonly IGroupManager $groups,
		private readonly ITimeFactory $time,
		private readonly IEventDispatcher $events,
		private readonly LoggerInterface $logger,
	) {
	}

	/** @return array{url:string,status:int,protected:bool} */
	public function resolve(string $slug, IRequest $request, ?string $password = null): array {
		try {
			$link = $this->links->findBySlug($this->slugs->normalize($slug));
		} catch (DoesNotExistException|\OCA\Shortlinks\Exception\ValidationException) {
			throw new LinkUnavailableException();
		}
		$now = $this->time->getTime();
		if ($link->getDeletedAt() !== null || !$link->getIsActive() || $link->getAccessMode() === AccessMode::Disabled->value) {
			throw new LinkUnavailableException();
		}
		if ($link->getStartsAt() !== null && $link->getStartsAt() > $now) {
			throw new LinkUnavailableException('This short link is not active yet', 404, 'not_started');
		}
		if ($link->getExpiresAt() !== null && $link->getExpiresAt() <= $now) {
			throw new LinkUnavailableException('This short link has expired', 410, 'expired');
		}
		if ($link->getClickLimit() !== null && $link->getClickCount() >= $link->getClickLimit()) {
			throw new LinkUnavailableException('This short link reached its click limit', 410, 'click_limit');
		}
		$this->assertAccess($link, $password);
		$this->events->dispatchTyped(new BeforeRedirectEvent($link));
		try {
			$targetUrl = $this->urls->validate($link->getTargetUrl());
		} catch (\OCA\Shortlinks\Exception\ValidationException) {
			throw new LinkUnavailableException('The target is no longer permitted', 410, 'target_blocked');
		}
		if (!$this->links->incrementClick($link->getId(), $link->getClickLimit(), $now)) {
			throw new LinkUnavailableException('This short link reached its click limit', 410, 'click_limit');
		}
		try {
			$this->stats->record($link, $request);
		} catch (\Throwable $e) {
			$this->logger->warning('Shortlinks click statistics failed', ['app' => 'shortlinks', 'linkId' => $link->getId(), 'exception' => $e]);
		}
		$this->events->dispatchTyped(new AfterRedirectEvent($link));
		return ['url' => $targetUrl, 'status' => $link->getRedirectStatus(), 'protected' => $link->getAccessMode() !== AccessMode::Public->value];
	}

	private function assertAccess(ShortLink $link, ?string $password): void {
		$mode = AccessMode::from($link->getAccessMode());
		if ($mode === AccessMode::Public) {
			return;
		}
		if ($mode === AccessMode::Password) {
			if ($password === null) {
				throw new PasswordRequiredException();
			}
			if ($link->getPasswordHash() === null || !password_verify($password, $link->getPasswordHash())) {
				throw new PasswordRequiredException();
			}
			return;
		}
		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new LinkUnavailableException('Sign in to open this short link', 401, 'authentication_required');
		}
		if ($mode === AccessMode::Authenticated) {
			return;
		}
		$groupIds = $this->groups->getUserGroupIds($user);
		if ($link->getOwnerUid() !== $user->getUID() && !$this->permissions->hasRedirectAccess($link->getId(), $mode->value, $user->getUID(), $groupIds)) {
			throw new LinkUnavailableException('You are not allowed to open this short link', 403, 'forbidden');
		}
	}
}
