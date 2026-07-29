<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

final class Version1100Date20260729143000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		$table = $schema->getTable('shortlinks_folders');
		if (!$table->hasColumn('icon')) {
			$table->addColumn('icon', 'string', ['length' => 32, 'notnull' => true, 'default' => 'folder']);
		}
		return $schema;
	}
}
