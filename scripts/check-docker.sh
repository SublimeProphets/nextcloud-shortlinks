#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
	echo 'Docker CLI was not found. Install and start Docker Desktop/Engine.' >&2
	exit 1
fi

if ! docker info >/dev/null 2>&1; then
	echo 'Docker is installed, but its daemon is unavailable. Start Docker Desktop/Engine and wait until it is ready.' >&2
	exit 1
fi

echo 'Docker engine is ready.'
