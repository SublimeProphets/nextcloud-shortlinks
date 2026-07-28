# Upgrade and migration

Before upgrade, back up the database and Nextcloud configuration, finish running imports, and record `occ shortlinks:health`. Install the new signed app archive, run `occ upgrade`, enable the app, then run health and a redirect smoke test. Do not manually edit Shortlinks tables.

Database changes are forward-only `SimpleMigrationStep` classes. A migration already shipped in an App Store release is immutable. Downgrades that cross a schema migration are unsupported; restore the matching backup instead. Background aggregation is idempotent by daily unique dimensions and can be rebuilt with the documented OCC command.
