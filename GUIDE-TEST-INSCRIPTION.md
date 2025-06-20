# 🧪 Guide de Test d'Inscription - IUSO Platform

## 📋 Description

Ce guide vous explique comment tester votre système d'inscription pour vous assurer que les candidats sont bien enregistrés dans la table `inscrits` après confirmation de leur email.

## 🎯 Objectif des Tests

Vérifier que le processus complet d'inscription fonctionne :
1. ✅ Création du compte utilisateur dans `auth.users`
2. ✅ Stockage temporaire des données d'inscription  
3. ✅ Vérification de l'email
4. ✅ Transfert automatique vers la table `inscrits`
5. ✅ Génération du numéro de dossier

## 🚀 Comment exécuter les tests

### Option 1: Test Simple (Recommandé)

1. **Connectez-vous à votre interface Supabase**
2. **Allez dans SQL Editor**
3. **Copiez et collez le contenu du fichier `test-inscription-simple.sql`**
4. **Cliquez sur "Run"**

Le test va :
- Créer un candidat de test
- Simuler tout le processus d'inscription
- Vérifier que le candidat est bien enregistré
- Nettoyer les données de test

### Option 2: Test Complet (Avancé)

Si vous voulez plus de détails, utilisez `test-inscription-complete.sql` :
- Test plus détaillé avec simulation des uploads de fichiers
- Vérifications plus poussées
- Messages détaillés à chaque étape

## 📊 Interprétation des Résultats

### ✅ Succès - Tout fonctionne
```
🎉 TOUS LES TESTS RÉUSSIS !
✅ Le processus d'inscription fonctionne correctement
✅ Le candidat est bien enregistré après confirmation
```

### ❌ Échec - Problèmes détectés
```
❌ CERTAINS TESTS ONT ÉCHOUÉ !
⚠️  Le système d'inscription nécessite des corrections
```

## 🔧 Problèmes Fréquents et Solutions

### Problème 1: Fonction de transfert manquante
**Symptôme:** `⚠️ Fonction de transfert non trouvée`

**Solution:** Exécutez d'abord un des scripts de configuration :
- `create-confirmation-system-fixed.sql`
- `fix-inscription-final.sql`

### Problème 2: Table inscrits_temp manquante
**Symptôme:** Erreur sur `inscrits_temp`

**Solution:** Créez la table temporaire :
```sql
CREATE TABLE IF NOT EXISTS public.inscrits_temp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Problème 3: Politiques RLS trop restrictives
**Symptôme:** Erreur de permissions

**Solution:** Vérifiez vos politiques RLS avec :
```sql
SELECT * FROM pg_policies WHERE tablename = 'inscrits';
```

## 📈 Test en Conditions Réelles

### Test Manuel Complet

1. **Ouvrez votre application web**
2. **Allez sur la page d'inscription**
3. **Remplissez le formulaire avec de vraies données**
4. **Uploadez des fichiers de test**
5. **Soumettez l'inscription**
6. **Vérifiez que l'email de confirmation est envoyé**
7. **Cliquez sur le lien de confirmation dans l'email**
8. **Vérifiez dans la base de données :**

```sql
-- Vérifier l'inscription
SELECT 
    numero_dossier,
    prenom,
    nom,
    email,
    cycle,
    filiere,
    statut,
    transferred_from_temp,
    date_inscription
FROM public.inscrits 
WHERE email = 'votre-email-de-test@exemple.com';
```

### Vérifications Post-Inscription

```sql
-- 1. Vérifier la structure de la table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inscrits';

-- 2. Vérifier les dernières inscriptions
SELECT 
    numero_dossier,
    prenom,
    nom,
    email,
    statut,
    date_inscription
FROM public.inscrits 
ORDER BY date_inscription DESC 
LIMIT 10;

-- 3. Statistiques des inscriptions
SELECT 
    COUNT(*) as total_inscriptions,
    COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
    COUNT(CASE WHEN transferred_from_temp = true THEN 1 END) as transferees
FROM public.inscrits;
```

## 🎯 Points de Contrôle Critiques

### ✅ Checklist de Validation

- [ ] **Compte utilisateur créé** dans `auth.users`
- [ ] **Email confirmé** (`email_confirmed_at` renseigné)
- [ ] **Données temporaires** stockées dans `inscrits_temp`
- [ ] **Candidat transféré** dans `inscrits`
- [ ] **Numéro de dossier** généré automatiquement
- [ ] **Statut correct** (`en_attente` ou `en_cours`)
- [ ] **Flag transferred_from_temp** = `true`
- [ ] **Documents uploadés** dans storage

### 🔄 Processus de Débogage

Si un test échoue :

1. **Vérifiez les logs** dans les résultats du test
2. **Contrôlez la structure** de vos tables
3. **Vérifiez les politiques RLS**
4. **Testez les fonctions** individuellement
5. **Consultez les erreurs** Supabase

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez d'abord** que toutes les tables existent
2. **Contrôlez les politiques RLS**
3. **Assurez-vous** que les fonctions sont créées
4. **Testez étape par étape** pour identifier le problème

## 🔄 Automatisation

Pour automatiser ces tests, vous pouvez :

1. **Créer un script de CI/CD** qui exécute les tests
2. **Programmer des tests réguliers** pour vérifier le système
3. **Intégrer les tests** dans votre pipeline de déploiement

---

**💡 Conseil:** Exécutez ces tests à chaque modification de votre système d'inscription pour vous assurer qu'il fonctionne toujours correctement ! 