# Data model

| Table | Purpose | Important indexes |
|---|---|---|
| `shortlinks_links` | Link state and counter | unique `slug_hash`; owner/deleted/update; owner/folder; owner/target hash; active/expiry |
| `shortlinks_folders` | Per-owner tree | owner/parent/position; unique owner/`parent_key`/normalised name |
| `shortlinks_tags` | Per-owner tags | unique owner/normalised name |
| `shortlinks_link_tags` | many-to-many assignment | composite primary key; reverse tag lookup |
| `shortlinks_permissions` | user/group read or edit share | unique link/principal; principal lookup |
| `shortlinks_clicks` | privacy-filtered raw events | link/time; retention time; link/visitor hash |
| `shortlinks_daily_stats` | daily dimension aggregates | unique link/day/dimension/value; retention day |
| `shortlinks_audit` | management history | owner/time; link/time |
| `shortlinks_api_tokens` | reserved schema for optional scoped tokens | unique prefix; owner/revocation |
| `shortlinks_import_jobs` | bounded/background import state | owner/created |
| `shortlinks_counters` | atomic sequential aliases | counter name primary key |

BigInt IDs and integer UTC timestamps avoid database-specific temporal behaviour. Nullable parent IDs are paired with non-null `parent_key` (`0` for root) because SQL unique constraints treat `NULL` differently across engines. No index covers unbounded target, description, metadata or referrer text. Target hashes support duplicate-policy checks without indexing long URLs.

Permanent deletion removes link-tag, permission, click and aggregate rows transactionally, detaches the link ID from retained audit records, and then removes the link. Folder deletion explicitly keeps links by detaching them or moves them to trash. Cleanup removes expired raw data, aggregates, audits and trash in bounded batches; aggregate retention can exceed raw retention.

The initial migration is `Version1000Date20260728120000`. Once version 1.0.0 is published it must never be edited; future changes require a new monotonic migration.
