@echo off
REM Run web and server without Docker (uses in-memory Redis fallback).
REM Double-click this file or run from cmd.

SETLOCAL

REM Change directory to server and install if needed, then start dev server in a new window
start "CampusCart - server" cmd /k "cd /d %~dp0server && if exist pnpm.cmd (pnpm install && set PORT=4002&& set WS_PORT=4003&& pnpm dev) else (npm install && set PORT=4002&& set WS_PORT=4003&& npm run dev)"

REM Change directory to web and start Next dev in a new window
start "CampusCart - web" cmd /k "cd /d %~dp0web && if exist pnpm.cmd (pnpm install && pnpm dev) else (npm install && npm run dev)"

echo Started web and server in separate windows. Close those windows to stop.
pause
ENDLOCAL
