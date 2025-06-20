# 🚀 Guide de Configuration - Système de Confirmation d'Authentification

Ce guide vous explique comment configurer le système de confirmation d'authentification qui transfère automatiquement les candidats vers la table des inscrits après vérification de leur email.

## 📋 Vue d'ensemble du système

### Workflow actuel
1. **Inscription candidat** → Données stockées temporairement dans `auth.users.user_metadata`
2. **Email de vérification** → Envoyé automatiquement par Supabase
3. **Clic sur lien de confirmation** → Déclenche la fonction de transfert automatique
4. **Insertion dans table inscrits** → Candidature officiellement enregistrée avec numéro de dossier

### Avantages
- ✅ Pas d'inscription sans email vérifié
- ✅ Numéro de dossier unique garanti
- ✅ Processus entièrement automatisé
- ✅ Sécurité renforcée avec RLS
- ✅ Nettoyage automatique des données temporaires

## 🛠️ Configuration étape par étape

### Étape 1: Configuration de la base de données

#### 1.1 Exécuter le script SQL principal

1. Connectez-vous à votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Créez une nouvelle requête
4. Copiez tout le contenu du fichier `create-confirmation-system.sql`
5. Exécutez le script

```sql
-- Le script va créer:
-- ✅ Table inscrits avec la bonne structure
-- ✅ Fonction transfer_candidate_to_inscrits()
-- ✅ Fonction generate_numero_dossier_smart()
-- ✅ Fonction cleanup_expired_temp_data()
-- ✅ Politiques RLS sécurisées
-- ✅ Vues statistiques
-- ✅ Triggers automatiques
```

#### 1.2 Vérifier l'installation

Exécutez cette requête pour vérifier que tout est bien installé :

```sql
-- Vérifier les fonctions
SELECT proname, proargtypes 
FROM pg_proc 
WHERE proname IN (
    'transfer_candidate_to_inscrits',
    'generate_numero_dossier_smart',
    'cleanup_expired_temp_data'
);

-- Vérifier les politiques RLS
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'inscrits';

-- Vérifier la structure de la table
\d inscrits;
```

### Étape 2: Configuration des templates d'email

#### 2.1 Template de confirmation d'inscription

1. Allez dans **Authentication** > **Email Templates**
2. Sélectionnez **Confirm signup**
3. Remplacez le template par défaut par celui-ci :

**Sujet :**
```
Confirmez votre inscription au concours IUSO-SNE
```

**Corps du message (HTML) :**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: linear-gradient(135deg, #134074 0%, #1e5a8b 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎓 IUSO-SNE</h1>
    <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Institut Universitaire des Sciences de l'Organisation</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Confirmez votre inscription au concours</h2>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Bonjour,</p>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      Merci de vous être inscrit(e) au concours d'entrée IUSO-SNE ! 🎉
    </p>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      Pour <strong>finaliser votre inscription</strong> et activer votre candidature, veuillez cliquer sur le bouton ci-dessous :
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #134074 0%, #1e5a8b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(19, 64, 116, 0.3);">
        ✅ Confirmer mon inscription
      </a>
    </div>
    
    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #134074; margin: 20px 0;">
      <p style="margin: 0; color: #334155; font-weight: bold;">⏰ Ce lien est valide pendant 24 heures.</p>
    </div>
    
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
      <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">Après confirmation :</h3>
      <ul style="color: #047857; margin: 10px 0; padding-left: 20px;">
        <li>✅ Votre candidature sera automatiquement enregistrée</li>
        <li>📋 Vous recevrez votre numéro de dossier officiel</li>
        <li>🚀 Vous pourrez accéder à votre espace candidat</li>
        <li>📊 Vous pourrez suivre l'évolution de votre dossier</li>
      </ul>
    </div>
    
    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 30px;">
      Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email en toute sécurité.
    </p>
    
    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
      <p style="color: #475569; margin: 0; font-size: 16px;">
        Cordialement,<br>
        <strong>L'équipe IUSO-SNE</strong>
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px;">
    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
      Institut Universitaire des Sciences de l'Organisation - Secteur Nord Est<br>
      📧 Email: concours@iuso-sne.org | 🌐 Site: www.iuso-sne.org
    </p>
  </div>
</div>
```

#### 2.2 Configuration des redirections

1. Dans **Authentication** > **URL Configuration**
2. Configurez :
   - **Site URL** : `https://votre-domaine.com` ou `http://localhost:5173` pour le dev
   - **Redirect URLs** : Ajoutez `https://votre-domaine.com/verify-email`

### Étape 3: Configuration des politiques de sécurité

#### 3.1 Vérifier les politiques RLS

Les politiques suivantes doivent être actives sur la table `inscrits` :

```sql
-- Politiques créées automatiquement par le script
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'inscrits';
```

#### 3.2 Configuration du Storage (si pas déjà fait)

```sql
-- Créer le bucket pour les documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- Politique d'upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pieces-candidats' 
    AND auth.role() = 'authenticated'
);

-- Politique de lecture
CREATE POLICY "Users can view their documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats' 
    AND (
        auth.uid()::text = (storage.foldername(name))[1]
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@iuso-sne.%'
        )
    )
);
```

### Étape 4: Test du système

#### 4.1 Test d'inscription complète

1. **Inscription candidat**
   - Remplissez le formulaire d'inscription
   - Vérifiez que l'email de confirmation est envoyé
   - Vérifiez les données temporaires dans `auth.users`

```sql
-- Vérifier les données temporaires
SELECT 
    id, 
    email, 
    user_metadata->>'inscription_status' as status,
    user_metadata ? 'temp_inscription_data' as has_temp_data,
    email_confirmed_at
FROM auth.users 
WHERE email = 'test@example.com';
```

2. **Confirmation d'email**
   - Cliquez sur le lien dans l'email
   - Vérifiez la redirection vers la page de vérification
   - Vérifiez l'insertion dans la table `inscrits`

```sql
-- Vérifier l'insertion dans inscrits
SELECT 
    numero_dossier,
    email,
    prenom,
    nom,
    cycle,
    filiere,
    statut,
    transferred_from_temp,
    email_verified_at
FROM inscrits 
WHERE email = 'test@example.com';
```

#### 4.2 Test de la fonction de transfert

```sql
-- Test manuel de la fonction de transfert
SELECT transfer_candidate_to_inscrits(
    'uuid-de-l-utilisateur'::uuid,
    'test@example.com',
    '{"prenom": "Test", "nom": "User", "cycle": "licence1", "filiere": "Management"}'::jsonb
);
```

### Étape 5: Maintenance et monitoring

#### 5.1 Nettoyage automatique des données temporaires

Configurez un cron job pour nettoyer les données expirées :

```sql
-- Extension cron (si disponible)
SELECT cron.schedule(
    'cleanup-temp-data', 
    '0 2 * * *', 
    'SELECT cleanup_expired_temp_data();'
);

-- Ou exécutez manuellement régulièrement
SELECT cleanup_expired_temp_data();
```

#### 5.2 Monitoring et statistiques

```sql
-- Vue d'ensemble des confirmations
SELECT * FROM stats_confirmations;

-- Candidats par statut
SELECT * FROM candidats_by_status;

-- Utilisateurs en attente de confirmation
SELECT 
    count(*) as en_attente_confirmation,
    count(*) filter (where created_at < now() - interval '24 hours') as expires_bientot
FROM auth.users 
WHERE user_metadata->>'inscription_status' = 'pending_email_verification'
AND email_confirmed_at IS NULL;
```

## 🔧 Troubleshooting

### Problème : Email de confirmation non reçu

1. Vérifiez les paramètres SMTP dans Supabase
2. Vérifiez les filtres anti-spam
3. Testez avec l'API de resend :

```sql
-- Fonction pour renvoyer un email
SELECT auth.resend_confirmation_email('user@example.com');
```

### Problème : Fonction de transfert échoue

1. Vérifiez les logs dans l'onglet Logs de Supabase
2. Testez la fonction manuellement :

```sql
-- Debug de la fonction
SELECT transfer_candidate_to_inscrits(
    (SELECT id FROM auth.users WHERE email = 'test@example.com'),
    'test@example.com',
    (SELECT user_metadata->'temp_inscription_data' FROM auth.users WHERE email = 'test@example.com')
);
```

### Problème : Politiques RLS bloquent l'accès

```sql
-- Désactiver temporairement RLS pour debug
ALTER TABLE inscrits DISABLE ROW LEVEL SECURITY;

-- Test puis réactiver
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;
```

## 📊 Métriques importantes à surveiller

1. **Taux de confirmation d'email** : % d'utilisateurs qui confirment vs qui s'inscrivent
2. **Délai de confirmation** : Temps moyen entre inscription et confirmation
3. **Échecs de transfert** : Nombre d'erreurs dans la fonction de transfert
4. **Données temporaires accumulées** : Utilisateurs non confirmés > 7 jours

## 🔄 Évolutions futures possibles

1. **Relances automatiques** : Email de rappel après 24h sans confirmation
2. **Analytics avancées** : Tracking détaillé du funnel d'inscription
3. **API webhooks** : Notifications vers des systèmes externes
4. **Interface d'administration** : Gestion manuelle des confirmations

---

## 📞 Support

Pour toute question ou problème avec cette configuration :

1. Vérifiez d'abord les logs Supabase
2. Consultez la documentation officielle Supabase
3. Testez chaque étape individuellement
4. Contactez l'équipe technique IUSO-SNE

**Date de création :** Décembre 2024  
**Version :** 1.0  
**Auteur :** Système automatisé IUSO Platform 