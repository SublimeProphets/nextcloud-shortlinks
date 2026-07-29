$ErrorActionPreference = 'Stop'

$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$StageRoot = [IO.Path]::GetFullPath((Join-Path $Repo 'build\appstore'))
$Stage = [IO.Path]::GetFullPath((Join-Path $StageRoot 'shortlinks'))
$ExpectedStage = [IO.Path]::GetFullPath((Join-Path $Repo 'build\appstore\shortlinks'))
if ($Stage -ne $ExpectedStage) { throw "Refusing unexpected staging path '$Stage'." }

[xml]$Info = Get-Content -Raw -Encoding UTF8 (Join-Path $Repo 'appinfo\info.xml')
$Version = [string]$Info.info.version
if ($Version -notmatch '^\d+\.\d+\.\d+(?:[.-][A-Za-z0-9.-]+)?$') { throw 'Could not read a safe semantic version from appinfo/info.xml.' }

if (Test-Path -LiteralPath $Stage) { Remove-Item -LiteralPath $Stage -Recurse -Force }
New-Item -ItemType Directory -Path $Stage -Force | Out-Null
$Items = @('appinfo', 'css', 'docs', 'img', 'js', 'l10n', 'lib', 'templates', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'README.md', 'SECURITY.md', 'composer.json', 'composer.lock')
foreach ($Item in $Items) { Copy-Item -LiteralPath (Join-Path $Repo $Item) -Destination $Stage -Recurse -Force }
Remove-Item -LiteralPath (Join-Path $Stage 'docs\development.md') -Force -ErrorAction SilentlyContinue

if (Get-ChildItem (Join-Path $Stage 'js'), (Join-Path $Stage 'css') -Recurse -File -Filter '*.map') { throw 'Source maps must not be included in the release package.' }
Push-Location $Stage
try {
    composer install --no-dev --classmap-authoritative --no-interaction --no-progress --no-scripts
    if ($LASTEXITCODE -ne 0) { throw 'Production Composer installation failed.' }
} finally {
    Pop-Location
}
Remove-Item -LiteralPath (Join-Path $Stage 'composer.json'), (Join-Path $Stage 'composer.lock') -Force

$EpochText = if ($env:SOURCE_DATE_EPOCH) { $env:SOURCE_DATE_EPOCH } else { git -C $Repo log -1 --format=%ct }
if ($LASTEXITCODE -ne 0 -or $EpochText -notmatch '^\d+$') { throw 'SOURCE_DATE_EPOCH must be an integer Unix timestamp.' }
$Timestamp = [DateTimeOffset]::FromUnixTimeSeconds([long]$EpochText).UtcDateTime
Get-ChildItem -LiteralPath $Stage -Recurse -Force -File | ForEach-Object { $_.LastWriteTimeUtc = $Timestamp }
Get-ChildItem -LiteralPath $Stage -Recurse -Force -Directory | Sort-Object FullName -Descending | ForEach-Object { $_.LastWriteTimeUtc = $Timestamp }
(Get-Item -LiteralPath $Stage).LastWriteTimeUtc = $Timestamp

$Artifact = Join-Path $StageRoot "shortlinks-$Version.tar.gz"
$Checksum = "$Artifact.sha512"
foreach ($Path in @($Artifact, $Checksum)) { if (Test-Path -LiteralPath $Path) { Remove-Item -LiteralPath $Path -Force } }
tar -czf $Artifact -C $StageRoot shortlinks
if ($LASTEXITCODE -ne 0) { throw 'Archive creation failed.' }
$Hash = (Get-FileHash -LiteralPath $Artifact -Algorithm SHA512).Hash.ToLowerInvariant()
[IO.File]::WriteAllText($Checksum, "$Hash  $([IO.Path]::GetFileName($Artifact))`n", [Text.UTF8Encoding]::new($false))
Write-Output $Artifact
Write-Output $Checksum
