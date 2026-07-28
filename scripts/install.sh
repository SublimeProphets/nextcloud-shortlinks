#!/usr/bin/env bash
set -euo pipefail

service="${1:-nextcloud34}"
case "$service" in
  nextcloud34|nextcloud35|nextcloud-postgres|nextcloud-sqlite) ;;
  *) echo "Unsupported service: $service" >&2; exit 2 ;;
esac

for attempt in $(seq 1 60); do
  if docker compose exec -T -u www-data "$service" php occ status --output=json 2>/dev/null | grep -q '"installed":true'; then
    break
  fi
  if [ "$attempt" -eq 60 ]; then echo "Nextcloud did not become ready" >&2; exit 1; fi
  sleep 5
done

docker compose exec -T -u www-data "$service" php occ app:enable shortlinks
docker compose exec -T -u www-data "$service" php occ group:add shortlinks-testers || true
for user in alice bob; do
  docker compose exec -T -e OC_PASS="${user}-dev-only" -u www-data "$service" php occ user:add --password-from-env --group=shortlinks-testers "$user" || true
done
docker compose exec -T -u www-data "$service" php occ background:cron
docker compose exec -T -u www-data "$service" php occ shortlinks:health
echo "Ready: http://localhost:${NEXTCLOUD_PORT:-8080} (development accounts are documented in README.md)"
