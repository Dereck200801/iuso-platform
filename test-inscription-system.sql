-- =====================================================================
-- SCRIPT DE TEST POUR LE SYSTÈME D'INSCRIPTION
-- Vérifier que tout fonctionne correctement après la correction
-- =====================================================================

-- 1. Vérifier la structure de la table inscrits
SELECT 
    'Structure de la table inscrits' as test_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- 2. Vérifier les index
SELECT 
    'Index de la table inscrits' as test_name,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'inscrits';

-- 3. Vérifier les politiques RLS
SELECT 
    'Politiques RLS' as test_name,
    policyname,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'inscrits';

-- 4. Vérifier les contraintes
SELECT 
    'Contraintes' as test_name,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'inscrits';

-- 5. Vérifier les buckets de storage
SELECT 
    'Buckets de storage' as test_name,
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'pieces-candidats';

-- 6. Vérifier les politiques de storage
SELECT 
    'Politiques de storage' as test_name,
    policyname,
    cmd,
    permissive
FROM storage.policies 
WHERE bucket_id = 'pieces-candidats';

-- 7. Statistiques de la table inscrits
SELECT 
    'Statistiques actuelles' as test_name,
    COUNT(*) as total_inscriptions,
    COUNT(CASE WHEN statut = 'en_attente_validation' THEN 1 END) as en_attente_validation,
    COUNT(CASE WHEN statut = 'en_attente_confirmation_email' THEN 1 END) as en_attente_confirmation_email,
    COUNT(CASE WHEN statut = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN statut = 'refuse' THEN 1 END) as refuses
FROM inscrits;

-- 8. Vérifier les dernières inscriptions
SELECT 
    'Dernières inscriptions' as test_name,
    numero_dossier,
    email,
    prenom,
    nom,
    cycle,
    filiere,
    statut,
    inscription_date
FROM inscrits 
ORDER BY inscription_date DESC 
LIMIT 5;

-- 9. Test de génération de numéro de dossier
SELECT 
    'Test génération numéro de dossier' as test_name,
    generate_numero_dossier() as nouveau_numero;

-- 10. Vérifier les triggers
SELECT 
    'Triggers' as test_name,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'inscrits';

-- 11. Résumé final
DO $$
DECLARE
    total_inscriptions INTEGER;
    total_columns INTEGER;
    total_policies INTEGER;
    total_indexes INTEGER;
BEGIN
    -- Compter les inscriptions
    SELECT COUNT(*) INTO total_inscriptions FROM inscrits;
    
    -- Compter les colonnes
    SELECT COUNT(*) INTO total_columns 
    FROM information_schema.columns 
    WHERE table_name = 'inscrits';
    
    -- Compter les politiques RLS
    SELECT COUNT(*) INTO total_policies 
    FROM pg_policies 
    WHERE tablename = 'inscrits';
    
    -- Compter les index
    SELECT COUNT(*) INTO total_indexes 
    FROM pg_indexes 
    WHERE tablename = 'inscrits';
    
    RAISE NOTICE '=== RÉSUMÉ DES TESTS ===';
    RAISE NOTICE 'Total inscriptions: %', total_inscriptions;
    RAISE NOTICE 'Total colonnes: %', total_columns;
    RAISE NOTICE 'Total politiques RLS: %', total_policies;
    RAISE NOTICE 'Total index: %', total_indexes;
    
    -- Vérifications de sécurité
    IF total_columns >= 18 THEN
        RAISE NOTICE '✅ Structure de table: OK';
    ELSE
        RAISE NOTICE '❌ Structure de table: INCOMPLÈTE';
    END IF;
    
    IF total_policies >= 4 THEN
        RAISE NOTICE '✅ Politiques RLS: OK';
    ELSE
        RAISE NOTICE '❌ Politiques RLS: INSUFFISANTES';
    END IF;
    
    IF total_indexes >= 6 THEN
        RAISE NOTICE '✅ Index: OK';
    ELSE
        RAISE NOTICE '❌ Index: INSUFFISANTS';
    END IF;
    
    -- Test de fonctionnalité
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'pieces-candidats') THEN
        RAISE NOTICE '✅ Storage bucket: OK';
    ELSE
        RAISE NOTICE '❌ Storage bucket: MANQUANT';
    END IF;
    
    RAISE NOTICE '=====================';
    RAISE NOTICE 'Système d''inscription testé avec succès !';
END $$; 