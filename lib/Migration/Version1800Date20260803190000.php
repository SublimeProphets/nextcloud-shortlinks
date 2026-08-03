<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Store immutable snapshots for the Pages version history. */
final class Version1800Date20260803190000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('shortlinks_page_versions')) {
			$table = $schema->createTable('shortlinks_page_versions');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('page_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->addColumn('version_number', 'integer', ['notnull' => true]);
			$table->addColumn('modified_by', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('snapshot_json', 'text', ['notnull' => true]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['page_id', 'version_number'], 'sl_page_ver_unique');
			$table->addIndex(['page_id', 'created_at'], 'sl_page_ver_history');
		}
		return $schema;
	}
}
