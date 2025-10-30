# Campus Cart

This is a project whose main focus is to provide an online marketplace for college students to buy and sell college-related materials. The platform is designed to make it easy for students to find what they need, sell what they don't, and connect with other students in the same college or university.

## Demo

https://github.com/user-attachments/assets/ec75c8a1-3de2-4d9e-8e0e-cfb13af71054



## What's inside?

This includes the following apps:

### Apps

- `web`: a Next.js app with Tailwind CSS
- `mobile`: a React Native app with Tailwind CSS
- `server`: a Express backend with Prisma and Postgres

## Running the project (quick start)

There are two main ways to run this project locally:

- Quick UI-only (no DB / no Redis): runs the web app only so you can view pages, layout and theme.
- Full stack (recommended): start Postgres + Redis via Docker Compose, run the server and web.

I added convenient Windows scripts you can double-click to start the project:

- `run-dev.bat` — starts the server and web without Docker (uses an in-memory Redis fallback for local dev). Useful if you don't want to install Docker. Double-click to open two command windows (server + web).
- `run-dev-docker.bat` — starts Docker Compose (Postgres + Redis) and then starts server + web. Requires Docker Desktop.
- `run-dev.ps1` — PowerShell variant for running without Docker (may be blocked by execution policy; use `run-dev.bat` instead if blocked).

Commands you can run manually (PowerShell / CMD)

1) Web-only (fast):

```powershell
Set-Location -Path .\web
pnpm install    # or: npm install
pnpm dev        # or: npm run dev
# Open http://localhost:3000 (if 3000 is busy Next may pick another port, e.g. 3001)
```

2) Full stack with Docker (recommended):

Install Docker Desktop for Windows and start it, then:

```powershell
# from repo root
docker compose -f .\server\docker-compose-dev.yml up --build -d

# in a new terminal: start server
Set-Location -Path .\server
pnpm install
pnpm db:migrate    # applies Prisma migrations
$env:PORT=4000; $env:WS_PORT=4001; pnpm dev

# in a new terminal: start web
Set-Location -Path .\web
pnpm install
pnpm dev
```

Notes and troubleshooting
- If Docker is not installed, use `run-dev.bat` to run the app without Docker (server will use an in-memory Redis emulator — good for local testing but not for production).
- If ports are in use, Next will pick a different port (e.g., 3001). Check the terminal where Next started for the final URL.
- After installing dependencies you might see `npm audit` warnings; review them before deploying to production.

For deployment and production readiness, follow the checklist in the `DEPLOYMENT.md` (coming soon). Remove the in-memory Redis fallback before production and configure a real Redis and Postgres instance using environment variables.

# Web Mockup

![campuscart_mockup](https://github.com/user-attachments/assets/0ed84545-c1c0-490d-a4f9-e0e0cf6ce646)

# Mobile Mockup

![campuscart_mobile_mockup](https://github.com/user-attachments/assets/3394f2bd-3dee-4e87-a01c-f552865f4b8f)
