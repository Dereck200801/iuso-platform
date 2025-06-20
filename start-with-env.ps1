# Script PowerShell pour demarrer les services Docker avec les variables d'environnement

Write-Host "Demarrage des services IUSO Platform..." -ForegroundColor Green

# Charger les variables d'environnement depuis docker.env
if (Test-Path "docker.env") {
    Write-Host "Chargement des variables d'environnement..." -ForegroundColor Yellow
    
    Get-Content "docker.env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "$name = $value" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "Fichier docker.env introuvable!" -ForegroundColor Red
    exit 1
}

Write-Host "Demarrage des conteneurs Docker..." -ForegroundColor Yellow

# Demarrer les services avec docker-compose
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Services demarres avec succes!" -ForegroundColor Green
    Write-Host "Etat des conteneurs:" -ForegroundColor Yellow
    docker ps
} else {
    Write-Host "Erreur lors du demarrage des services!" -ForegroundColor Red
    exit 1
} 