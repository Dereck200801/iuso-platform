@echo off
echo ========================================
echo   IUSO Platform - Demarrage Docker Desktop
echo ========================================
echo.

echo Verification de Docker Desktop...

REM Vérifier si Docker Desktop est déjà en cours d'exécution
docker ps >nul 2>&1
if %errorlevel% == 0 (
    echo Docker Desktop est deja en cours d'execution.
    goto :start_services
)

echo Docker Desktop n'est pas en cours d'execution.
echo Demarrage de Docker Desktop...

REM Démarrer Docker Desktop
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo Attente du demarrage de Docker Desktop...
echo Cela peut prendre 1-2 minutes...

:wait_loop
timeout /t 10 /nobreak >nul
docker ps >nul 2>&1
if %errorlevel% != 0 (
    echo Attente en cours...
    goto :wait_loop
)

echo.
echo Docker Desktop est maintenant pret!

:start_services
echo.
echo ========================================
echo   Demarrage des services Supabase
echo ========================================
echo.

REM Démarrer les services Supabase
docker-compose --env-file docker.env up -d

echo.
echo ========================================
echo   Services demarres avec succes!
echo ========================================
echo.
echo URLs importantes:
echo - Supabase Studio: http://localhost:3000
echo - API Supabase:    http://localhost:8000
echo - Application:     http://localhost:5174
echo.
echo Pour arreter: docker-compose down
echo.
pause 