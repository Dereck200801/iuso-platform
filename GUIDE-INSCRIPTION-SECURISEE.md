# 🔒 Guide - Inscription Sécurisée avec Rollback

## 📋 Vue d'ensemble

Le nouveau système d'inscription a été configuré pour **éviter les comptes Auth orphelins** en cas d'erreur lors du processus d'inscription. Plus jamais d'erreur "User already registered" !

## 🔄 Nouveau Processus Sécurisé

### 1. **Vérifications Préliminaires**
- ✅ Vérification si l'email existe déjà dans `inscrits`
- ✅ Validation complète des données

### 2. **Uploads des Documents**
- ✅ Upload photo d'identité 
- ✅ Upload attestation Bac
- ⚠️ **Si échec** → Arrêt sans création de compte Auth

### 3. **Création du Compte Auth**
- ✅ Compte créé seulement après validations complètes
- 🎯 **Succès garanti** car tout est déjà vérifié

### 4. **Insertion Candidat**
- ✅ Insertion finale dans la table `inscrits`
- 🔄 **Si échec** → Rollback automatique du compte Auth

## 🛠️ Configuration Requise

### A. Déployer la Fonction Edge

1. **Copier la fonction** `volumes/functions/auth-rollback/index.ts`

2. **Déployer sur Supabase** :
```bash
supabase functions deploy auth-rollback
```

3. **Configurer les variables d'environnement** :
   - `SUPABASE_URL` : URL de votre projet
   - `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (avec droits admin)

### B. Créer la Table de Tracking

Exécuter le script SQL `create-orphaned-accounts-table.sql` :

```sql
-- Créer la table pour tracker les comptes orphelins
-- Puis les politiques RLS et fonction de nettoyage
```

## 🎯 Avantages du Nouveau Système

### ✅ **Sécurité Maximale**
- Aucun compte Auth créé inutilement
- Rollback automatique en cas d'erreur
- Tracking des comptes orphelins

### ✅ **Expérience Utilisateur**
- Plus d'erreur "User already registered"
- Messages d'erreur clairs et précis
- Processus fluide et fiable

### ✅ **Maintenance Simplifiée**
- Fonction de nettoyage automatique
- Logs détaillés pour debugging
- Table de tracking pour audit

## 🔧 Fonctionnalités Avancées

### 1. **Rollback Multi-niveaux**

```typescript
// Niveau 1: Fonction Edge (recommandé)
supabase.functions.invoke('auth-rollback', { body: { userId } })

// Niveau 2: Sauvegarde pour nettoyage ultérieur
// Si la fonction Edge échoue

// Niveau 3: Nettoyage automatique via fonction SQL
SELECT cleanup_orphaned_auth_accounts();
```

### 2. **Monitoring des Comptes Orphelins**

```sql
-- Voir tous les comptes orphelins
SELECT * FROM orphaned_auth_accounts 
WHERE cleaned_up_at IS NULL;

-- Statistiques
SELECT 
    reason,
    COUNT(*) as count,
    MIN(created_at) as first_occurrence,
    MAX(created_at) as last_occurrence
FROM orphaned_auth_accounts 
GROUP BY reason;
```

### 3. **Nettoyage Automatique**

```sql
-- Nettoyer manuellement
SELECT cleanup_orphaned_auth_accounts();

-- Programmer un nettoyage automatique (avec pg_cron si disponible)
SELECT cron.schedule(
    'cleanup-orphaned-accounts',
    '0 2 * * *', -- Tous les jours à 2h du matin
    'SELECT cleanup_orphaned_auth_accounts();'
);
```

## 🚨 Gestion des Erreurs

### Scénarios Couverts

1. **Upload photo échoue** → Arrêt avant création compte Auth
2. **Upload attestation échoue** → Arrêt avant création compte Auth  
3. **Email déjà utilisé** → Arrêt avant création compte Auth
4. **Création Auth échoue** → Nettoyage des uploads
5. **Insertion inscrits échoue** → Rollback compte Auth + nettoyage uploads

### Messages d'Erreur Améliorés

```typescript
// Exemples de messages clairs pour l'utilisateur
- "Cette adresse email est déjà utilisée pour une inscription"
- "Erreur lors de l'upload de la photo (format/taille invalide)"
- "Erreur lors de l'upload de l'attestation"
- "Erreur lors de la création du compte"
- "Inscription incomplète - veuillez réessayer"
```

## 📊 Monitoring et Logs

### Logs Disponibles

```javascript
// Console logs pour debugging
console.log('🔍 Vérification préliminaire de l\'email...')
console.log('📁 Upload des documents...')
console.log('✅ Tous les uploads réussis, création du compte Auth...')
console.log('✅ Compte Auth créé avec succès:', authUserId)
console.log('🔥 INSERTION FINALE DANS INSCRITS')
console.log('🔄 ROLLBACK: Tentative de suppression du compte Auth créé...')
console.log('✅ Compte Auth supprimé avec succès (rollback)')
```

### Métriques Recommandées

- Taux de succès des inscriptions
- Nombre de rollbacks effectués
- Comptes orphelins créés/nettoyés
- Temps moyen du processus d'inscription

## 🔄 Migration depuis l'Ancien Système

### Étapes de Migration

1. **Déployer la fonction Edge** `auth-rollback`
2. **Créer la table** `orphaned_auth_accounts`
3. **Tester** sur un environnement de dev
4. **Déployer** le nouveau code `InscriptionPage.tsx`
5. **Monitorer** les premiers utilisateurs

### Vérification Post-Migration

```sql
-- Vérifier qu'il n'y a pas de nouveaux comptes orphelins
SELECT COUNT(*) FROM orphaned_auth_accounts 
WHERE created_at > NOW() - INTERVAL '1 day';

-- Vérifier les inscriptions récentes
SELECT COUNT(*) FROM inscrits 
WHERE date_inscription > NOW() - INTERVAL '1 day';
```

## 🆘 Dépannage

### Problèmes Courants

1. **Fonction Edge ne se déploie pas**
   ```bash
   # Vérifier la configuration
   supabase status
   supabase functions list
   ```

2. **Rollback ne fonctionne pas**
   ```sql
   -- Vérifier les permissions service role
   SELECT auth.role();
   ```

3. **Table orphaned_auth_accounts inexistante**
   ```sql
   -- Re-exécuter le script de création
   \i create-orphaned-accounts-table.sql
   ```

### Support et Maintenance

- **Logs** : Consultez les logs Supabase Functions
- **Monitoring** : Table `orphaned_auth_accounts`
- **Nettoyage** : Fonction `cleanup_orphaned_auth_accounts()`

---

## ✅ Checklist de Vérification

- [ ] Fonction Edge `auth-rollback` déployée
- [ ] Table `orphaned_auth_accounts` créée
- [ ] Variables d'environnement configurées
- [ ] Code `InscriptionPage.tsx` mis à jour
- [ ] Tests effectués sur environnement de dev
- [ ] Monitoring en place

**🎉 Système d'inscription sécurisé opérationnel !** 