# Privacy

Shortlinks sends no telemetry and uses no external analytics, GeoIP, fonts, maps or title service. By default it stores no full IP address, raw User-Agent, query string from a referrer, or unauthenticated identity.

When statistics are enabled, a detailed raw event can contain UTC time, link ID, a daily/link-scoped HMAC visitor value, sanitised referrer classification/domain, browser and OS family plus major version, device type, country/region from a local administrator-supplied MMDB, bot flag, outcome, and optionally the signed-in user ID. The source IP exists only during the request for HMAC/Geo lookup and is discarded. Counts-only mode, `DNT: 1`, and GPC store only link ID, UTC time, and the non-identifying `counted` outcome so historical totals still work; these rows never contain visitor, referrer, user-agent, user, or geographic fields and are excluded from the detailed click log.

The HMAC secret is stored as sensitive app configuration and rotated by a background job. Scoping by day and link prevents stable cross-link identifiers. Rotation also limits historical linkability. Full referrer mode is an explicit administrator choice; credentials, fragments and common sensitive parameters are removed before storage.

Default retention is 90 days for raw clicks, 365 days for daily aggregates, 180 days for audit data and 30 days for trash. Administrators should shorten these values to match local purpose and legal basis, document any use of authenticated-user logging, and configure cron so deletion occurs. Data visible through export follows the same server-side ownership/share checks as the UI.

The app itself does not provide a legal basis, consent text or data-processing policy. Operators remain responsible for transparency, access/deletion requests, backup retention and regional law.
