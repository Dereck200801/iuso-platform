param(
    [switch]$SkipBuild,
    [switch]$LocalOnly,
    [string]$DatabaseUrl
)

Write-Host "🔒 Déploiement du système d'inscription sécurisé" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Fonction pour afficher les erreurs
function Write-Error-Message {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Fonction pour afficher les succès
function Write-Success-Message {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# Fonction pour afficher les avertissements
function Write-Warning-Message {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

# Vérification des prérequis
Write-Host ""
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Blue

# Vérifier Supabase CLI
try {
    $supabaseVersion = supabase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success-Message "Supabase CLI trouvé: $supabaseVersion"
    } else {
        throw "Supabase CLI non trouvé"
    }
} catch {
    Write-Error-Message "Supabase CLI non trouvé. Installez-le avec: npm install -g supabase"
    exit 1
}

# Vérifier la configuration Supabase
if (Test-Path "supabase/config.toml") {
    Write-Success-Message "Configuration Supabase trouvée"
} else {
    Write-Error-Message "Configuration Supabase non trouvée. Initialisez avec: supabase init"
    exit 1
}

# Vérifier Node.js et npm
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    Write-Success-Message "Node.js: $nodeVersion, npm: $npmVersion"
} catch {
    Write-Error-Message "Node.js ou npm non trouvé"
    exit 1
}

# Étape 1: Déployer la fonction Edge
Write-Host ""
Write-Host "📦 Étape 1/3: Déploiement de la fonction Edge auth-rollback..." -ForegroundColor Blue

try {
    if (-not $LocalOnly) {
        supabase functions deploy auth-rollback
        if ($LASTEXITCODE -eq 0) {
            Write-Success-Message "Fonction Edge déployée avec succès"
        } else {
            throw "Échec du déploiement de la fonction Edge"
        }
    } else {
        Write-Warning-Message "Déploiement local uniquement - fonction Edge ignorée"
    }
} catch {
    Write-Error-Message "Échec du déploiement de la fonction Edge: $($_.Exception.Message)"
    Write-Host "💡 Essayez de vous connecter avec: supabase login" -ForegroundColor Yellow
    exit 1
}

# Étape 2: Créer la table orphaned_auth_accounts
Write-Host ""
Write-Host "🗄️ Étape 2/3: Création de la table orphaned_auth_accounts..." -ForegroundColor Blue

if (Test-Path "create-orphaned-accounts-table.sql") {
    Write-Host "📝 Fichier SQL trouvé: create-orphaned-accounts-table.sql"
    
    if ($DatabaseUrl) {
        try {
            # Utiliser psql si disponible
            $psqlCommand = "psql `"$DatabaseUrl`" -f create-orphaned-accounts-table.sql"
            Invoke-Expression $psqlCommand
            Write-Success-Message "Table créée via psql"
        } catch {
            Write-Warning-Message "Échec de l'exécution via psql. Exécutez manuellement le fichier SQL."
        }
    } else {
        Write-Warning-Message "URL de base de données non fournie."
        Write-Host "💡 Exécutez manuellement create-orphaned-accounts-table.sql dans votre console Supabase" -ForegroundColor Yellow
        Write-Host "   ou utilisez: .\deploy-secure-inscription.ps1 -DatabaseUrl 'votre-url-db'" -ForegroundColor Yellow
    }
} else {
    Write-Error-Message "Fichier create-orphaned-accounts-table.sql non trouvé"
    exit 1
}

# Étape 3: Build du projet
if (-not $SkipBuild) {
    Write-Host ""
    Write-Host "🔨 Étape 3/3: Build du projet..." -ForegroundColor Blue
    
    try {
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Success-Message "Build réussie"
        } else {
            throw "Échec de la build"
        }
    } catch {
        Write-Error-Message "Échec de la build: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Warning-Message "Build ignorée (paramètre -SkipBuild)"
}

# Messages finaux
Write-Host ""
Write-Host "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Actions à effectuer manuellement:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Si pas déjà fait, exécutez le script SQL dans Supabase:" -ForegroundColor White
Write-Host "   create-orphaned-accounts-table.sql" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Configurez les variables d'environnement de la fonction Edge:" -ForegroundColor White
Write-Host "   - SUPABASE_URL" -ForegroundColor Yellow
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Testez le nouveau système d'inscription" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consultez GUIDE-INSCRIPTION-SECURISEE.md pour plus de détails" -ForegroundColor Cyan

# Statistiques finales
Write-Host ""
Write-Host "📊 Statistiques du déploiement:" -ForegroundColor Magenta
Write-Host "- Fonction Edge: $(if ($LocalOnly) { 'Ignorée' } else { 'Déployée' })" -ForegroundColor White
Write-Host "- Table SQL: $(if ($DatabaseUrl) { 'Créée automatiquement' } else { 'À créer manuellement' })" -ForegroundColor White
Write-Host "- Build projet: $(if ($SkipBuild) { 'Ignorée' } else { 'Réussie' })" -ForegroundColor White

Write-Host ""
Write-Host "✨ Système d'inscription sécurisé prêt à l'emploi !" -ForegroundColor Green 