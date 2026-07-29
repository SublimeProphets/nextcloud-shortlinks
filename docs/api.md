# API

The primary API is OCS JSON below `/ocs/v2.php/apps/shortlinks/api/v1`. Authenticate with a Nextcloud session or app password and send `OCS-APIRequest: true`. Browser mutations use the normal Nextcloud request token. Responses use `ocs.meta` plus a data envelope containing either `data` or `{error:{code,message,fields}}`.

`links` supports bounded pagination, search/system/folder/tag filters, sorting, CRUD, restore, clone and a 200-ID bulk limit. Updates require the current `version` and return conflict on stale writes. `expand/{slug}` is authenticated and enforces view permission; it is not the public redirect. Recipient lookup is exposed through the bounded `/principals` endpoint. Link statistics support hourly (maximum seven days), daily, weekly and monthly series, previous-period comparison, dimensions, a paginated privacy-reduced click log and CSV/JSON export. Folder, tag, share, stats, activity, import/export, bookmarklet, title-fetch and capabilities endpoints are described in the human-maintained [OpenAPI YAML](openapi.yaml); the reproducibly generated [OpenAPI JSON](../openapi.json) is authoritative for the implemented OCS controllers.

Example:

```bash
curl -u 'alice:APP_PASSWORD' -H 'OCS-APIRequest: true' -H 'Content-Type: application/json' \
  -d '{"targetUrl":"https://example.org","title":"Example"}' \
  'https://cloud.example/ocs/v2.php/apps/shortlinks/api/v1/links?format=json'
```

Clients must not put credentials or tokens in URLs. There is no permissive CORS or JSONP. HTTP 400 means a malformed request, 401/403 authentication/authorisation, 404 hidden/not found, 409 uniqueness/concurrency, 422 validation, 429 rate limit, and 500 an unexpected server failure. Public resolution uses `/apps/shortlinks/r/{slug}` and exposes no management/statistics response.

Administrators may explicitly enable the rate-limited public creation endpoint `POST /apps/shortlinks/public/v1/shorten`. It is disabled by default, requires a configured owner UID, accepts only `targetUrl`, optional `slug`, `title` and `description`, and always creates a public 302 link. Public creation group restrictions apply to authenticated callers; an empty group list also permits guests. Do not expose this endpoint without an upstream abuse-control policy.
