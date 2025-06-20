# 🔧 Guide Mode Développement - IUSO-SNE

## ✅ Modifications appliquées

La confirmation email a été **temporairement désactivée** pour permettre les inscriptions directes pendant le développement local.

### 🚀 **Nouveau flux d'inscription (mode dev)**

1. **Inscription candidat** → Insertion directe dans `inscrits`
2. **Upload documents** → Stockage automatique 
3. **Redirection immédiate** → Page de confirmation
4. **Statut** : `en_attente_validation` (prêt pour validation équipe)

### 🔄 **Comparaison des flux**

| **Avant (avec email)** | **Maintenant (mode dev)** |
|-------------------------|----------------------------|
| 1. Inscription → données temp | 1. Inscription → inscrits direct |
| 2. Email envoyé | 2. ❌ Email sauté |
| 3. Clic lien email | 3. ❌ Sauté |
| 4. Transfert vers inscrits | 4. ❌ Déjà fait |
| 5. Confirmation | 5. Confirmation immédiate |

## 📋 **Changements techniques**

### `src/pages/InscriptionPage.tsx`
- ❌ **Supprimé** : `supabase.auth.signUp()` (évite l'envoi d'email)
- ❌ **Supprimé** : Stockage temporaire 
- ✅ **Ajouté** : Insertion directe dans `inscrits`
- ✅ **Ajouté** : Flag `dev_mode: true`
- ✅ **Ajouté** : Statut `en_attente_validation`

### `src/pages/ConfirmationPage.tsx`
- ✅ **Ajouté** : Support du flag `devMode`
- ✅ **Ajouté** : Messages adaptés mode développement
- ✅ **Ajouté** : Affichage orange/warning pour mode dev
- ❌ **Conditionné** : Section email (masquée en mode dev)

## 🧪 **Test du nouveau flux**

### Test rapide
1. Aller sur `http://localhost:5176/inscription`
2. Remplir le formulaire avec un nouvel email
3. Soumettre → **Redirection immédiate** vers confirmation
4. ✅ **Vérifier** : Candidat dans table `inscrits` avec `dev_mode: true`

### Vérification base de données
```sql
-- Voir les inscriptions en mode dev
SELECT numero_dossier, email, statut, dev_mode, created_at 
FROM inscrits 
WHERE dev_mode = true 
ORDER BY created_at DESC;
```

## 🔄 **Pour réactiver la confirmation email**

### Quand vous aurez un domaine et hosting :

### 1. **Configuration Supabase**
```
Dashboard Supabase → Authentication → Settings
Site URL: https://votre-domaine.com
Redirect URLs: https://votre-domaine.com/verify-email
```

### 2. **Rétablir le code original**
Dans `src/pages/InscriptionPage.tsx`, remplacer le bloc `onSubmit` par :

```typescript
const onSubmit = async (data: InscriptionForm) => {
  setLoading(true)
  try {
    // 1. Créer le compte utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.mot_de_passe,
      options: {
        data: {
          firstName: data.prenom,
          lastName: data.nom,
          role: 'candidat'
        }
      }
    })

    if (authError) {
      throw new Error(`Erreur de création de compte: ${authError.message}`)
    }

    // ... le reste du code original (stockage temporaire + redirection avec needsEmailVerification: true)
```

### 3. **Template email production**
Utiliser `email-template-workflow-optimized.html` dans Supabase → Email Templates

## ⚠️ **Important**

### **Données de test**
- Les inscriptions avec `dev_mode: true` sont identifiables
- Facile à nettoyer avant la production :
```sql
DELETE FROM inscrits WHERE dev_mode = true;
```

### **Sécurité**
- Mode dev = pas d'authentification Supabase Auth
- En production = authentification complète requise
- Les mots de passe sont stockés temporairement en base (pour debug uniquement)

## 📊 **Avantages mode dev**

✅ **Inscriptions directes** - Pas d'attente email  
✅ **Tests rapides** - Workflow complet en 30 secondes  
✅ **Debugging facilité** - Tout visible en base immédiatement  
✅ **Développement local** - Pas besoin de serveur SMTP  
✅ **Données identifiées** - Flag `dev_mode` pour différencier  

## 🚀 **Prochaines étapes recommandées**

1. **Tester le workflow complet** - Inscription → Base → Dashboard admin
2. **Développer l'interface admin** - Validation des dossiers
3. **Préparer l'hébergement** - Domaine + serveur
4. **Réactiver l'email** - Avant mise en production

---

**Mode développement activé ✅**  
**Prêt pour les tests d'inscription ! 🎯** 