@echo off
echo ========================================
echo   IUSO Platform - Arret Docker
echo ========================================
echo.
echo Arret des services Supabase...

docker-compose down

echo.
echo Services arretes avec succes!
echo.
pause 