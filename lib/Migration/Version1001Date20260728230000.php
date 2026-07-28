<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Seed counter rows so PostgreSQL never has to recover from an in-transaction upsert conflict. */
final class Version1001Date20260728230000 extends SimpleMigrationStep {
	public function __construct(
		private readonly IDBConnection $db,
	) {
	}

	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		foreach (['sequential'] as $name) {
			$select = $this->db->getQueryBuilder();
			$select->select($select->func()->count('counter_name', 'count'))
				->from('shortlinks_counters')
				->where($select->expr()->eq('counter_name', $select->createNamedParameter($name)));
			if ((int)$select->executeQuery()->fetchOne() > 0) {
				continue;
			}
			$insert = $this->db->getQueryBuilder();
			$insert->insert('shortlinks_counters')->values([
				'counter_name' => $insert->createNamedParameter($name),
				'counter_value' => $insert->createNamedParameter(0, IQueryBuilder::PARAM_INT),
			])->executeStatement();
		}
	}
}
