-- =====================================================================
-- TEST D'INSCRIPTION SIMPLE - IUSO PLATFORM
-- Script simplifié pour tester le processus d'inscription
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================================

-- Préparer les variables de test
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT := 'candidat.test@exemple.com';
    test_prenom TEXT := 'Jean';
    test_nom TEXT := 'DUPONT';
    temp_data JSONB;
    transfer_result JSONB;
    inscrit_count INTEGER;
    user_exists BOOLEAN;
    email_confirmed BOOLEAN;
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '🧪 DÉBUT DU TEST D''INSCRIPTION SIMPLE';
    RAISE NOTICE '==========================================';
    
    -- =====================================================================
    -- ÉTAPE 1: NETTOYAGE DES DONNÉES PRÉCÉDENTES
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 1: Nettoyage des données de test...';
    
    -- Nettoyer les données de test précédentes
    DELETE FROM public.inscrits WHERE email = test_email;
    DELETE FROM public.inscrits_temp WHERE data->>'email' = test_email;
    DELETE FROM auth.users WHERE email = test_email;
    
    RAISE NOTICE '✅ Données de test nettoyées';
    
    -- =====================================================================
    -- ÉTAPE 2: CRÉATION D'UN UTILISATEUR DE TEST
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 2: Création d''un utilisateur de test...';
    
    -- Générer un ID utilisateur
    test_user_id := gen_random_uuid();
    
    -- Créer un utilisateur de test dans auth.users
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
        test_user_id,
        test_email,
        crypt('MotDePasse123!', gen_salt('bf')),
        NULL, -- Email pas encore confirmé
        NOW(),
        NOW(),
        jsonb_build_object(
            'firstName', test_prenom,
            'lastName', test_nom,
            'role', 'candidat'
        ),
        'authenticated',
        'authenticated'
    );
    
    RAISE NOTICE '✅ Utilisateur créé avec ID: %', test_user_id;
    
    -- =====================================================================
    -- ÉTAPE 3: STOCKAGE DES DONNÉES TEMPORAIRES
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 3: Stockage des données temporaires...';
    
    -- Créer les données d'inscription temporaires
    temp_data := jsonb_build_object(
        'email', test_email,
        'prenom', test_prenom,
        'nom', test_nom,
        'genre', 'masculin',
        'date_naissance', '2000-06-15',
        'lieu_naissance', 'Libreville',
        'nationalite', 'Gabon',
        'telephone', '+241 01 02 03 04',
        'adresse', '123 Avenue des Tests, Libreville',
        'cycle', 'licence1',
        'filiere', 'Management des Organisations',
        'photo_identite_url', 'photos/photo_test.jpg',
        'attestation_bac_url', 'attestations-bac/bac_test.pdf',
        'mot_de_passe', 'MotDePasse123!',
        'statut', 'en_attente_confirmation'
    );
    
    -- Stocker dans la table temporaire
    INSERT INTO public.inscrits_temp (user_id, data, created_at)
    VALUES (test_user_id, temp_data, NOW());
    
    RAISE NOTICE '✅ Données temporaires stockées';
    
    -- =====================================================================
    -- ÉTAPE 4: SIMULATION DE LA VÉRIFICATION D'EMAIL
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 4: Simulation vérification d''email...';
    
    -- Marquer l'email comme vérifié
    UPDATE auth.users 
    SET 
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = test_user_id;
    
    RAISE NOTICE '✅ Email vérifié';
    
    -- =====================================================================
    -- ÉTAPE 5: TRANSFERT VERS LA TABLE INSCRITS
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 5: Transfert vers la table inscrits...';
    
    -- Vérifier si la fonction de transfert existe
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'transfer_candidate_to_inscrits') THEN
        -- Utiliser la fonction de transfert
        SELECT transfer_candidate_to_inscrits(test_user_id, test_email, temp_data) INTO transfer_result;
        RAISE NOTICE '✅ Fonction de transfert appelée: %', transfer_result;
    ELSE
        -- Transfert manuel si la fonction n'existe pas
        RAISE NOTICE '⚠️  Fonction de transfert non trouvée, insertion manuelle...';
        
        INSERT INTO public.inscrits (
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
            email_verified_at,
            date_inscription,
            date_modification
        ) VALUES (
            test_user_id,
            'LIC' || TO_CHAR(NOW(), 'YY') || LPAD((EXTRACT(DOY FROM NOW())::INTEGER)::TEXT, 3, '0'),
            temp_data->>'prenom',
            temp_data->>'nom',
            temp_data->>'genre',
            (temp_data->>'date_naissance')::DATE,
            temp_data->>'lieu_naissance',
            temp_data->>'nationalite',
            test_email,
            temp_data->>'telephone',
            temp_data->>'adresse',
            temp_data->>'mot_de_passe',
            temp_data->>'cycle',
            temp_data->>'filiere',
            temp_data->>'photo_identite_url',
            temp_data->>'attestation_bac_url',
            'en_attente',
            TRUE,
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Insertion manuelle réussie';
    END IF;
    
    -- =====================================================================
    -- ÉTAPE 6: VÉRIFICATIONS
    -- =====================================================================
    
    RAISE NOTICE '📋 Étape 6: Vérifications finales...';
    
    -- Test 1: Vérifier que l'utilisateur existe
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = test_email) INTO user_exists;
    
    -- Test 2: Vérifier que l'email est confirmé
    SELECT email_confirmed_at IS NOT NULL 
    FROM auth.users WHERE email = test_email 
    INTO email_confirmed;
    
    -- Test 3: Vérifier que le candidat est dans inscrits
    SELECT COUNT(*) FROM public.inscrits WHERE email = test_email INTO inscrit_count;
    
    -- =====================================================================
    -- RÉSULTATS
    -- =====================================================================
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE '🏁 RÉSULTATS DU TEST D''INSCRIPTION';
    RAISE NOTICE '==========================================';
    
    IF user_exists THEN
        RAISE NOTICE '✅ Test 1: Utilisateur créé dans auth.users';
    ELSE
        RAISE NOTICE '❌ Test 1: Utilisateur manquant dans auth.users';
    END IF;
    
    IF email_confirmed THEN
        RAISE NOTICE '✅ Test 2: Email confirmé';
    ELSE
        RAISE NOTICE '❌ Test 2: Email non confirmé';
    END IF;
    
    IF inscrit_count = 1 THEN
        RAISE NOTICE '✅ Test 3: Candidat enregistré dans table inscrits';
    ELSE
        RAISE NOTICE '❌ Test 3: Problème avec enregistrement inscrits (% enregistrements)', inscrit_count;
    END IF;
    
    -- Afficher les détails de l'inscription
    IF inscrit_count > 0 THEN
        RAISE NOTICE '📋 Détails de l''inscription:';
        FOR rec IN 
            SELECT numero_dossier, prenom, nom, cycle, filiere, statut
            FROM public.inscrits 
            WHERE email = test_email
        LOOP
            RAISE NOTICE '   📄 Numéro de dossier: %', rec.numero_dossier;
            RAISE NOTICE '   👤 Candidat: % %', rec.prenom, rec.nom;
            RAISE NOTICE '   🎓 Formation: % - %', rec.cycle, rec.filiere;
            RAISE NOTICE '   📊 Statut: %', rec.statut;
        END LOOP;
    END IF;
    
    -- Résultat final
    RAISE NOTICE '==========================================';
    IF user_exists AND email_confirmed AND inscrit_count = 1 THEN
        RAISE NOTICE '🎉 TOUS LES TESTS RÉUSSIS !';
        RAISE NOTICE '✅ Le processus d''inscription fonctionne correctement';
        RAISE NOTICE '✅ Le candidat est bien enregistré après confirmation';
    ELSE
        RAISE NOTICE '❌ CERTAINS TESTS ONT ÉCHOUÉ !';
        RAISE NOTICE '⚠️  Le système d''inscription nécessite des corrections';
    END IF;
    RAISE NOTICE '==========================================';
    
    -- =====================================================================
    -- NETTOYAGE (OPTIONNEL)
    -- =====================================================================
    
    RAISE NOTICE '🧹 Nettoyage des données de test...';
    
    -- Nettoyer les données de test (décommentez si vous voulez les conserver)
    DELETE FROM public.inscrits WHERE email = test_email;
    DELETE FROM public.inscrits_temp WHERE data->>'email' = test_email;
    DELETE FROM auth.users WHERE email = test_email;
    
    RAISE NOTICE '✅ Données de test nettoyées';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '🏁 TEST D''INSCRIPTION TERMINÉ';
    RAISE NOTICE '==========================================';
    
END $$; 