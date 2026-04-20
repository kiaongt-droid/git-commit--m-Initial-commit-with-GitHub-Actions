@echo off
cd /d "%~dp0website-copy"
echo Starting Website Copy on http://127.0.0.1:8081/
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '..\serve.ps1', '-Port', '8081'; Start-Sleep -Milliseconds 500; Start-Process 'http://127.0.0.1:8081/'"
