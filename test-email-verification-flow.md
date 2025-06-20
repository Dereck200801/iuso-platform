# Test de la Page EmailVerificationPage

## 🧪 Tests à effectuer pour vérifier le bon fonctionnement

### 1. **Test de navigation directe**
```
URL: http://localhost:5173/verify-email
Résultat attendu: Page d'erreur (paramètres manquants)
Status: ❌ Erreur de vérification
```

### 2. **Test avec paramètres invalides**
```
URL: http://localhost:5173/verify-email?token=invalid&type=signup
Résultat attendu: Page d'erreur
Status: ❌ Erreur de vérification
```

### 3. **Test avec token expiré**
```
URL: http://localhost:5173/verify-email?token=expired_token&type=signup
Résultat attendu: Page d'expiration
Status: ⏰ Lien expiré
```

### 4. **Test complet d'inscription + vérification**

#### Étape 1: Inscription
1. Aller sur `/inscription`
2. Remplir le formulaire avec un **nouvel email**
3. Soumettre l'inscription
4. Vérifier la redirection vers `/confirmation` avec message d'attente

#### Étape 2: Vérification d'email
1. Ouvrir la console du navigateur (F12)
2. Simuler un clic sur le lien d'email en allant sur :
   ```
   http://localhost:5173/verify-email?token=REAL_TOKEN&type=signup
   ```
3. Observer les logs dans la console

#### Logs attendus dans la console :
```javascript
EmailVerificationPage - Paramètres URL: { token: "abc123...", type: "signup" }
Résultat vérification OTP: { success: true, user: "email@test.com", error: null }
Données temporaires trouvées: true
Données d'inscription récupérées: { email: "email@test.com", prenom: "Test", nom: "User" }
Inscription finalisée avec succès, numéro: IUSO123456
```

### 5. **Vérifications en base de données**

Après un test réussi, vérifier dans Supabase :

```sql
-- Vérifier que l'utilisateur est confirmé
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'votre-email-test@example.com';

-- Vérifier que l'inscription est dans la table inscrits
SELECT user_id, email, prenom, nom, numero_dossier, statut 
FROM inscrits 
WHERE email = 'votre-email-test@example.com';
```

### 6. **Test des fonctionnalités de la page**

#### Test du bouton "Renvoyer l'email"
1. Aller sur une page d'erreur ou d'expiration
2. Cliquer sur "Renvoyer l'email de vérification"
3. Vérifier qu'un toast de succès s'affiche

#### Test du bouton "Recommencer l'inscription"
1. Cliquer sur "Recommencer l'inscription"
2. Vérifier la redirection vers `/inscription`

#### Test du bouton "Voir les détails"
1. Sur une page de succès, cliquer sur "🎉 Voir les détails de mon inscription"
2. Vérifier la redirection vers `/confirmation` avec les bonnes données

### 7. **Test des états visuels**

#### État de chargement
- ✅ Icône de loading qui tourne
- ✅ Message "Vérification en cours..."
- ✅ Alert bleue avec spinner

#### État de succès
- ✅ Icône verte avec animation bounce
- ✅ Message "✅ Email vérifié avec succès !"
- ✅ Alert verte avec détails
- ✅ Section "Prochaines étapes"
- ✅ Bouton vert "Voir les détails"

#### État d'erreur
- ✅ Icône rouge
- ✅ Message "❌ Erreur de vérification"
- ✅ Alert rouge avec explication
- ✅ Boutons de récupération

#### État d'expiration
- ✅ Icône rouge
- ✅ Message "⏰ Lien expiré"
- ✅ Alert jaune d'avertissement
- ✅ Boutons de renvoi d'email

### 8. **Test de la gestion d'erreurs**

#### Test sans données temporaires
1. Supprimer manuellement les données localStorage
2. Essayer la vérification
3. Vérifier que ça fonctionne quand même (avec données par défaut)

#### Test avec données localStorage corrompues
1. Modifier manuellement localStorage avec des données invalides
2. Essayer la vérification
3. Vérifier la gestion d'erreur

### 9. **Checklist finale**

- [ ] Page se charge sans erreur
- [ ] Tous les états visuels s'affichent correctement
- [ ] Les logs de debug sont visibles dans la console
- [ ] La vérification d'email fonctionne avec de vrais tokens
- [ ] Les données sont correctement insérées en base
- [ ] Les redirections fonctionnent
- [ ] Les toasts d'erreur/succès s'affichent
- [ ] Le renvoi d'email fonctionne
- [ ] La gestion d'erreurs est robuste

### 🐛 **Problèmes courants et solutions**

#### "Token invalide"
- Vérifier que les Redirect URLs sont configurées dans Supabase
- Vérifier que le token n'a pas expiré (24h)

#### "Données temporaires non trouvées"
- Normal si l'utilisateur navigue directement vers la page
- Le système gère ce cas avec des données par défaut

#### "Erreur d'insertion en base"
- Vérifier que la table `inscrits` a toutes les colonnes
- Vérifier les politiques RLS
- Vérifier que l'utilisateur est bien authentifié

#### "Page blanche"
- Vérifier les erreurs dans la console
- Vérifier que toutes les dépendances sont importées
- Vérifier la configuration des routes

---

**✅ Si tous ces tests passent, la page EmailVerificationPage est prête pour la production !** 