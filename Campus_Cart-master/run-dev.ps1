# PowerShell script to run web and server without Docker. Double-clicking .ps1 may be blocked by execution policy; run from an elevated PowerShell or run via .\run-dev.bat instead.

Write-Host "Starting Campus Cart (web + server) without Docker..."

Push-Location "$PSScriptRoot\server"
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
    $env:PORT = "4002"
    $env:WS_PORT = "4003"
    Start-Process -FilePath pwsh -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\\server'; pnpm dev" -NoNewWindow:$false
} else {
    npm install
    $env:PORT = "4002"
    $env:WS_PORT = "4003"
    Start-Process -FilePath cmd -ArgumentList "/k","cd /d $PSScriptRoot\\server && npm run dev"
}
Pop-Location

Push-Location "$PSScriptRoot\web"
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
    Start-Process -FilePath pwsh -ArgumentList "-NoExit","-Command","cd '$PSScriptRoot\\web'; pnpm dev" -NoNewWindow:$false
} else {
    npm install
    Start-Process -FilePath cmd -ArgumentList "/k","cd /d $PSScriptRoot\\web && npm run dev"
}
Pop-Location

Write-Host "Launched web and server. Open http://localhost:3000 (or the port Next reports)"
Pause
