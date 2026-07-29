$ErrorActionPreference = 'Stop'

function Stop-WithMessage([string]$Message) {
	Write-Host $Message -ForegroundColor Red
	exit 1
}

$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
if ($null -eq $dockerCommand) {
	$candidates = @(
		"$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe",
		"$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe"
	)
	$dockerPath = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
	if ($null -eq $dockerPath) {
		Stop-WithMessage 'Docker CLI was not found. Install Docker Desktop, start it, and open a new PowerShell window.'
	}
} else {
	$dockerPath = $dockerCommand.Source
}

$previousErrorPreference = $ErrorActionPreference
$ErrorActionPreference = 'SilentlyContinue'
$null = & $dockerPath info *> $null
$dockerExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorPreference

if ($dockerExitCode -ne 0) {
	$ErrorActionPreference = 'SilentlyContinue'
	$null = & wsl.exe --status *> $null
	$wslExitCode = $LASTEXITCODE
	$ErrorActionPreference = $previousErrorPreference
	if ($wslExitCode -ne 0) {
		Stop-WithMessage 'Docker is installed, but WSL 2 is unavailable. Open PowerShell as Administrator, run "wsl --install", reboot Windows, then start Docker Desktop.'
	}

	$desktopRunning = Get-Process -Name 'Docker Desktop', 'com.docker.backend' -ErrorAction SilentlyContinue
	if ($null -eq $desktopRunning) {
		Stop-WithMessage 'Docker Desktop is installed but not running. Start Docker Desktop and wait until its engine reports that it is running.'
	}

	Stop-WithMessage 'Docker Desktop is running, but its Linux engine is not ready. Wait for startup to finish, select Linux containers, and retry.'
}

Write-Host 'Docker engine is ready.'
