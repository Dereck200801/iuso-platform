# 🚀 Instructions pour Exécuter le SQL dans Supabase

## 📋 Étapes à Suivre

### 1. Accéder au Dashboard Supabase
1. Ouvrez votre navigateur
2. Allez sur : **https://supabase.com/dashboard/project/imerksaoefmzrsfpoamr**
3. Connectez-vous à votre compte Supabase

### 2. Ouvrir l'Éditeur SQL
1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Vous verrez un éditeur de code SQL

### 3. Exécuter le Script
1. Ouvrez le fichier `create-inscrits-table.sql` dans votre éditeur
2. **Copiez TOUT le contenu** du fichier
3. **Collez-le** dans l'éditeur SQL de Supabase
4. Cliquez sur le bouton **"Run"** (Exécuter) ou utilisez `Ctrl+Enter`

### 4. Vérification
Après l'exécution, vous devriez voir :
- ✅ Messages de confirmation dans la console
- ✅ La table `inscrits` apparaît dans l'onglet "Table Editor"
- ✅ Les vues statistiques créées

## 🎯 Ce que le Script Va Créer

### Table `inscrits` avec colonnes :
- **id** : Clé primaire auto-incrémentée
- **numero_dossier** : Identifiant unique auto-généré (LIC24001, DUT24001, etc.)
- **prenom, nom, genre, date_naissance, lieu_naissance, nationalite** : Infos personnelles
- **email, telephone, adresse** : Coordonnées
- **mot_de_passe** : Mot de passe hashé
- **cycle, filiere** : Formation choisie
- **photo_identite_url, attestation_bac_url** : URLs des documents
- **statut** : État de l'inscription (en_attente, accepte, refuse)
- **date_inscription, date_modification** : Timestamps

### Fonctionnalités Automatiques :
- 🔢 **Génération automatique de numéro de dossier** (LIC24001, DUT24002, etc.)
- 📊 **Vues statistiques** prêtes à utiliser
- 🔒 **Sécurité RLS** configurée
- ⚡ **Index optimisés** pour les performances

### Vues Statistiques Créées :
- `stats_inscriptions` : Stats par cycle et filière
- `stats_genre` : Répartition par genre
- `stats_nationalite` : Répartition par nationalité

## 🚨 En Cas de Problème

### Si vous voyez des erreurs :
1. **Vérifiez** que vous avez copié TOUT le contenu du fichier
2. **Exécutez** le script section par section si nécessaire
3. **Ignorez** les avertissements sur les objets qui existent déjà

### Messages normaux à ignorer :
- "relation already exists" ✅ Normal
- "index already exists" ✅ Normal
- "function already exists" ✅ Normal

## 🎉 Après l'Exécution

Une fois le script exécuté avec succès :

1. **Testez le formulaire** : Allez sur `http://localhost:5173/inscription`
2. **Remplissez** une inscription test
3. **Vérifiez** dans l'onglet "Table Editor" de Supabase
4. **Confirmez** que le numéro de dossier est généré automatiquement

## 📞 Support

Si vous rencontrez des difficultés :
1. Copiez le message d'erreur exact
2. Vérifiez que vous êtes bien connecté à Supabase
3. Assurez-vous d'avoir les permissions d'administration

---

**🎯 Objectif :** Avoir un système d'inscription fonctionnel avec génération automatique de numéros de dossier et toutes les statistiques nécessaires pour l'administration du concours L1 & BTS d'IUSO-SNE. 