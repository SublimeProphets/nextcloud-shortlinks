$ErrorActionPreference = 'Stop'
$project = if ($env:COMPOSE_PROJECT_NAME) { $env:COMPOSE_PROJECT_NAME } else { 'nextcloud-shortlinks-dev' }
if ($project -ne 'nextcloud-shortlinks-dev') {
    throw "Refusing to remove volumes for unexpected project '$project'."
}
docker compose -p $project config | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Compose configuration is invalid.' }
docker compose -p $project down --volumes --remove-orphans
Write-Host "Removed only containers, networks and named volumes belonging to '$project'."
