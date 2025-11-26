@echo off
REM Quick Start Script for Cstyle (Windows PowerShell)

echo.
echo ==========================================
echo.  CStyle - E-Commerce Setup
echo ==========================================
echo.

REM Check Node.js
echo [*] Checking prerequisites...
where node >nul 2>nul
if errorlevel 1 (
    echo [-] Node.js not found. Please install Node.js v18+
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [-] npm not found.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo [+] Node.js %NODE_VERSION% found
echo [+] npm %NPM_VERSION% found
echo.

REM Install dependencies
echo [*] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [-] npm install failed
    pause
    exit /b 1
)
echo [+] Dependencies installed
echo.

REM Seed database
echo [*] Seeding database...
call npm run seed
if errorlevel 1 (
    echo [-] Database seeding failed. Make sure MongoDB is running.
    echo    Start MongoDB service or use: mongod
    pause
    exit /b 1
)
echo [+] Database seeded
echo.

REM Start dev server
echo [*] Starting development server...
echo    Open: http://localhost:3000
echo.
echo Default Credentials:
echo    Admin: admin@cstyle.com / admin123
echo    User:  user@example.com / user123
echo.

call npm run dev
pause
