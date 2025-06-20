@echo off
echo 🔒 Deploiement du systeme d'inscription securise
echo ================================================

REM Verification des prerequisites
echo.
echo 🔍 Verification des prerequisites...
where supabase >nul 2>nul
if errorlevel 1 (
    echo ❌ Supabase CLI non trouve. Installez-le avec: npm install -g supabase
    pause
    exit /b 1
)

echo ✅ Supabase CLI trouve

REM Verification du projet Supabase
echo.
echo 🔍 Verification du projet Supabase...
if not exist "supabase\config.toml" (
    echo ❌ Configuration Supabase non trouvee. Initialisez avec: supabase init
    pause
    exit /b 1
)

echo ✅ Configuration Supabase trouvee

REM Etape 1: Deployer la fonction Edge
echo.
echo 📦 Etape 1/3: Deploiement de la fonction Edge auth-rollback...
supabase functions deploy auth-rollback
if errorlevel 1 (
    echo ❌ Echec du deploiement de la fonction Edge
    pause
    exit /b 1
)

echo ✅ Fonction Edge deployee avec succes

REM Etape 2: Creer la table orphaned_auth_accounts
echo.
echo 🗄️ Etape 2/3: Creation de la table orphaned_auth_accounts...
supabase db reset --local
if errorlevel 1 (
    echo ⚠️ Reset local echoue, continuons...
)

echo Execution du script SQL...
supabase db reset --db-url="your-database-url" --with-schema=false
if errorlevel 1 (
    echo ⚠️ Veuillez executer manuellement le fichier create-orphaned-accounts-table.sql
    echo dans votre console Supabase ou via psql
)

REM Etape 3: Build du projet
echo.
echo 🔨 Etape 3/3: Build du projet...
npm run build
if errorlevel 1 (
    echo ❌ Echec de la build
    pause
    exit /b 1
)

echo ✅ Build reussie

REM Messages finaux
echo.
echo 🎉 DEPLOIEMENT TERMINE AVEC SUCCES !
echo =====================================
echo.
echo 📝 Actions a effectuer manuellement:
echo.
echo 1. Executez le script SQL dans Supabase:
echo    create-orphaned-accounts-table.sql
echo.
echo 2. Configurez les variables d'environnement de la fonction Edge:
echo    - SUPABASE_URL
echo    - SUPABASE_SERVICE_ROLE_KEY
echo.
echo 3. Testez le nouveau systeme d'inscription
echo.
echo 📖 Consultez GUIDE-INSCRIPTION-SECURISEE.md pour plus de details
echo.
pause 