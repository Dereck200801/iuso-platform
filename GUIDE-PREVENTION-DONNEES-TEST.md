# 🛡️ Guide de Prévention - Données de Test

## 🚨 Problème Identifié

Jean Dupont et d'autres données de test réapparaissaient constamment dans la table `inscrits` de Supabase à cause de plusieurs sources :

- Scripts de test automatiques qui s'exécutaient en arrière-plan
- Système AutoSync qui rechargait des données depuis localStorage
- Fichiers SQL contenant des insertions de données de test
- Processus Node.js multiples qui exécutaient des scripts

## ✅ Solutions Appliquées

### 1. Suppression des Scripts de Test
- ❌ `test-inscription-automatique.js` 
- ❌ `test-inscription-optimise.js`
- ❌ `test-inscription-directe.js`
- ❌ `scripts/test-min.ts`
- ❌ `scripts/inscription-ui-sim-test.ts`
- ❌ `scripts/manual-insert-test.ts`
- ❌ `test-api.js` et `test-api.cjs`

### 2. Nettoyage des Fichiers SQL
- Suppression des insertions `INSERT INTO inscrits` contenant Jean Dupont
- Remplacement par des commentaires explicatifs

### 3. Arrêt des Processus Node.js
- Utilisation de `taskkill /F /IM node.exe` pour arrêter tous les processus
- Vérification qu'aucun script ne tourne en arrière-plan

### 4. Nettoyage du localStorage
- Script `cleanup-localstorage.js` créé pour nettoyer le navigateur
- Suppression des clés : `inscrits_data`, `user_data`, `form_data`, etc.

## 🔧 Mesures de Prévention

### 1. Bonnes Pratiques pour les Tests

```typescript
// ✅ BONNE PRATIQUE - Tests isolés
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_DATA = {
  prenom: 'Test',
  nom: 'User',
  email: TEST_EMAIL,
  // ... autres données
}

// Toujours nettoyer après les tests
afterEach(async () => {
  await supabase.from('inscrits').delete().eq('email', TEST_EMAIL)
})
```

```typescript
// ❌ MAUVAISE PRATIQUE - Données fixes
const TEST_DATA = {
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'jean.dupont@email.com' // Email fixe = problème !
}
```

### 2. Configuration AutoSync Sécurisée

```typescript
// ✅ Configuration sécurisée dans App.tsx
const autoSave = initAutoSave({
  saveInterval: 30000,
  enablePeriodicSync: true,
  storageKeys: [
    'user_profile_data',    // Données utilisateur réelles uniquement
    'form_progress_data'    // Progression des formulaires
    // ❌ PAS de 'test_data' ou 'temp_data'
  ]
})
```

### 3. Environnements Séparés

```javascript
// ✅ Utiliser des variables d'environnement
const SUPABASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://prod.supabase.co'
  : 'https://test.supabase.co'  // Base de test séparée
```

### 4. Scripts de Test Sécurisés

```typescript
// ✅ Script de test avec nettoyage automatique
async function runTest() {
  const testId = `test-${Date.now()}`
  
  try {
    // Exécuter le test
    await performTest(testId)
  } finally {
    // TOUJOURS nettoyer
    await cleanup(testId)
  }
}
```

## 🔍 Surveillance Continue

### Script de Monitoring
Utilisez `npm run clean-test-data` régulièrement pour détecter des données suspectes :

```bash
# Vérification quotidienne recommandée
npm run clean-test-data
```

### Patterns à Surveiller
- Emails : `t[0-9]+@(test.com|e.co|ex.co)`
- Noms : `Jean Dupont`, `John Doe`, `Test User`
- Numéros de dossier : `LIC[0-9]{8}` (avec timestamps)

## 🚫 Règles Strictes

### 1. Jamais de Données de Test en Production
- ❌ Pas de `Jean Dupont` dans le code
- ❌ Pas d'emails en `@test.com`
- ❌ Pas de scripts qui s'exécutent automatiquement

### 2. Isolation des Tests
- ✅ Base de données de test séparée
- ✅ Nettoyage systématique après chaque test
- ✅ Utilisation de données dynamiques (timestamps)

### 3. Révision du Code
Avant chaque commit, vérifiez :
```bash
# Rechercher des données de test
grep -r "Jean Dupont" .
grep -r "john.doe" .
grep -r "@test.com" .
```

## 🔧 Outils de Prévention

### 1. Scripts Utiles
```json
{
  "scripts": {
    "clean-test-data": "tsx scripts/monitor-test-data.ts",
    "remove-jean-dupont": "tsx scripts/remove-jean-dupont.ts",
    "check-for-test-data": "grep -r 'Jean Dupont\\|john.doe\\|@test.com' src/ || echo 'Aucune donnée de test trouvée'"
  }
}
```

### 2. Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run check-for-test-data
if [ $? -ne 0 ]; then
  echo "❌ Données de test détectées dans le commit !"
  exit 1
fi
```

## 📋 Checklist de Vérification

Avant chaque déploiement :
- [ ] Aucun processus Node.js suspect en cours
- [ ] localStorage nettoyé dans le navigateur
- [ ] Aucune donnée de test dans Supabase
- [ ] Scripts de test supprimés ou isolés
- [ ] AutoSync configuré correctement

## 🆘 En Cas de Réapparition

Si Jean Dupont réapparaît :

1. **Arrêter immédiatement tous les processus**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Exécuter le nettoyage complet**
   ```bash
   npx tsx scripts/complete-cleanup.ts
   ```

3. **Nettoyer le navigateur**
   - Exécuter `cleanup-localstorage.js` dans la console
   - Vider le cache du navigateur

4. **Vérifier Supabase Dashboard**
   - Supprimer manuellement les données de test
   - Vérifier la table `auth.users`

5. **Redémarrer proprement**
   ```bash
   npm run dev
   ```

## 📞 Support

En cas de problème persistant :
- Vérifiez les logs de Supabase
- Examinez les politiques RLS
- Contactez l'équipe de développement

---
*Guide créé suite à l'incident Jean Dupont du 2025-01-26* 