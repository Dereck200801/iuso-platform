# 🔧 Guide de Correction - Liens Email Expirés IUSO-SNE

## 🚨 Problème identifié
Les liens de confirmation email redirigent vers une erreur `otp_expired` et `access_denied` car:
- L'application tourne sur le port **5176** mais la configuration Supabase autorise uniquement les ports **5173/5174**
- La configuration d'auto-confirmation email était activée
- Les chemins de redirection ne pointaient pas vers notre page `/verify-email`

## ✅ Solutions appliquées

### 1. Correction de `docker.env`
```env
# ✅ Configuration corrigée
SITE_URL=http://localhost:5176
ADDITIONAL_REDIRECT_URLS=http://localhost:5174,http://localhost:5173,http://localhost:5176,http://localhost:3000
ENABLE_EMAIL_AUTOCONFIRM=false  # ⚠️ Désactivé pour forcer la vérification
MAILER_URLPATHS_CONFIRMATION=/verify-email  # ✅ Point vers notre page
```

## 🚀 Étapes de correction à suivre

### Étape 1: Redémarrer Docker Desktop
```powershell
# 1. Fermer Docker Desktop complètement
# 2. Relancer Docker Desktop
# 3. Attendre que Docker soit complètement démarré (icône verte)
```

### Étape 2: Redémarrer les services Supabase
```powershell
# Arrêter tous les services
docker-compose down --remove-orphans

# Redémarrer avec la nouvelle configuration
docker-compose --env-file docker.env up -d

# Vérifier que tous les services fonctionnent
docker-compose ps
```

### Étape 3: Configuration manuelle Supabase Dashboard

#### 3.1 Dashboard Supabase → Authentication → Settings
1. Aller sur: http://localhost:3000 (Supabase Studio)
2. Naviguer vers **Authentication** → **Settings**
3. Modifier les **URL Settings**:
   ```
   Site URL: http://localhost:5176
   Redirect URLs (une par ligne):
   http://localhost:5176/verify-email
   http://localhost:5173/verify-email  
   http://localhost:5174/verify-email
   http://localhost:3000/verify-email
   ```
4. **Sauvegarder** les changements

#### 3.2 Configuration du Template Email
1. Dans le même dashboard → **Authentication** → **Email Templates**
2. Cliquer sur **Confirm signup**
3. **Subject**: `Confirmez votre inscription au concours IUSO-SNE`
4. **Body**: Utiliser le template HTML personnalisé (voir `email-template-confirmation-fixed.html`)
5. **Confirm signup URL**: 
   ```
   {{ .SiteURL }}/verify-email?token={{ .TokenHash }}&type=signup
   ```
6. **Sauvegarder** le template

### Étape 4: Nettoyage de la base de données
Exécuter le script SQL de correction:
```sql
-- Dans Supabase Studio → SQL Editor
-- Coller et exécuter le contenu de fix-email-verification-config.sql
```

### Étape 5: Test avec un nouvel email
⚠️ **IMPORTANT**: Utiliser un email **complètement différent** de ceux déjà testés car Supabase cache les anciens tokens.

```
Exemple: test-verification-2024@exemple.com
```

## 🧪 Procédure de test

### Test 1: Inscription complète
1. Aller sur http://localhost:5176/inscription
2. Remplir avec un **nouvel email**
3. Soumettre → Doit rediriger vers `/confirmation`
4. Vérifier que l'email est reçu

### Test 2: Vérification du lien email
1. Ouvrir l'email reçu
2. Cliquer sur "Confirmer mon inscription"
3. ✅ **Résultat attendu**: Redirection vers `/verify-email` avec succès
4. ❌ **Si erreur**: Le lien doit pointer vers `localhost:5176` et non `localhost:3000`

### Test 3: Vérification en base
```sql
-- Vérifier l'utilisateur dans auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'votre-email-test@exemple.com';

-- Vérifier l'inscription dans inscrits
SELECT numero_dossier, email, statut, email_verified_at
FROM inscrits 
WHERE email = 'votre-email-test@exemple.com';
```

## 🔄 Si le problème persiste

### Solution d'urgence: Renvoi manuel d'email
```sql
-- Dans Supabase Studio → SQL Editor
SELECT resend_confirmation_email('email@test.com');
```

### Vérification des logs Docker
```powershell
# Voir les logs du service auth
docker-compose logs auth

# Voir les logs en temps réel
docker-compose logs -f auth
```

### Alternative: Configuration locale Vite
Si votre app frontend tourne sur un port différent, modifier `package.json`:
```json
{
  "scripts": {
    "dev": "vite --port 5173"
  }
}
```

## ⚠️ Points d'attention

1. **Unicité des emails**: Chaque test doit utiliser un email différent
2. **Cache navigateur**: Vider le cache entre les tests
3. **Ports cohérents**: S'assurer que tous les services utilisent les mêmes ports
4. **Logs Supabase**: Surveiller les logs pour détecter les erreurs

## 📞 Dépannage avancé

### Problème: Docker ne démarre pas
```powershell
# Nettoyer Docker complètement
docker system prune -a --volumes

# Redémarrer Docker Desktop
# Relancer les services
```

### Problème: Variables d'environnement non lues
```powershell
# Vérifier que docker.env est bien lu
docker-compose config
```

### Problème: Email toujours pas reçu
1. Vérifier la configuration SMTP dans le dashboard Supabase
2. Tester avec un email temporaire (10minutemail.com)
3. Vérifier les logs du service auth

---

## ✅ Checklist finale

- [ ] `docker.env` mis à jour avec le bon port (5176)
- [ ] Services Docker redémarrés
- [ ] Dashboard Supabase configuré (Site URL + Redirect URLs)
- [ ] Template email mis à jour
- [ ] Script de nettoyage SQL exécuté  
- [ ] Test avec un nouvel email
- [ ] Vérification que l'inscription apparaît dans `inscrits`

**Date de correction**: 20 Décembre 2024  
**Version**: 1.0 