<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Provider\Alias;

use OCA\Shortlinks\Service\SettingsService;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

final class ConfigurableAliasGenerator implements AliasGeneratorInterface {
	private const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';
	private const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	public function __construct(
		private readonly IDBConnection $db,
		private readonly SettingsService $settings,
	) {
	}

	public function generate(): string {
		$mode = $this->settings->string('alias_mode');
		if ($mode === 'random' || $mode === 'readable') {
			return $this->randomAlias($this->settings->int('alias_length'));
		}
		$value = $this->nextSequence('sequential');
		$alphabet = $mode === 'base62' ? self::BASE62 : self::BASE36;
		return str_pad($this->encode($value, $alphabet), $this->settings->int('alias_min_length'), '0', STR_PAD_LEFT);
	}

	private function randomAlias(int $length): string {
		$alphabet = self::BASE62;
		$result = '';
		for ($i = 0; $i < $length; ++$i) {
			$result .= $alphabet[random_int(0, strlen($alphabet) - 1)];
		}
		return $result;
	}

	private function nextSequence(string $name, bool $initializeMissing = true): int {
		$this->db->beginTransaction();
		try {
			$update = $this->db->getQueryBuilder();
			$updated = $update->update('shortlinks_counters')->set('counter_value', $update->func()->add('counter_value', $update->createNamedParameter(1, IQueryBuilder::PARAM_INT)))->where($update->expr()->eq('counter_name', $update->createNamedParameter($name)))->executeStatement();
			if ($updated !== 1) {
				$this->db->rollBack();
			} else {
				$select = $this->db->getQueryBuilder();
				$select->select('counter_value')->from('shortlinks_counters')->where($select->expr()->eq('counter_name', $select->createNamedParameter($name)));
				$value = (int)$select->executeQuery()->fetchOne();
				$this->db->commit();
				return $value;
			}
		} catch (\Throwable $e) {
			$this->db->rollBack();
			throw $e;
		}

		if (!$initializeMissing) {
			throw new \RuntimeException('Alias counter could not be initialized');
		}

		try {
			$insert = $this->db->getQueryBuilder();
			$insert->insert('shortlinks_counters')->values([
				'counter_name' => $insert->createNamedParameter($name),
				'counter_value' => $insert->createNamedParameter(0, IQueryBuilder::PARAM_INT),
			])->executeStatement();
		} catch (\Throwable) {
			// A concurrent request may have created the unique row first.
		}

		return $this->nextSequence($name, false);
	}

	private function encode(int $value, string $alphabet): string {
		$base = strlen($alphabet);
		$output = '';
		do {
			$output = $alphabet[$value % $base] . $output;
			$value = intdiv($value, $base);
		} while ($value > 0);
		return $output;
	}
}
