@echo off
REM Run full stack using Docker Compose (Postgres + Redis) and start server + web.
REM Requires Docker Desktop installed and running.

SETLOCAL

REM Start Docker Compose for server services
cd /d %~dp0server
necho Starting Docker Compose (Postgres + Redis)...
docker compose -f .\server\docker-compose-dev.yml up --build -d || (
  echo Docker command failed. Ensure Docker Desktop is installed and running.
  pause
  exit /b 1
)

echo Docker services started.
echo Starting server in new window...
start "CampusCart - server" cmd /k "cd /d %~dp0server && if exist pnpm.cmd (pnpm install && set PORT=4000&& set WS_PORT=4001&& pnpm db:migrate && pnpm dev) else (npm install && set PORT=4000&& set WS_PORT=4001&& npm run db:migrate && npm run dev)"

echo Starting web in new window...
start "CampusCart - web" cmd /k "cd /d %~dp0web && if exist pnpm.cmd (pnpm install && pnpm dev) else (npm install && npm run dev)"

echo All started. Open http://localhost:3000 (or the port Next reports).
pause
ENDLOCAL
