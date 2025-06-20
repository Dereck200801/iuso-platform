@echo off
echo ========================================
echo   IUSO Platform - Demarrage Docker
echo ========================================
echo.
echo Configuration de l'environnement Supabase local...

REM Copier le fichier d'environnement
copy docker.env .env.docker

echo.
echo Demarrage des services Supabase...
echo.
echo Services qui vont demarrer:
echo - Supabase Studio (http://localhost:3000)
echo - API Gateway (http://localhost:8000)
echo - Base de donnees PostgreSQL (localhost:5432)
echo - Storage et autres services
echo.
echo Cela peut prendre quelques minutes la premiere fois...
echo.

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
echo Pour voir les logs: docker-compose logs -f
echo.
pause 