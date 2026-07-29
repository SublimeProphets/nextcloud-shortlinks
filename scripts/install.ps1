param(
    [ValidateSet('nextcloud34', 'nextcloud35', 'nextcloud-postgres', 'nextcloud-sqlite')]
    [string]$Service = 'nextcloud34'
)
$ErrorActionPreference = 'Stop'

for ($attempt = 1; $attempt -le 60; $attempt++) {
    docker compose exec -T -u www-data $Service php occ status --output=json 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    if ($attempt -eq 60) { throw 'Nextcloud did not become ready.' }
    Start-Sleep -Seconds 5
}
# Docker Desktop can create the parent of the nested Shortlinks bind mount as
# root. Nextcloud declares custom_apps writable, so restore the expected owner.
docker compose exec -T -u root $Service chown www-data:www-data /var/www/html/custom_apps
if ($LASTEXITCODE -ne 0) { throw 'Could not make the Nextcloud custom_apps directory writable.' }
docker compose exec -T -u www-data $Service php occ app:enable shortlinks
docker compose exec -T -u www-data $Service php occ group:add shortlinks-testers
foreach ($user in @('alice', 'bob')) {
    $env:OC_PASS = "$user-dev-only"
    docker compose exec -T -e OC_PASS -u www-data $Service php occ user:add --password-from-env --group=shortlinks-testers $user
}
Remove-Item Env:OC_PASS -ErrorAction SilentlyContinue
docker compose exec -T -u www-data $Service php occ background:cron
docker compose exec -T -u www-data $Service php occ shortlinks:health
Write-Host 'Ready at http://localhost:8080'
