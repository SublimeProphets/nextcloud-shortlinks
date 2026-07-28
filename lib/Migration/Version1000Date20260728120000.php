<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

final class Version1000Date20260728120000 extends SimpleMigrationStep {
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable('shortlinks_links')) {
			$table = $schema->createTable('shortlinks_links');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('folder_id', 'bigint', ['notnull' => false, 'unsigned' => true]);
			$table->addColumn('slug', 'string', ['length' => 128, 'notnull' => true]);
			$table->addColumn('slug_hash', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('target_url', 'text', ['notnull' => true]);
			$table->addColumn('target_hash', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('title', 'string', ['length' => 255, 'notnull' => true, 'default' => '']);
			$table->addColumn('description', 'text', ['notnull' => false]);
			$table->addColumn('is_favorite', 'boolean', ['notnull' => true, 'default' => false]);
			$table->addColumn('is_active', 'boolean', ['notnull' => true, 'default' => true]);
			$table->addColumn('access_mode', 'string', ['length' => 24, 'notnull' => true, 'default' => 'public']);
			$table->addColumn('password_hash', 'string', ['length' => 255, 'notnull' => false]);
			$table->addColumn('redirect_status', 'integer', ['notnull' => true, 'default' => 302]);
			$table->addColumn('starts_at', 'bigint', ['notnull' => false]);
			$table->addColumn('expires_at', 'bigint', ['notnull' => false]);
			$table->addColumn('click_limit', 'bigint', ['notnull' => false, 'unsigned' => true]);
			$table->addColumn('click_count', 'bigint', ['notnull' => true, 'unsigned' => true, 'default' => 0]);
			$table->addColumn('last_clicked_at', 'bigint', ['notnull' => false]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('updated_at', 'bigint', ['notnull' => true]);
			$table->addColumn('deleted_at', 'bigint', ['notnull' => false]);
			$table->addColumn('entity_version', 'integer', ['notnull' => true, 'default' => 1]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['slug_hash'], 'sl_slug_uniq');
			$table->addIndex(['slug'], 'sl_slug_display');
			$table->addIndex(['owner_uid', 'deleted_at', 'updated_at'], 'sl_owner_list');
			$table->addIndex(['owner_uid', 'folder_id'], 'sl_owner_folder');
			$table->addIndex(['owner_uid', 'target_hash'], 'sl_owner_target');
			$table->addIndex(['is_active', 'expires_at'], 'sl_active_expiry');
		}

		if (!$schema->hasTable('shortlinks_folders')) {
			$table = $schema->createTable('shortlinks_folders');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('parent_id', 'bigint', ['notnull' => false, 'unsigned' => true]);
			$table->addColumn('parent_key', 'bigint', ['notnull' => true, 'unsigned' => true, 'default' => 0]);
			$table->addColumn('name', 'string', ['length' => 128, 'notnull' => true]);
			$table->addColumn('normalized_name', 'string', ['length' => 128, 'notnull' => true]);
			$table->addColumn('position', 'integer', ['notnull' => true, 'default' => 0]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('updated_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addIndex(['owner_uid', 'parent_id', 'position'], 'sl_folder_tree');
			$table->addUniqueIndex(['owner_uid', 'parent_key', 'normalized_name'], 'sl_folder_name');
		}

		if (!$schema->hasTable('shortlinks_tags')) {
			$table = $schema->createTable('shortlinks_tags');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('name', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('normalized_name', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('color', 'string', ['length' => 7, 'notnull' => false]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('updated_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['owner_uid', 'normalized_name'], 'sl_tag_name');
		}

		if (!$schema->hasTable('shortlinks_link_tags')) {
			$table = $schema->createTable('shortlinks_link_tags');
			$table->addColumn('link_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->addColumn('tag_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->setPrimaryKey(['link_id', 'tag_id']);
			$table->addIndex(['tag_id', 'link_id'], 'sl_tag_links');
		}

		if (!$schema->hasTable('shortlinks_permissions')) {
			$table = $schema->createTable('shortlinks_permissions');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('link_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->addColumn('principal_type', 'string', ['length' => 8, 'notnull' => true]);
			$table->addColumn('principal_id', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('purpose', 'string', ['length' => 12, 'notnull' => true, 'default' => 'management']);
			$table->addColumn('permission', 'string', ['length' => 8, 'notnull' => true]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['link_id', 'purpose', 'principal_type', 'principal_id'], 'sl_perm_uniq');
			$table->addIndex(['principal_type', 'principal_id'], 'sl_perm_principal');
		}

		if (!$schema->hasTable('shortlinks_clicks')) {
			$table = $schema->createTable('shortlinks_clicks');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('link_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->addColumn('clicked_at', 'bigint', ['notnull' => true]);
			$table->addColumn('user_uid', 'string', ['length' => 64, 'notnull' => false]);
			$table->addColumn('visitor_hash', 'string', ['length' => 64, 'notnull' => false]);
			$table->addColumn('referrer_type', 'string', ['length' => 16, 'notnull' => true, 'default' => 'unknown']);
			$table->addColumn('referrer_domain', 'string', ['length' => 255, 'notnull' => false]);
			$table->addColumn('referrer_url', 'text', ['notnull' => false]);
			$table->addColumn('browser', 'string', ['length' => 64, 'notnull' => true, 'default' => 'Unknown']);
			$table->addColumn('browser_version', 'string', ['length' => 16, 'notnull' => false]);
			$table->addColumn('os', 'string', ['length' => 64, 'notnull' => true, 'default' => 'Unknown']);
			$table->addColumn('os_version', 'string', ['length' => 16, 'notnull' => false]);
			$table->addColumn('device_type', 'string', ['length' => 24, 'notnull' => true, 'default' => 'unknown']);
			$table->addColumn('country', 'string', ['length' => 2, 'notnull' => false]);
			$table->addColumn('region', 'string', ['length' => 128, 'notnull' => false]);
			$table->addColumn('is_bot', 'boolean', ['notnull' => true, 'default' => false]);
			$table->addColumn('outcome', 'string', ['length' => 24, 'notnull' => true, 'default' => 'redirected']);
			$table->setPrimaryKey(['id']);
			$table->addIndex(['link_id', 'clicked_at'], 'sl_click_time');
			$table->addIndex(['clicked_at'], 'sl_click_retention');
			$table->addIndex(['link_id', 'visitor_hash'], 'sl_click_visitor');
		}

		if (!$schema->hasTable('shortlinks_daily_stats')) {
			$table = $schema->createTable('shortlinks_daily_stats');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('link_id', 'bigint', ['notnull' => true, 'unsigned' => true]);
			$table->addColumn('day', 'string', ['length' => 10, 'notnull' => true]);
			$table->addColumn('dimension', 'string', ['length' => 24, 'notnull' => true]);
			$table->addColumn('dimension_value', 'string', ['length' => 255, 'notnull' => true]);
			$table->addColumn('clicks', 'bigint', ['notnull' => true, 'unsigned' => true, 'default' => 0]);
			$table->addColumn('unique_visitors', 'bigint', ['notnull' => true, 'unsigned' => true, 'default' => 0]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['link_id', 'day', 'dimension', 'dimension_value'], 'sl_daily_uniq');
			$table->addIndex(['day'], 'sl_daily_retention');
		}

		if (!$schema->hasTable('shortlinks_audit')) {
			$table = $schema->createTable('shortlinks_audit');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('link_id', 'bigint', ['notnull' => false, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('actor_uid', 'string', ['length' => 64, 'notnull' => false]);
			$table->addColumn('event_type', 'string', ['length' => 32, 'notnull' => true]);
			$table->addColumn('metadata', 'text', ['notnull' => false]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addIndex(['owner_uid', 'created_at'], 'sl_audit_owner');
			$table->addIndex(['link_id', 'created_at'], 'sl_audit_link');
		}

		if (!$schema->hasTable('shortlinks_api_tokens')) {
			$table = $schema->createTable('shortlinks_api_tokens');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('name', 'string', ['length' => 128, 'notnull' => true]);
			$table->addColumn('token_prefix', 'string', ['length' => 16, 'notnull' => true]);
			$table->addColumn('token_hash', 'string', ['length' => 255, 'notnull' => true]);
			$table->addColumn('scopes', 'string', ['length' => 255, 'notnull' => true]);
			$table->addColumn('expires_at', 'bigint', ['notnull' => false]);
			$table->addColumn('last_used_at', 'bigint', ['notnull' => false]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('revoked_at', 'bigint', ['notnull' => false]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['token_prefix'], 'sl_token_prefix');
			$table->addIndex(['owner_uid', 'revoked_at'], 'sl_token_owner');
		}

		if (!$schema->hasTable('shortlinks_import_jobs')) {
			$table = $schema->createTable('shortlinks_import_jobs');
			$table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true, 'unsigned' => true]);
			$table->addColumn('owner_uid', 'string', ['length' => 64, 'notnull' => true]);
			$table->addColumn('status', 'string', ['length' => 16, 'notnull' => true]);
			$table->addColumn('format', 'string', ['length' => 8, 'notnull' => true]);
			$table->addColumn('source_path', 'text', ['notnull' => false]);
			$table->addColumn('options_json', 'text', ['notnull' => false]);
			$table->addColumn('result_json', 'text', ['notnull' => false]);
			$table->addColumn('created_at', 'bigint', ['notnull' => true]);
			$table->addColumn('updated_at', 'bigint', ['notnull' => true]);
			$table->setPrimaryKey(['id']);
			$table->addIndex(['owner_uid', 'created_at'], 'sl_import_owner');
		}

		if (!$schema->hasTable('shortlinks_counters')) {
			$table = $schema->createTable('shortlinks_counters');
			$table->addColumn('counter_name', 'string', ['length' => 32, 'notnull' => true]);
			$table->addColumn('counter_value', 'bigint', ['notnull' => true, 'unsigned' => true, 'default' => 0]);
			$table->setPrimaryKey(['counter_name']);
		}

		return $schema;
	}
}
