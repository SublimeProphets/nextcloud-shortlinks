<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCP\IGroupManager;
use OCP\IUserManager;

final class PrincipalSearchService {
	public function __construct(
		private readonly IUserManager $users,
		private readonly IGroupManager $groups,
	) {
	}

	/** @return list<array{type:string,id:string,label:string}> */
	public function search(string $query, int $limit = 20): array {
		$query = trim($query);
		if (mb_strlen($query) < 2 || mb_strlen($query) > 100) {
			throw new ValidationException('Search text must contain between 2 and 100 characters', ['search' => 'invalid']);
		}
		$limit = max(1, min(50, $limit));
		$result = [];
		foreach ($this->users->searchDisplayName($query, $limit, 0) as $user) {
			if (!$user->isEnabled()) {
				continue;
			}
			$result[] = ['type' => 'user', 'id' => (string)$user->getUID(), 'label' => (string)$user->getDisplayName()];
			if (count($result) >= $limit) {
				return $result;
			}
		}
		foreach ($this->groups->search($query, $limit, 0) as $group) {
			$result[] = ['type' => 'group', 'id' => $group->getGID(), 'label' => $group->getDisplayName()];
			if (count($result) >= $limit) {
				break;
			}
		}
		return $result;
	}
}
