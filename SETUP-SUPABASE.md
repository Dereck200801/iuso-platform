# 🔧 Configuration Supabase pour IUSO Platform

## 📋 Étapes de Configuration

### 1. Accéder à Supabase
- URL du projet : https://imerksaoefmzrsfpoamr.supabase.co
- Se connecter au tableau de bord Supabase

### 2. Exécuter le Script SQL de Base
1. Aller dans **SQL Editor** dans la sidebar
2. Créer une nouvelle requête
3. Copier/coller le contenu du fichier `test-connection.sql`
4. Exécuter le script (bouton Run)

### 3. Vérifier la Création des Tables
1. Aller dans **Table Editor**
2. Vérifier que la table `inscrits` a été créée
3. Vérifier les colonnes et les contraintes

### 4. Configurer l'Authentification
1. Aller dans **Authentication** > **Settings**
2. Vérifier que l'inscription est activée
3. Configurer les redirections si nécessaire

### 5. Configurer le Storage (Optionnel pour le moment)
1. Aller dans **Storage**
2. Créer un bucket `pieces-candidats`
3. Configurer les politiques d'accès

### 6. Créer un Utilisateur Admin de Test
1. Aller dans **Authentication** > **Users**
2. Créer un nouvel utilisateur avec l'email : `admin@iuso-sne.edu.sn`
3. Mot de passe temporaire : `AdminIUSO2024!`
4. Aller dans **SQL Editor** et exécuter :
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@iuso-sne.edu.sn';
```

### 7. Tester la Connexion
1. Redémarrer l'application React : `npm run dev`
2. Ouvrir http://localhost:5173
3. Tester la page de connexion avec l'admin créé
4. Vérifier que l'application se connecte à Supabase

## 🔍 Vérifications

### Variables d'Environnement
Le fichier `.env` doit contenir :
```
VITE_SUPABASE_URL=https://imerksaoefmzrsfpoamr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTQ3MjAsImV4cCI6MjA2NTkzMDcyMH0.7fpNjsSxXGz_9SvWETG6ZRLqrb47ffvEvbrL9KkO4vQ
```

### Test de Fonctionnement
1. **Page d'accueil** : Doit s'afficher sans erreurs
2. **Page de connexion** : Doit permettre la saisie
3. **Console navigateur** : Pas d'erreurs Supabase
4. **Network tab** : Requêtes vers Supabase réussies

## 🚨 Problèmes Courants

### Erreur "Missing Supabase environment variables"
- Vérifier que le fichier `.env` existe
- Redémarrer le serveur de développement

### Erreur de connexion à la base
- Vérifier l'URL et la clé API
- Vérifier que le projet Supabase est actif

### Erreurs RLS (Row Level Security)
- Vérifier que les politiques sont créées
- Vérifier que l'utilisateur est authentifié

## 📞 Support
- **Email** : contact@iuso-sne.edu.sn
- **Documentation Supabase** : https://supabase.com/docs

## 🔄 Prochaines Étapes
1. Exécuter le script SQL complet (`supabase-setup.sql`)
2. Créer les autres tables (messages, candidats_retenus, etc.)
3. Configurer le Storage pour les documents
4. Tester l'inscription d'un candidat
5. Développer les fonctionnalités avancées 