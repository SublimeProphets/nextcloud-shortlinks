<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Add an explicit opt-in for embedding public Pages in external frames. */
final class Version1810Date20260803213000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('shortlinks_pages')) {
			return $schema;
		}

		$table = $schema->getTable('shortlinks_pages');
		if (!$table->hasColumn('allow_embedding')) {
			$table->addColumn('allow_embedding', 'boolean', ['notnull' => true, 'default' => false]);
		}
		return $schema;
	}
}
