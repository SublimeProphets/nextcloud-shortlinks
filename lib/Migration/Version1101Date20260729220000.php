<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Restore the sequential counter for installations that skipped the earlier seed migration. */
final class Version1101Date20260729220000 extends SimpleMigrationStep {
	public function __construct(
		private readonly IDBConnection $db,
	) {
	}

	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		$select = $this->db->getQueryBuilder();
		$select->select($select->func()->count('counter_name', 'count'))
			->from('shortlinks_counters')
			->where($select->expr()->eq('counter_name', $select->createNamedParameter('sequential')));
		if ((int)$select->executeQuery()->fetchOne() > 0) {
			return;
		}

		$insert = $this->db->getQueryBuilder();
		$insert->insert('shortlinks_counters')->values([
			'counter_name' => $insert->createNamedParameter('sequential'),
			'counter_value' => $insert->createNamedParameter(0, IQueryBuilder::PARAM_INT),
		])->executeStatement();
	}
}
