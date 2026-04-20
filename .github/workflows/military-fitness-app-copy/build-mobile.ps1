param(
  [switch]$Android,
  [switch]$iOS
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error 'npm is not available. Install Node.js and npm before running this script.'
  exit 1
}

npm install
npm run install:capacitor

if ($Android) {
  npm run cap:add-android
}

if ($iOS) {
  npm run cap:add-ios
}

npm run cap:copy

Write-Host 'Mobile packaging setup is complete. Open the native project in Android Studio or Xcode to build.'
