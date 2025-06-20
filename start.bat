@echo off
echo ========================================
echo   IUSO Platform - Demarrage
echo ========================================
echo.
echo Verification de l'environnement...

if not exist .env (
    echo ERREUR: Fichier .env manquant!
    echo Veuillez configurer Supabase d'abord.
    pause
    exit /b 1
)

echo Configuration Supabase trouvee.
echo.
echo Demarrage du serveur de developpement...
echo.
echo URL: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================

npm run dev 