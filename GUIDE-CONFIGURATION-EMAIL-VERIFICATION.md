# Guide de Configuration - Système de Vérification d'Email IUSO-SNE

## 🎯 Objectif
Configurer le flow complet de vérification d'email pour les inscriptions au concours IUSO-SNE.

## 📋 Flow du processus

```
1. Utilisateur s'inscrit → Compte créé avec auth.signUp()
2. Email de vérification envoyé automatiquement
3. Utilisateur clique sur le lien → Redirection vers /verify-email
4. EmailVerificationPage vérifie le token
5. Données transférées vers table `inscrits`
6. Redirection vers ConfirmationPage avec succès
7. Utilisateur peut se connecter via LoginPage
```

## 🔧 Configuration Supabase

### 1. Configuration de l'authentification

Dans le dashboard Supabase > **Authentication** > **Settings** :

#### URL Settings
- **Site URL** : `http://localhost:5173` (dev) / `https://votre-domaine.com` (prod)
- **Redirect URLs** :
  ```
  http://localhost:5173/verify-email
  https://votre-domaine.com/verify-email
  ```

#### Email Templates
Aller dans **Authentication** > **Email Templates** > **Confirm signup** :

**Subject** :
```
Confirmez votre inscription au concours IUSO-SNE
```

**Body** :
Copier le contenu du fichier `email-template-confirmation-fixed.html`

### 2. Configuration de la base de données

Exécuter le script SQL `setup-email-verification-flow.sql` :

```bash
# Via l'interface Supabase
# Dashboard > SQL Editor > New query
# Coller le contenu du fichier setup-email-verification-flow.sql
# Cliquer sur "Run"
```

### 3. Configuration du Storage

Le script SQL configure automatiquement :
- Bucket `pieces-candidats`
- Politiques RLS pour les documents
- Accès sécurisé par utilisateur

## 🎨 Design et Templates

### Templates d'email créés :
1. **email-template-confirmation-fixed.html** - Version optimisée (recommandée)
2. **email-template-confirmation-modern.html** - Version avec effets modernes
3. **email-template-confirmation-compatible.html** - Version compatible tous clients

### Caractéristiques du design :
- ✅ Couleur Yale Blue (#134074) respectée
- ✅ Font Inter (fallback pour Gilroy)
- ✅ Boutons style shadcn/ui
- ✅ Design cohérent avec InscriptionPage.tsx
- ✅ Responsive et compatible email

## 🔄 Pages et Routing

### Pages configurées :
1. **InscriptionPage.tsx** - Formulaire d'inscription
2. **EmailVerificationPage.tsx** - Vérification du token email
3. **ConfirmationPage.tsx** - Affichage du succès
4. **LoginPage.tsx** - Connexion des utilisateurs vérifiés

### Routes dans App.tsx :
```typescript
<Route path="/inscription" element={<InscriptionPage />} />
<Route path="/verify-email" element={<EmailVerificationPage />} />
<Route path="/confirmation" element={<ConfirmationPage />} />
<Route path="/login" element={<LoginPage />} />
```

## 🚀 Processus de test

### 1. Test de l'inscription
1. Aller sur `/inscription`
2. Remplir le formulaire complet
3. Vérifier que l'email de confirmation est envoyé
4. Vérifier la redirection vers `/confirmation` avec `needsEmailVerification: true`

### 2. Test de la vérification
1. Cliquer sur le lien dans l'email
2. Vérifier la redirection vers `/verify-email`
3. Vérifier le traitement du token
4. Vérifier l'insertion dans la table `inscrits`
5. Vérifier la redirection vers `/confirmation` avec succès

### 3. Test de la connexion
1. Aller sur `/login`
2. Se connecter avec les identifiants de l'utilisateur vérifié
3. Vérifier l'accès au dashboard

## 🐛 Debugging

### Vérifications à faire :

#### Dans Supabase Dashboard :
```sql
-- Vérifier les utilisateurs créés
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Vérifier les inscriptions
SELECT * FROM inscrits ORDER BY created_at DESC;

-- Vérifier les fichiers uploadés
SELECT * FROM storage.objects 
WHERE bucket_id = 'pieces-candidats';
```

#### Dans la console du navigateur :
- Vérifier les erreurs de réseau
- Vérifier les tokens dans l'URL
- Vérifier le localStorage pour les données temporaires

### Erreurs communes :

#### 1. "Lien de vérification invalide"
- Vérifier que les Redirect URLs sont correctement configurées
- Vérifier que le token n'a pas expiré (24h)

#### 2. "Erreur d'insertion dans inscrits"
- Vérifier les politiques RLS
- Vérifier que la table existe avec la bonne structure
- Vérifier les contraintes UNIQUE

#### 3. "Erreur d'upload de fichiers"
- Vérifier que le bucket `pieces-candidats` existe
- Vérifier les politiques de storage
- Vérifier les tailles de fichiers

## 📝 Checklist de déploiement

### Avant le déploiement :
- [ ] Script SQL exécuté avec succès
- [ ] Templates d'email configurés
- [ ] Redirect URLs configurées pour la production
- [ ] Tests complets effectués
- [ ] Variables d'environnement configurées

### Variables d'environnement requises :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔒 Sécurité

### Mesures de sécurité implémentées :
- ✅ RLS activé sur toutes les tables
- ✅ Politiques d'accès par utilisateur
- ✅ Validation des tokens côté serveur
- ✅ Nettoyage automatique des données expirées
- ✅ Upload sécurisé des fichiers

## 📊 Monitoring

### Métriques à surveiller :
- Taux de confirmation d'email
- Temps de traitement des inscriptions
- Erreurs de vérification
- Utilisation du storage

### Requêtes utiles :
```sql
-- Statistiques des inscriptions
SELECT * FROM inscription_stats;

-- Utilisateurs non confirmés
SELECT COUNT(*) FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- Inscriptions par statut
SELECT statut, COUNT(*) FROM inscrits 
GROUP BY statut;
```

## 🎉 Résultat attendu

Après configuration complète :
1. ✅ Design d'email moderne et cohérent
2. ✅ Flow de vérification fluide
3. ✅ Données correctement stockées
4. ✅ Connexion fonctionnelle après vérification
5. ✅ Interface utilisateur claire et informative

---

**Note** : Ce guide assume que vous avez déjà un projet Supabase configuré avec les tables de base. Si ce n'est pas le cas, exécutez d'abord les scripts de configuration de base du projet. 