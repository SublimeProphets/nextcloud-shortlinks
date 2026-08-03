<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/** Add link media styling and the shareable Pages feature. */
final class Version1500Date20260803090000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if ($schema->hasTable('shortlinks_links')) {
			$links = $schema->getTable('shortlinks_links');
			foreach (['thumbnail_path' => 4000, 'media_path' => 4000, 'media_mime' => 128, 'color' => 7] as $column => $length) {
				if (!$links->hasColumn($column)) {
					$links->addColumn($column, 'string', ['length' => $length, 'notnull' => false]);
				}
			}
		}

		if (!$schema->hasTable('shortlinks_pages')) {
			$table = $schema->createTable('shortlinks_pages');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('slug', 'string', ['length' => 128, 'notnull' => true]);
			$table->addColumn('slug_hash', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('title', 'string', ['length' => 255, 'notnull' => true]);
			$table->addColumn('lead', 'text', ['notnull' => false]);
			$table->addColumn('access_mode', 'string', ['length' => 24, 'notnull' => true, 'default' => 'private']);
			$table->addColumn('password_hash', 'string', ['length' => 255, 'notnull' => false]);
			$table->addColumn('starts_at', 'bigint', ['notnull' => false]);
			$table->addColumn('expires_at', 'bigint', ['notnull' => false]);
			$table->addColumn('folder_ids', 'text', ['notnull' => true]);
			$table->addColumn('tag_ids', 'text', ['notnull' => true]);
			$table->addColumn('link_ids', 'text', ['notnull' => true]);
			$table->addColumn('user_ids', 'text', ['notnull' => true]);
			$table->addColumn('group_ids', 'text', ['notnull' => true]);
			$table->addColumn('layout', 'string', ['length' => 24, 'notnull' => true, 'default' => 'cards']);
			$table->addColumn('grouping', 'string', ['length' => 24, 'notnull' => true, 'default' => 'none']);
			$table->addColumn('visible_fields', 'text', ['notnull' => true]);
			$table->addColumn('theme_json', 'text', ['notnull' => true]);
			$table->addColumn('header_json', 'text', ['notnull' => true]);
			$table->addColumn('footer_json', 'text', ['notnull' => true]);
			$table->addColumn('is_active', 'boolean', ['notnull' => true, 'default' => true]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('updated_at', 'bigint', ['notnull' => true]);
			$table->addColumn('deleted_at', 'bigint', ['notnull' => false]);
			$table->addColumn('entity_version', 'integer', ['notnull' => true, 'default' => 1]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['slug_hash'], 'sl_page_slug_uniq');
			$table->addIndex(['owner_uid', 'deleted_at', 'updated_at'], 'sl_page_owner_list');
			$table->addIndex(['is_active', 'starts_at', 'expires_at'], 'sl_page_availability');
		}

		return $schema;
	}
}
