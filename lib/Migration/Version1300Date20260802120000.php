<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Persist discovered share-thumbnail locations and their last refresh time. */
final class Version1300Date20260802120000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('shortlinks_links')) {
			return null;
		}

		$table = $schema->getTable('shortlinks_links');
		if (!$table->hasColumn('thumbnail_url')) {
			$table->addColumn('thumbnail_url', 'text', ['notnull' => false]);
		}
		if (!$table->hasColumn('thumbnail_refreshed_at')) {
			$table->addColumn('thumbnail_refreshed_at', 'bigint', ['notnull' => false]);
		}

		return $schema;
	}
}
