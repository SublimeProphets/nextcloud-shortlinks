<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Add files and contact snapshots as content sources for Pages. */
final class Version1600Date20260803120000 extends SimpleMigrationStep {
	public function __construct(
		private readonly IDBConnection $db,
	) {
	}

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('shortlinks_pages')) {
			return $schema;
		}

		$table = $schema->getTable('shortlinks_pages');
		if (!$table->hasColumn('file_paths')) {
			$table->addColumn('file_paths', 'text', ['notnull' => false]);
		}
		if (!$table->hasColumn('contacts_json')) {
			$table->addColumn('contacts_json', 'text', ['notnull' => false]);
		}
		return $schema;
	}

	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		foreach (['file_paths', 'contacts_json'] as $column) {
			$qb = $this->db->getQueryBuilder();
			$qb->update('shortlinks_pages')
				->set($column, $qb->createNamedParameter('[]'))
				->where($qb->expr()->isNull($column))
				->executeStatement();
		}
	}
}
