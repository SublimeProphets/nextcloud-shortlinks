# API

The primary API is OCS JSON below `/ocs/v2.php/apps/shortlinks/api/v1`. Authenticate with a Nextcloud session or app password and send `OCS-APIRequest: true`. Browser mutations use the normal Nextcloud request token. Responses use `ocs.meta` plus a data envelope containing either `data` or `{error:{code,message,fields}}`.

`links` supports bounded pagination, search/system/folder filters, CRUD, restore, clone and a 200-ID bulk limit. Updates require the current `version` and return conflict on stale writes. `expand/{slug}` is authenticated and enforces view permission; it is not the public redirect. Folder, tag, share, stats, click-log, activity, import/export, bookmarklet, title-fetch and capabilities endpoints are described in [openapi.yaml](openapi.yaml).

Example:

```bash
curl -u 'alice:APP_PASSWORD' -H 'OCS-APIRequest: true' -H 'Content-Type: application/json' \
  -d '{"targetUrl":"https://example.org","title":"Example"}' \
  'https://cloud.example/ocs/v2.php/apps/shortlinks/api/v1/links?format=json'
```

Clients must not put credentials or tokens in URLs. There is no permissive CORS or JSONP. HTTP 400 means validation, 401/403 authentication/authorisation, 404 hidden/not found, 409 uniqueness/concurrency, 429 rate limit, and 500 an unexpected server failure. Public resolution uses `/apps/shortlinks/r/{slug}` and exposes no management/statistics response.
