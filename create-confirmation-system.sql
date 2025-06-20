-- =====================================================================
-- SYSTÈME DE CONFIRMATION D'AUTHENTIFICATION POUR IUSO PLATFORM
-- Transfert automatique vers la table inscrits après vérification email
-- =====================================================================

-- Assurer que la table inscrits existe avec la bonne structure
CREATE TABLE IF NOT EXISTS inscrits (
  -- Clé primaire
  id SERIAL PRIMARY KEY,
  
  -- Référence utilisateur auth (optionnel - peut être null avant transfert)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Identifiant unique (numéro de dossier auto-généré)
  numero_dossier VARCHAR(20) UNIQUE NOT NULL,
  
  -- Informations personnelles
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  genre VARCHAR(20) NOT NULL CHECK (genre IN ('masculin', 'feminin', 'autre')),
  date_naissance DATE NOT NULL,
  lieu_naissance VARCHAR(100) NOT NULL,
  nationalite VARCHAR(100) NOT NULL,
  
  -- Coordonnées
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  adresse TEXT NOT NULL,
  
  -- Accès au compte
  mot_de_passe VARCHAR(255) NOT NULL,
  
  -- Formation
  cycle VARCHAR(20) NOT NULL CHECK (cycle IN ('licence1', 'dut')),
  filiere VARCHAR(100) NOT NULL,
  
  -- Documents
  photo_identite_url VARCHAR(500),
  attestation_bac_url VARCHAR(500),
  
  -- Statut et métadonnées
  statut VARCHAR(30) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse', 'en_cours', 'en_attente_confirmation')),
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Métadonnées de transfert
  transferred_from_temp BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP
);

-- =====================================================================
-- FONCTION DE GÉNÉRATION DE NUMÉRO DE DOSSIER
-- =====================================================================

-- Fonction améliorée pour générer automatiquement le numéro de dossier
CREATE OR REPLACE FUNCTION generate_numero_dossier_smart(p_cycle VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    prefix VARCHAR(3);
    year VARCHAR(2);
    counter INTEGER;
    new_numero_dossier VARCHAR(20);
BEGIN
    -- Déterminer le préfixe selon le cycle
    CASE p_cycle
        WHEN 'licence1' THEN prefix := 'LIC';
        WHEN 'dut' THEN prefix := 'BTS';
        ELSE prefix := 'GEN';
    END CASE;
    
    -- Année sur 2 chiffres
    year := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Trouver le prochain numéro disponible pour ce préfixe et cette année
    SELECT COALESCE(MAX(
        CASE 
            WHEN numero_dossier ~ '^' || prefix || year || '[0-9]{3}$' 
            THEN CAST(SUBSTRING(numero_dossier FROM '[0-9]{3}$') AS INTEGER)
            ELSE 0 
        END
    ), 0) + 1
    INTO counter
    FROM inscrits 
    WHERE numero_dossier LIKE prefix || year || '%';
    
    -- Générer le numéro de dossier final (ex: LIC24001, BTS24001)
    new_numero_dossier := prefix || year || LPAD(counter::TEXT, 3, '0');
    
    RETURN new_numero_dossier;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- FONCTION DE TRANSFERT DES CANDIDATS VERS INSCRITS
-- =====================================================================

-- Fonction principale pour transférer un candidat depuis les données temporaires
CREATE OR REPLACE FUNCTION transfer_candidate_to_inscrits(
    p_user_id UUID,
    p_email VARCHAR,
    p_temp_data JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_numero_dossier VARCHAR(20);
    v_inscrit_id INTEGER;
    v_result JSONB;
BEGIN
    -- Vérifier que l'utilisateur auth existe et que l'email est vérifié
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = p_user_id 
        AND email = p_email 
        AND email_confirmed_at IS NOT NULL
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Utilisateur non trouvé ou email non vérifié'
        );
    END IF;
    
    -- Vérifier que les données temporaires existent
    IF p_temp_data IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Aucune donnée temporaire trouvée'
        );
    END IF;
    
    -- Vérifier si le candidat n'est pas déjà dans la table inscrits
    IF EXISTS (SELECT 1 FROM inscrits WHERE email = p_email) THEN
        -- Récupérer le numéro de dossier existant
        SELECT numero_dossier INTO v_numero_dossier 
        FROM inscrits WHERE email = p_email;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Candidat déjà inscrit',
            'numero_dossier', v_numero_dossier
        );
    END IF;
    
    -- Générer le numéro de dossier
    v_numero_dossier := generate_numero_dossier_smart(p_temp_data->>'cycle');
    
    -- Insérer dans la table inscrits
    INSERT INTO inscrits (
        auth_user_id,
        numero_dossier,
        prenom,
        nom,
        genre,
        date_naissance,
        lieu_naissance,
        nationalite,
        email,
        telephone,
        adresse,
        mot_de_passe,
        cycle,
        filiere,
        photo_identite_url,
        attestation_bac_url,
        statut,
        transferred_from_temp,
        email_verified_at
    ) VALUES (
        p_user_id,
        v_numero_dossier,
        p_temp_data->>'prenom',
        p_temp_data->>'nom',
        p_temp_data->>'genre',
        (p_temp_data->>'date_naissance')::DATE,
        p_temp_data->>'lieu_naissance',
        p_temp_data->>'nationalite',
        p_email,
        p_temp_data->>'telephone',
        p_temp_data->>'adresse',
        p_temp_data->>'mot_de_passe',
        p_temp_data->>'cycle',
        p_temp_data->>'filiere',
        p_temp_data->>'photo_identite_url',
        p_temp_data->>'attestation_bac_url',
        'en_attente',
        TRUE,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO v_inscrit_id;
    
    -- Construire la réponse de succès
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Candidat transféré avec succès',
        'numero_dossier', v_numero_dossier,
        'inscrit_id', v_inscrit_id,
        'transfer_date', CURRENT_TIMESTAMP
    );
    
    -- Log de l'opération
    RAISE NOTICE 'Candidat % transféré avec succès - Numéro de dossier: %', p_email, v_numero_dossier;
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, retourner les détails
        RAISE NOTICE 'Erreur lors du transfert du candidat %: %', p_email, SQLERRM;
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- FONCTION DE NETTOYAGE DES DONNÉES TEMPORAIRES
-- =====================================================================

-- Fonction pour nettoyer les données temporaires expirées (plus de 7 jours)
CREATE OR REPLACE FUNCTION cleanup_expired_temp_data()
RETURNS JSONB AS $$
DECLARE
    v_cleaned_count INTEGER := 0;
    v_user_record RECORD;
BEGIN
    -- Parcourir les utilisateurs avec des données temporaires expirées
    FOR v_user_record IN 
        SELECT id, email, user_metadata 
        FROM auth.users 
        WHERE user_metadata ? 'temp_inscription_data'
        AND user_metadata ? 'inscription_status'
        AND user_metadata->>'inscription_status' = 'pending_email_verification'
        AND created_at < (CURRENT_TIMESTAMP - INTERVAL '7 days')
        AND email_confirmed_at IS NULL
    LOOP
        -- Supprimer les données temporaires
        UPDATE auth.users 
        SET user_metadata = user_metadata - 'temp_inscription_data' - 'inscription_status' - 'needs_email_verification'
        WHERE id = v_user_record.id;
        
        v_cleaned_count := v_cleaned_count + 1;
        
        RAISE NOTICE 'Données temporaires nettoyées pour l''utilisateur: %', v_user_record.email;
    END LOOP;
    
    RETURN jsonb_build_object(
        'success', true,
        'cleaned_count', v_cleaned_count,
        'cleanup_date', CURRENT_TIMESTAMP
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- TRIGGERS ET AUTOMATISATION
-- =====================================================================

-- Trigger pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION update_inscrits_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS trigger_update_inscrits_modified_time ON inscrits;
CREATE TRIGGER trigger_update_inscrits_modified_time
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_inscrits_modified_time();

-- =====================================================================
-- POLITIQUES DE SÉCURITÉ RLS
-- =====================================================================

-- Activer RLS sur la table inscrits
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs propres inscriptions" ON inscrits;
DROP POLICY IF EXISTS "Permettre l'insertion pour tous" ON inscrits;
DROP POLICY IF EXISTS "Administrateurs peuvent tout voir" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for registration" ON inscrits;
DROP POLICY IF EXISTS "Users can view own record" ON inscrits;
DROP POLICY IF EXISTS "Users can update own record" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all records" ON inscrits;
DROP POLICY IF EXISTS "Admins can update all records" ON inscrits;

-- Nouvelles politiques RLS
-- 1. Permettre l'insertion via la fonction de transfert (sécurisée par SECURITY DEFINER)
CREATE POLICY "Allow function insert" ON inscrits
    FOR INSERT 
    WITH CHECK (true);

-- 2. Les candidats peuvent voir leur propre dossier (après transfert)
CREATE POLICY "Candidates can view own record" ON inscrits
    FOR SELECT 
    USING (auth_user_id = auth.uid());

-- 3. Les candidats peuvent mettre à jour leur propre dossier
CREATE POLICY "Candidates can update own record" ON inscrits
    FOR UPDATE 
    USING (auth_user_id = auth.uid());

-- 4. Les administrateurs peuvent tout voir et modifier
CREATE POLICY "Admins can view all records" ON inscrits
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'admin'
                OR auth.users.email LIKE '%@iuso-sne.%'
            )
        )
    );

CREATE POLICY "Admins can update all records" ON inscrits
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'admin'
                OR auth.users.email LIKE '%@iuso-sne.%'
            )
        )
    );

-- =====================================================================
-- VUES UTILES
-- =====================================================================

-- Vue pour les statistiques des confirmations
CREATE OR REPLACE VIEW stats_confirmations AS
SELECT 
    COUNT(*) as total_inscrits,
    COUNT(CASE WHEN transferred_from_temp = TRUE THEN 1 END) as transfers_auto,
    COUNT(CASE WHEN email_verified_at IS NOT NULL THEN 1 END) as emails_verifies,
    COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
    COUNT(CASE WHEN statut = 'accepte' THEN 1 END) as acceptes,
    COUNT(CASE WHEN statut = 'refuse' THEN 1 END) as refuses,
    DATE_TRUNC('day', MIN(date_inscription)) as premiere_inscription,
    DATE_TRUNC('day', MAX(date_inscription)) as derniere_inscription
FROM inscrits;

-- Vue pour le suivi des candidats par statut
CREATE OR REPLACE VIEW candidats_by_status AS
SELECT 
    statut,
    cycle,
    filiere,
    COUNT(*) as nombre,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as pourcentage
FROM inscrits
GROUP BY statut, cycle, filiere
ORDER BY statut, cycle, filiere;

-- =====================================================================
-- TEMPLATE EMAIL SUPABASE POUR CONFIRMATION
-- =====================================================================

-- Configuration du template de confirmation pour Supabase
-- (À configurer dans le dashboard Supabase > Authentication > Email Templates)

/*
TEMPLATE DE CONFIRMATION D'EMAIL POUR SUPABASE:

Sujet: Confirmez votre inscription au concours IUSO-SNE

Corps du message:
<h2>Confirmez votre inscription au concours</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit(e) au concours d'entrée IUSO-SNE !</p>

<p>Pour finaliser votre inscription et activer votre candidature, veuillez cliquer sur le lien ci-dessous :</p>

<p><a href="{{ .ConfirmationURL }}" style="background-color: #134074; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Confirmer mon inscription</a></p>

<p>Ce lien est valide pendant 24 heures.</p>

<p><strong>Après confirmation :</strong></p>
<ul>
  <li>✅ Votre candidature sera automatiquement enregistrée</li>
  <li>📋 Vous recevrez votre numéro de dossier officiel</li>
  <li>🚀 Vous pourrez accéder à votre espace candidat</li>
</ul>

<p>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.</p>

<p>Cordialement,<br>
L'équipe IUSO-SNE</p>

<hr>
<p style="font-size: 12px; color: #666;">
Institut Universitaire des Sciences de l'Organisation - Secteur Nord Est<br>
Email: concours@iuso-sne.org
</p>
*/

-- =====================================================================
-- INSTRUCTIONS DE DÉPLOIEMENT
-- =====================================================================

/*
POUR DÉPLOYER CE SYSTÈME:

1. Exécutez ce script SQL dans le dashboard Supabase (SQL Editor)

2. Configurez le template d'email dans Authentication > Email Templates > Confirm signup

3. Vérifiez que les politiques RLS sont actives:
   - Allez dans Table Editor > inscrits > RLS policies

4. Testez le workflow:
   - Inscription d'un candidat (données stockées temporairement)
   - Clic sur lien de confirmation dans l'email
   - Vérification du transfert automatique vers la table inscrits

5. Optionnel: Configurez un cron job pour le nettoyage automatique:
   SELECT cron.schedule('cleanup-temp-data', '0 2 * * *', 'SELECT cleanup_expired_temp_data();');
*/

-- =====================================================================
-- VÉRIFICATIONS FINALES
-- =====================================================================

-- Vérifier que toutes les fonctions sont créées
SELECT 
    'Fonction créée: ' || proname as status
FROM pg_proc 
WHERE proname IN (
    'generate_numero_dossier_smart',
    'transfer_candidate_to_inscrits', 
    'cleanup_expired_temp_data',
    'update_inscrits_modified_time'
)
ORDER BY proname;

-- Vérifier les politiques RLS
SELECT 
    'Politique RLS: ' || policyname as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'inscrits'
ORDER BY policyname;

-- Message de confirmation final
DO $$
BEGIN
    RAISE NOTICE '🎉 SYSTÈME DE CONFIRMATION D''AUTHENTIFICATION CONFIGURÉ AVEC SUCCÈS !';
    RAISE NOTICE '📧 Configurez maintenant le template d''email dans le dashboard Supabase';
    RAISE NOTICE '✅ Les candidats seront automatiquement transférés vers la table inscrits après confirmation d''email';
    RAISE NOTICE '🔒 Politiques RLS activées pour la sécurité';
    RAISE NOTICE '🧹 Fonction de nettoyage automatique disponible';
END $$; 