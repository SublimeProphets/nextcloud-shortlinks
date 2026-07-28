# Administrator guide

Enable the app with `occ app:enable shortlinks`, configure system cron, then review **Administration settings → Shortlinks**. The safest baseline is random seven-character aliases, public creation off, HTTP(S) only, title fetching off, statistics with DNT/GPC respected, domain-only referrers, authenticated-user logging off and admin-wide management off.

Domain rules are exact names or `*.example.org` subdomain rules. Blocklist wins over allowlist. The public base URL must be absolute HTTP(S), contain no credentials/query/fragment and should be served only by a trusted reverse proxy. Store a GeoLite2-compatible `.mmdb` locally; the file is not bundled. Check it with `occ shortlinks:geoip:check`.

Set retention values and run cron at least every five minutes. Use `occ shortlinks:health`, `shortlinks:stats:aggregate`, `shortlinks:stats:cleanup`, `shortlinks:stats:rebuild`, `shortlinks:import`, `shortlinks:export`, `shortlinks:owner:transfer`, and `shortlinks:seed --user=<uid>`. Owner transfer is the explicit offboarding path; choose a successor before deleting an account.

Public creation and legacy compatibility settings are reserved off-by-default policy switches; this release intentionally exposes no anonymous creation or credential-in-URL legacy endpoint. External automation should use the authenticated OCS API with a Nextcloud app password. The token table is reserved for a separately reviewable optional personal-token feature; no custom authentication bypass is active.

Monitor `nextcloud.log` for messages tagged `shortlinks`, cron status and database growth. Back up app tables and app configuration with the normal Nextcloud/database procedure. Never place the visitor secret, password hashes or API credentials in support bundles.
