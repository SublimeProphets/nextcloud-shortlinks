#!/usr/bin/env bash
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
stage_root="$repo/build/appstore"
stage="$stage_root/shortlinks"
version="$(sed -n 's:.*<version>\([^<]*\)</version>.*:\1:p' "$repo/appinfo/info.xml" | head -n 1)"

if [ -z "$version" ] || ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][A-Za-z0-9.-]+)?$ ]]; then
  echo "Could not read a safe semantic version from appinfo/info.xml." >&2
  exit 2
fi
case "$stage" in
  "$repo/build/appstore/shortlinks") ;;
  *) echo "Refusing unexpected staging path '$stage'." >&2; exit 2 ;;
esac

rm -rf -- "$stage"
mkdir -p "$stage"
for item in appinfo css docs img js l10n lib templates CHANGELOG.md CONTRIBUTING.md LICENSE README.md SECURITY.md composer.json composer.lock; do
  cp -a "$repo/$item" "$stage/"
done
rm -f -- "$stage/docs/development.md"

if find "$stage/js" "$stage/css" -type f -name '*.map' -print -quit | grep -q .; then
  echo "Source maps must not be included in the release package." >&2
  exit 2
fi
composer install --working-dir="$stage" --no-dev --classmap-authoritative --no-interaction --no-progress --no-scripts
rm -f -- "$stage/composer.json" "$stage/composer.lock"

epoch="${SOURCE_DATE_EPOCH:-$(git -C "$repo" log -1 --format=%ct)}"
if ! [[ "$epoch" =~ ^[0-9]+$ ]]; then
  echo "SOURCE_DATE_EPOCH must be an integer Unix timestamp." >&2
  exit 2
fi
find "$stage" -exec touch -h -d "@$epoch" {} +

artifact="$stage_root/shortlinks-$version.tar.gz"
checksum="$artifact.sha512"
rm -f -- "$artifact" "$checksum"
tar --sort=name --mtime="@$epoch" --owner=0 --group=0 --numeric-owner -C "$stage_root" -cf - shortlinks | gzip -n -9 > "$artifact"
(cd "$stage_root" && sha512sum "$(basename "$artifact")" > "$(basename "$checksum")")
echo "$artifact"
echo "$checksum"
