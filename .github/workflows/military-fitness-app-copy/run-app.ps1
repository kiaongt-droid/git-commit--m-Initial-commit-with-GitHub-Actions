param(
  [int]$Port = 8080
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root

function Get-PowerShellExe {
  if (Get-Command pwsh -ErrorAction SilentlyContinue) { return 'pwsh' }
  if (Get-Command powershell -ErrorAction SilentlyContinue) { return 'powershell' }
  return $null
}

$psExe = Get-PowerShellExe
if (-not $psExe) {
  Write-Error 'No PowerShell executable found. Please run this script from Windows with PowerShell available.'
  Pop-Location
  exit 1
}

Write-Host "Starting Military Fitness Hub on http://127.0.0.1:$Port/"
Start-Process -FilePath $psExe -ArgumentList "-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ".\serve.ps1", "-Port", "$Port"
Start-Sleep -Milliseconds 500
Start-Process "http://127.0.0.1:$Port/"

Pop-Location
