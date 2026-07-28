#!/usr/bin/env bash
set -euo pipefail

project="${COMPOSE_PROJECT_NAME:-nextcloud-shortlinks-dev}"
if [ "$project" != "nextcloud-shortlinks-dev" ]; then
  echo "Refusing to remove volumes for unexpected project '$project'." >&2
  exit 2
fi
docker compose -p "$project" config >/dev/null
docker compose -p "$project" down --volumes --remove-orphans
echo "Removed only containers, networks and named volumes belonging to '$project'."
