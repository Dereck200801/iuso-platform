-- =====================================================================
-- TEST D'INSCRIPTION COMPLÈTE IUSO PLATFORM
-- Simule une inscription complète depuis le formulaire jusqu'à l'enregistrement
-- dans la table inscrits après confirmation d'email
-- =====================================================================

-- Configuration du test
\set test_email 'candidat.test@exemple.com'
\set test_prenom 'Jean'
\set test_nom 'DUPONT'
\set test_genre 'masculin'
\set test_date_naissance '2000-06-15'
\set test_lieu_naissance 'Libreville'
\set test_nationalite 'Gabon'
\set test_telephone '+241 01 02 03 04'
\set test_adresse '123 Avenue des Tests, Libreville'
\set test_cycle 'licence1'
\set test_filiere 'Management des Organisations'
\set test_password 'MotDePasse123!'

RAISE NOTICE '==========================================';
RAISE NOTICE '🧪 DÉBUT DU TEST D''INSCRIPTION COMPLÈTE';
RAISE NOTICE '==========================================';

-- =====================================================================
-- ÉTAPE 1: PRÉPARATION DU TEST
-- =====================================================================

RAISE NOTICE '📋 Étape 1: Préparation du test...';

-- Nettoyer les données de test précédentes
DELETE FROM public.inscrits WHERE email = :'test_email';
DELETE FROM public.inscrits_temp WHERE data->>'email' = :'test_email';

-- Supprimer l'utilisateur de test s'il existe
DELETE FROM auth.users WHERE email = :'test_email';

RAISE NOTICE '✅ Données de test nettoyées';

-- =====================================================================
-- ÉTAPE 2: SIMULATION CRÉATION COMPTE SUPABASE AUTH
-- =====================================================================

RAISE NOTICE '📋 Étape 2: Simulation création compte Supabase Auth...';

-- Insérer un utilisateur de test dans auth.users (simulation)
-- Note: En réalité, ceci est fait par supabase.auth.signUp()
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    role,
    aud
) VALUES (
    gen_random_uuid(),
    :'test_email',
    crypt(:'test_password', gen_salt('bf')),
    NULL, -- Email pas encore confirmé
    NOW(),
    NOW(),
    jsonb_build_object(
        'firstName', :'test_prenom',
        'lastName', :'test_nom',
        'role', 'candidat'
    ),
    'authenticated',
    'authenticated'
) RETURNING id as user_id;

-- Récupérer l'ID utilisateur créé
\gset

SELECT id FROM auth.users WHERE email = :'test_email' LIMIT 1;
\gset user_id_result 

RAISE NOTICE '✅ Utilisateur créé avec ID: %', :'user_id_result';

-- =====================================================================
-- ÉTAPE 3: SIMULATION DES UPLOADS DE FICHIERS
-- =====================================================================

RAISE NOTICE '📋 Étape 3: Simulation upload des fichiers...';

-- Simuler l'upload des fichiers dans le storage
-- En réalité, les fichiers sont uploadés via l'API Supabase Storage
INSERT INTO storage.objects (
    id,
    bucket_id,
    name,
    owner,
    created_at,
    updated_at,
    last_accessed_at,
    metadata
) VALUES 
(
    gen_random_uuid(),
    'pieces-candidats',
    'photos/photo_' || :'user_id_result' || '_' || extract(epoch from now()) || '.jpg',
    :'user_id_result'::uuid,
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('size', 1024000, 'mimetype', 'image/jpeg')
),
(
    gen_random_uuid(),
    'pieces-candidats',
    'attestations-bac/bac_' || :'user_id_result' || '_' || extract(epoch from now()) || '.pdf',
    :'user_id_result'::uuid,
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('size', 2048000, 'mimetype', 'application/pdf')
);

-- Récupérer les URLs des fichiers
SELECT name FROM storage.objects 
WHERE bucket_id = 'pieces-candidats' 
AND owner = :'user_id_result'::uuid 
AND name LIKE 'photos/%'
ORDER BY created_at DESC 
LIMIT 1;
\gset photo_url_result

SELECT name FROM storage.objects 
WHERE bucket_id = 'pieces-candidats' 
AND owner = :'user_id_result'::uuid 
AND name LIKE 'attestations-bac/%'
ORDER BY created_at DESC 
LIMIT 1;
\gset bac_url_result

RAISE NOTICE '✅ Fichiers uploadés:';
RAISE NOTICE '   📸 Photo: %', :'photo_url_result';
RAISE NOTICE '   📜 Attestation: %', :'bac_url_result';

-- =====================================================================
-- ÉTAPE 4: STOCKAGE DES DONNÉES TEMPORAIRES
-- =====================================================================

RAISE NOTICE '📋 Étape 4: Stockage des données temporaires...';

-- Créer les données d'inscription (équivalent de ce qui est stocké en localStorage)
INSERT INTO public.inscrits_temp (
    user_id,
    data,
    created_at
) VALUES (
    :'user_id_result'::uuid,
    jsonb_build_object(
        'email', :'test_email',
        'prenom', :'test_prenom',
        'nom', :'test_nom',
        'genre', :'test_genre',
        'date_naissance', :'test_date_naissance',
        'lieu_naissance', :'test_lieu_naissance',
        'nationalite', :'test_nationalite',
        'telephone', :'test_telephone',
        'adresse', :'test_adresse',
        'cycle', :'test_cycle',
        'filiere', :'test_filiere',
        'photo_identite_url', :'photo_url_result',
        'attestation_bac_url', :'bac_url_result',
        'mot_de_passe', :'test_password',
        'statut', 'en_attente_confirmation',
        'inscription_date', NOW()::text
    ),
    NOW()
);

RAISE NOTICE '✅ Données temporaires stockées';

-- Vérifier le stockage temporaire
SELECT COUNT(*) as count_temp FROM public.inscrits_temp WHERE user_id = :'user_id_result'::uuid;
\gset

RAISE NOTICE '📊 Données temporaires: % enregistrement(s)', :'count_temp';

-- =====================================================================
-- ÉTAPE 5: SIMULATION DE LA VÉRIFICATION D'EMAIL
-- =====================================================================

RAISE NOTICE '📋 Étape 5: Simulation vérification d''email...';

-- Marquer l'email comme vérifié (simulation du clic sur le lien de vérification)
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = :'user_id_result'::uuid;

RAISE NOTICE '✅ Email vérifié pour l''utilisateur %', :'user_id_result';

-- =====================================================================
-- ÉTAPE 6: TRANSFERT VERS LA TABLE INSCRITS
-- =====================================================================

RAISE NOTICE '📋 Étape 6: Transfert vers la table inscrits...';

-- Récupérer les données temporaires
SELECT data FROM public.inscrits_temp WHERE user_id = :'user_id_result'::uuid LIMIT 1;
\gset temp_data_result

-- Appeler la fonction de transfert
SELECT transfer_candidate_to_inscrits(
    :'user_id_result'::uuid,
    :'test_email',
    :'temp_data_result'::jsonb
) as transfer_result;
\gset

RAISE NOTICE '✅ Résultat du transfert: %', :'transfer_result';

-- =====================================================================
-- ÉTAPE 7: VÉRIFICATIONS FINALES
-- =====================================================================

RAISE NOTICE '📋 Étape 7: Vérifications finales...';

-- Vérifier que le candidat est bien dans la table inscrits
SELECT 
    COUNT(*) as count_inscrits,
    string_agg(numero_dossier, ', ') as numero_dossier,
    string_agg(statut, ', ') as statut
FROM public.inscrits 
WHERE email = :'test_email'
GROUP BY email;
\gset

-- Récupérer les détails de l'inscription
SELECT 
    numero_dossier,
    prenom,
    nom,
    email,
    cycle,
    filiere,
    statut,
    auth_user_id,
    transferred_from_temp,
    email_verified_at IS NOT NULL as email_verifie,
    date_inscription
FROM public.inscrits 
WHERE email = :'test_email';

-- Vérifications
DO $$
DECLARE 
    test_success BOOLEAN := true;
    inscrit_count INTEGER;
    user_exists BOOLEAN;
    email_confirmed BOOLEAN;
BEGIN
    -- Test 1: Vérifier que l'utilisateur existe
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = :'test_email') INTO user_exists;
    
    -- Test 2: Vérifier que l'email est confirmé
    SELECT email_confirmed_at IS NOT NULL 
    FROM auth.users 
    WHERE email = :'test_email' 
    INTO email_confirmed;
    
    -- Test 3: Vérifier que le candidat est dans inscrits
    SELECT COUNT(*) FROM public.inscrits WHERE email = :'test_email' INTO inscrit_count;
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE '🏁 RÉSULTATS DU TEST D''INSCRIPTION';
    RAISE NOTICE '==========================================';
    
    -- Résultats des tests
    IF user_exists THEN
        RAISE NOTICE '✅ Test 1: Utilisateur créé dans auth.users';
    ELSE
        RAISE NOTICE '❌ Test 1: Utilisateur manquant dans auth.users';
        test_success := false;
    END IF;
    
    IF email_confirmed THEN
        RAISE NOTICE '✅ Test 2: Email confirmé';
    ELSE
        RAISE NOTICE '❌ Test 2: Email non confirmé';
        test_success := false;
    END IF;
    
    IF inscrit_count = 1 THEN
        RAISE NOTICE '✅ Test 3: Candidat enregistré dans table inscrits (% enregistrement)', inscrit_count;
    ELSE
        RAISE NOTICE '❌ Test 3: Problème avec enregistrement inscrits (% enregistrements)', inscrit_count;
        test_success := false;
    END IF;
    
    -- Vérifications supplémentaires
    IF EXISTS(SELECT 1 FROM public.inscrits WHERE email = :'test_email' AND transferred_from_temp = true) THEN
        RAISE NOTICE '✅ Test 4: Flag transferred_from_temp correctement défini';
    ELSE
        RAISE NOTICE '❌ Test 4: Flag transferred_from_temp incorrect';
        test_success := false;
    END IF;
    
    IF EXISTS(SELECT 1 FROM public.inscrits WHERE email = :'test_email' AND numero_dossier IS NOT NULL) THEN
        RAISE NOTICE '✅ Test 5: Numéro de dossier généré';
    ELSE
        RAISE NOTICE '❌ Test 5: Numéro de dossier manquant';
        test_success := false;
    END IF;
    
    -- Résultat final
    RAISE NOTICE '==========================================';
    IF test_success THEN
        RAISE NOTICE '🎉 TOUS LES TESTS RÉUSSIS !';
        RAISE NOTICE '✅ Le processus d''inscription fonctionne correctement';
        RAISE NOTICE '✅ Le candidat est bien enregistré après confirmation';
    ELSE
        RAISE NOTICE '❌ CERTAINS TESTS ONT ÉCHOUÉ !';
        RAISE NOTICE '⚠️  Le système d''inscription nécessite des corrections';
    END IF;
    RAISE NOTICE '==========================================';
END $$;

-- =====================================================================
-- ÉTAPE 8: STATISTIQUES FINALES
-- =====================================================================

RAISE NOTICE '📊 Statistiques après test:';

SELECT 
    'État final' as test_type,
    COUNT(*) as total_inscrits,
    COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
    COUNT(CASE WHEN transferred_from_temp = true THEN 1 END) as transferes_temp,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as avec_auth_user
FROM public.inscrits;

-- =====================================================================
-- NETTOYAGE (OPTIONNEL)
-- =====================================================================

-- Décommenter ces lignes si vous voulez nettoyer après le test
-- DELETE FROM public.inscrits WHERE email = :'test_email';
-- DELETE FROM public.inscrits_temp WHERE data->>'email' = :'test_email';
-- DELETE FROM auth.users WHERE email = :'test_email';
-- DELETE FROM storage.objects WHERE owner = :'user_id_result'::uuid;

RAISE NOTICE '📝 Note: Les données de test sont conservées pour inspection.';
RAISE NOTICE '📝 Décommentez les lignes de nettoyage si vous voulez les supprimer.';

RAISE NOTICE '==========================================';
RAISE NOTICE '🏁 TEST D''INSCRIPTION TERMINÉ';
RAISE NOTICE '=========================================='; 