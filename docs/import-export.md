# Import and export

Authenticated users can export visible links as UTF-8 CSV or versioned JSON. CSV fields beginning with spreadsheet formula markers are prefixed with an apostrophe. Export pages are bounded and never bypass `LinkPolicy`.

Imports accept at most 5 MiB and 5,000 records per request. Use dry-run first. CSV needs a header and supports `slug`, `target_url`/`url`, `title`, `description`, `active`, `favorite`, `redirect_status` and `access_mode`; JSON accepts an array or `{ "links": [...] }`. Conflict strategy is `skip` or `new-alias`. Every non-dry-run row passes the same URL, domain, alias, quota and permission rules as interactive creation.

For larger controlled migrations, use `occ shortlinks:import` in a maintenance window and retain the original file outside the web root. XML and ZIP are intentionally not accepted, eliminating XXE and decompression-bomb classes.
