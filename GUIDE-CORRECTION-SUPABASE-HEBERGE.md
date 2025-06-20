# 🎯 Solution : Configuration Supabase Hébergé - IUSO-SNE

## ✅ Bonne nouvelle !
Votre application utilise déjà **Supabase hébergé** (`https://imerksaoefmzrsfpoamr.supabase.co`). 
Pas besoin de Docker ! Il suffit de configurer directement le dashboard Supabase.

## 🚀 Étapes de correction (5 minutes)

### Étape 1: Accéder au Dashboard Supabase
1. Aller sur: **https://supabase.com/dashboard**
2. Se connecter à votre compte
3. Sélectionner le projet **imerksaoefmzrsfpoamr**

### Étape 2: Configuration Authentication → Settings
1. Dans le menu de gauche : **Authentication** → **Settings**
2. Aller dans l'onglet **URL Configuration**
3. Modifier les paramètres :

```
Site URL: http://localhost:5176

Redirect URLs (ajouter ces lignes):
http://localhost:5176/verify-email
http://localhost:5173/verify-email
http://localhost:5174/verify-email
http://localhost:3000/verify-email
```

4. **Sauvegarder** les changements

### Étape 3: Configuration du Template Email
1. Toujours dans **Authentication** → **Email Templates**
2. Cliquer sur **"Confirm signup"**
3. Modifier le contenu :

**Subject:**
```
Confirmez votre inscription au concours IUSO-SNE
```

**Body (HTML):**
```html
<h2 style="color: #134074;">Confirmez votre inscription</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit(e) au concours d'entrée IUSO-SNE !</p>

<p>Pour finaliser votre inscription, cliquez sur le bouton ci-dessous :</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #134074; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    ✅ Confirmer mon inscription
  </a>
</div>

<p><strong>⏰ Ce lien est valide pendant 24 heures.</strong></p>

<p>Après confirmation :</p>
<ul>
  <li>✅ Votre candidature sera enregistrée</li>
  <li>📋 Vous recevrez votre numéro de dossier</li>
  <li>🚀 Vous pourrez accéder à votre espace candidat</li>
</ul>

<p>Cordialement,<br>L'équipe IUSO-SNE</p>
```

4. **Important**: Vérifier que l'URL de confirmation pointe vers :
   ```
   {{ .SiteURL }}/verify-email?token={{ .TokenHash }}&type=signup
   ```

5. **Sauvegarder** le template

### Étape 4: Exécuter le script SQL de nettoyage
1. Dans le dashboard → **SQL Editor**
2. **Nouvelle requête**
3. Coller le contenu de `fix-email-verification-config.sql`
4. **Exécuter** le script

### Étape 5: Test immédiat
1. Aller sur **http://localhost:5176/inscription**
2. Utiliser un **nouvel email** (différent des tests précédents)
3. Remplir et soumettre le formulaire
4. Vérifier la réception de l'email
5. Cliquer sur le lien → Doit rediriger vers `/verify-email` avec succès

## 🔍 Vérification du fonctionnement

### Logs à surveiller dans la console navigateur :
```javascript
✅ EmailVerificationPage - Paramètres URL: { token: "abc123...", type: "signup" }
✅ Résultat vérification OTP: { success: true, user: "email@test.com" }
✅ Données temporaires trouvées: true
✅ Inscription finalisée avec succès, numéro: LIC123456
```

### Vérification en base de données :
Dans le dashboard Supabase → **Table Editor** :

```sql
-- Vérifier l'utilisateur confirmé
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'votre-email-test@exemple.com';

-- Vérifier l'inscription
SELECT numero_dossier, email, statut, email_verified_at
FROM inscrits 
WHERE email = 'votre-email-test@exemple.com';
```

## ⚠️ Points critiques

1. **Utiliser un nouvel email** à chaque test (Supabase cache les anciens tokens)
2. **Vider le cache navigateur** entre les tests
3. **Vérifier que l'app tourne bien sur 5176** : `npm run dev` ou `yarn dev`

## 🆘 Si le problème persiste

### Solution d'urgence - Renvoi manuel :
Dans Supabase → **SQL Editor** :
```sql
SELECT resend_confirmation_email('email@test.com');
```

### Vérification des paramètres :
1. **Site URL** = `http://localhost:5176`
2. **Redirect URLs** contiennent `/verify-email`
3. **Template email** pointe vers `{{ .SiteURL }}/verify-email`

## 🎉 Test de validation finale

Une fois la configuration terminée :

1. **Nouvel email** : `test-final-2024@gmail.com`
2. **Inscription complète** via l'interface
3. **Email reçu** avec bon lien
4. **Clic sur lien** → Redirection réussie
5. **Candidat dans `inscrits`** avec statut `en_attente`

---

**⚡ Temps estimé** : 5 minutes  
**💡 Avantage** : Pas besoin de Docker, configuration directe  
**🔒 Sécurité** : Instance Supabase hébergée avec SSL 