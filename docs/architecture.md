# Architecture

## Components

HTTP requests enter thin App Framework controllers. Services own transactions and domain rules, `LinkPolicy` centralises view/edit decisions, validators reject invalid aliases and URLs, and `QBMapper` classes contain database-independent queries. Providers isolate alias generation, User-Agent parsing and GeoIP. Vue 3 consumes only the versioned OCS API. All framework dependencies arrive through constructor injection.

The public redirect flow is: exact slug hash lookup → lifecycle checks → access check → current URL-policy validation → typed pre-redirect event → atomic guarded counter increment → best-effort click event → typed post-redirect event → `RedirectResponse`. Analytics failure is deliberately fail-open after authorisation. Click-limit enforcement is in the same conditional database update as the counter increment.

## Key decisions

- Aliases are ASCII and case-sensitive. A SHA-256 `slug_hash` unique index gives identical byte-exact uniqueness on SQLite, MariaDB and PostgreSQL regardless of database collation.
- Generated aliases are reserved through the database unique constraint. Sequential modes use an atomic counter table; random mode uses `random_int`.
- External short domains are presentation/proxy configuration only. Canonical app routing remains `/apps/shortlinks/r/{slug}`, generated through `IURLGenerator`.
- Ownership is immutable in normal APIs. Transfer is an explicit admin OCC operation. Shares grant view or edit management; redirect access is evaluated separately.
- All timestamps are Unix UTC seconds. Optimistic `entity_version` prevents lost updates.
- Raw events are retained for a bounded interval and transformed into daily aggregates. Redirects never make network calls; GeoIP and UA parsing are local.
- Events and provider interfaces are extension points; arbitrary PHP plugin loading is intentionally unsupported.

## Public API boundary

Runtime code imports `OCP\\` interfaces, PSR interfaces and bundled Composer libraries. It does not import `OC\\` implementation classes, query tables owned by other apps, use service locators, or register global root routes.

## Operational boundaries

The request path writes one guarded counter update and, when enabled, one compact event. Aggregation, retention cleanup and visitor-secret rotation run as non-parallel background jobs. Imports are bounded to 5 MiB/5,000 synchronous rows. List endpoints cap pages at 200 items and bulk updates at 200 IDs.
