# 🐳 Guide Docker - Plateforme IUSO

## 🎯 **Avantages de Docker**

Avec Docker, vous obtenez :
- ✅ **Supabase local** complet (base de données, auth, storage, studio)
- ✅ **Configuration automatique** de toutes les tables et politiques
- ✅ **Environnement isolé** sans affecter votre système
- ✅ **Démarrage en un clic** avec tous les services
- ✅ **Pas besoin de compte Supabase** pour développer

## 🚀 **Démarrage Rapide**

### 1. **Prérequis**
- Docker Desktop installé et démarré
- Application IUSO déjà créée (✅ fait)

### 2. **Lancer l'environnement complet**
```bash
# Option 1: Script automatique
./docker-start.bat

# Option 2: Commande directe
docker-compose --env-file docker.env up -d
```

### 3. **Vérifier que tout fonctionne**
- **Supabase Studio** : http://localhost:3000
- **API Supabase** : http://localhost:8000
- **Application React** : http://localhost:5174

## 📋 **Services Inclus**

| Service | URL | Description |
|---------|-----|-------------|
| **Studio** | http://localhost:3000 | Interface d'administration Supabase |
| **API Gateway** | http://localhost:8000 | Point d'entrée pour toutes les APIs |
| **PostgreSQL** | localhost:5432 | Base de données (user: postgres, pass: iuso123456789) |
| **Auth** | http://localhost:8000/auth/v1 | Service d'authentification |
| **Storage** | http://localhost:8000/storage/v1 | Stockage de fichiers |
| **Realtime** | http://localhost:8000/realtime/v1 | Mises à jour temps réel |

## 🔧 **Configuration Automatique**

Le script `iuso-setup.sql` est automatiquement exécuté et crée :

### ✅ **Tables**
- `inscrits` - Candidats inscrits
- `messages` - Système de messagerie
- `candidats_retenus` - Liste des retenus
- `admis_au_concours` - Liste des admis

### ✅ **Fonctionnalités**
- Génération automatique des matricules
- Row Level Security (RLS) configuré
- Politiques d'accès par rôle (candidat/admin)
- Bucket storage pour les documents
- Index de performance
- Vues statistiques

### ✅ **Utilisateurs de Test**
Créés automatiquement :
- **Admin** : admin@iuso-sne.edu.sn / AdminIUSO2024!
- **Candidat test** : candidat@test.com / TestIUSO2024!

## 🎮 **Utilisation**

### **Développement Normal**
1. **Démarrer Docker** : `./docker-start.bat`
2. **Démarrer l'app React** : `npm run dev`
3. **Ouvrir** : http://localhost:5174

### **Administration Supabase**
1. **Ouvrir Studio** : http://localhost:3000
2. **Pas de mot de passe** requis (environnement local)
3. **Voir les tables** dans Table Editor
4. **Exécuter du SQL** dans SQL Editor

### **Tests d'API**
```bash
# Test de connexion
curl http://localhost:8000/rest/v1/inscrits

# Test d'authentification
curl http://localhost:8000/auth/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 📁 **Structure des Fichiers Docker**

```
iuso-platform/
├── docker-compose.yml          # Configuration des services
├── docker.env                  # Variables d'environnement
├── iuso-setup.sql             # Script d'initialisation DB
├── docker-start.bat           # Script de démarrage
├── docker-stop.bat            # Script d'arrêt
├── .env.local                 # Config app pour Supabase local
└── volumes/                   # Données persistantes
    ├── api/kong.yml           # Configuration API Gateway
    ├── db/data/               # Données PostgreSQL
    ├── storage/               # Fichiers uploadés
    ├── functions/             # Edge Functions
    └── logs/                  # Logs des services
```

## 🔄 **Commandes Utiles**

### **Gestion des Services**
```bash
# Démarrer tous les services
docker-compose --env-file docker.env up -d

# Arrêter tous les services
docker-compose down

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service spécifique
docker-compose restart db

# Voir l'état des services
docker-compose ps
```

### **Base de Données**
```bash
# Se connecter à PostgreSQL
docker exec -it supabase-db psql -U postgres -d postgres

# Exécuter un script SQL
docker exec -i supabase-db psql -U postgres -d postgres < script.sql

# Backup de la base
docker exec supabase-db pg_dump -U postgres postgres > backup.sql
```

### **Nettoyage**
```bash
# Supprimer tous les conteneurs et volumes
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Nettoyage complet Docker
docker system prune -a
```

## 🔧 **Configuration de l'Application**

### **Fichier .env.local**
```env
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvb2FsaG9zdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc3ODQ2NDAwLCJleHAiOjE5OTM0MjI0MDB9.z8zKBGrNrR6YEPxwQgQdKJMGj0rH4z3Oa4e7QJXxbYQ
```

### **Basculer entre Local et Cloud**
```bash
# Utiliser Supabase local
cp .env.local .env

# Utiliser Supabase cloud
cp .env.cloud .env  # (à créer avec vos vraies clés)
```

## 🚨 **Dépannage**

### **Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -an | findstr "3000\|8000\|5432"

# Changer les ports dans docker.env si nécessaire
STUDIO_PORT=3001
KONG_HTTP_PORT=8001
POSTGRES_PORT=5433
```

### **Services qui ne démarrent pas**
```bash
# Voir les logs détaillés
docker-compose logs [service-name]

# Redémarrer un service
docker-compose restart [service-name]

# Reconstruire les images
docker-compose build --no-cache
```

### **Base de données corrompue**
```bash
# Supprimer les données et recommencer
docker-compose down -v
docker-compose up -d
```

## 🎯 **Avantages pour le Développement**

### ✅ **Rapidité**
- Démarrage en 2 minutes au lieu de 30 minutes de configuration
- Pas besoin de créer un compte Supabase
- Pas de limites de requêtes ou de stockage

### ✅ **Isolation**
- Environnement complètement isolé
- Pas d'impact sur votre système
- Facile à supprimer/recréer

### ✅ **Collaboration**
- Même environnement pour toute l'équipe
- Configuration versionnée avec Git
- Reproductible sur n'importe quelle machine

### ✅ **Tests**
- Données de test automatiques
- Réinitialisation facile
- Tests d'intégration complets

## 🚀 **Prochaines Étapes**

1. **Démarrer Docker** : `./docker-start.bat`
2. **Vérifier Supabase Studio** : http://localhost:3000
3. **Tester l'application** : http://localhost:5174
4. **Développer les fonctionnalités** manquantes
5. **Tester avec des données réelles**

---

**🎓 Avec Docker, la plateforme IUSO est maintenant complètement autonome et prête pour le développement !** 