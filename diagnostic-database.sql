-- Script de diagnostic pour la base de données IUSO-SNE
-- Ce script vérifie l'état actuel des tables et configurations

-- 1. Vérifier si la table inscrits existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inscrits')
        THEN '✅ Table inscrits existe'
        ELSE '❌ Table inscrits n''existe pas'
    END as table_status;

-- 2. Vérifier la structure de la table inscrits
SELECT 
    '📋 Structure de la table inscrits:' as info;

SELECT 
    column_name as "Colonne",
    data_type as "Type",
    is_nullable as "Nullable",
    column_default as "Défaut"
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- 3. Vérifier les contraintes de clé étrangère
SELECT 
    '🔗 Contraintes de clé étrangère:' as info;

SELECT 
    tc.constraint_name as "Contrainte",
    tc.table_name as "Table",
    kcu.column_name as "Colonne",
    ccu.table_name as "Table_référencée",
    ccu.column_name as "Colonne_référencée"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'inscrits';

-- 4. Vérifier les index
SELECT 
    '📊 Index sur la table inscrits:' as info;

SELECT 
    indexname as "Index",
    indexdef as "Définition"
FROM pg_indexes 
WHERE tablename = 'inscrits';

-- 5. Vérifier les politiques RLS
SELECT 
    '🔒 Politiques RLS:' as info;

SELECT 
    schemaname as "Schéma",
    tablename as "Table",
    policyname as "Politique",
    permissive as "Permissive",
    roles as "Rôles",
    cmd as "Commande",
    qual as "Condition"
FROM pg_policies 
WHERE tablename = 'inscrits';

-- 6. Vérifier si RLS est activé
SELECT 
    CASE 
        WHEN relrowsecurity 
        THEN '✅ RLS activé sur la table inscrits'
        ELSE '❌ RLS non activé sur la table inscrits'
    END as rls_status
FROM pg_class 
WHERE relname = 'inscrits';

-- 7. Vérifier les fonctions créées
SELECT 
    '⚙️ Fonctions personnalisées:' as info;

SELECT 
    routine_name as "Fonction",
    routine_type as "Type",
    data_type as "Type_retour"
FROM information_schema.routines 
WHERE routine_name IN ('generate_numero_dossier', 'set_numero_dossier', 'update_updated_at_column')
ORDER BY routine_name;

-- 8. Vérifier les triggers
SELECT 
    '🔄 Triggers:' as info;

SELECT 
    trigger_name as "Trigger",
    event_manipulation as "Événement",
    action_timing as "Timing",
    action_statement as "Action"
FROM information_schema.triggers 
WHERE event_object_table = 'inscrits';

-- 9. Vérifier le bucket storage
SELECT 
    '📁 Buckets de storage:' as info;

SELECT 
    id as "ID",
    name as "Nom",
    public as "Public",
    created_at as "Créé_le"
FROM storage.buckets 
WHERE id = 'pieces-candidats';

-- 10. Vérifier les données existantes
SELECT 
    '📈 Statistiques des données:' as info;

SELECT 
    COUNT(*) as "Total_inscriptions",
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as "Avec_user_id",
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as "Sans_user_id",
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as "Avec_email",
    COUNT(CASE WHEN numero_dossier IS NOT NULL THEN 1 END) as "Avec_numero_dossier"
FROM inscrits;

-- 11. Vérifier les utilisateurs auth
SELECT 
    '👥 Utilisateurs dans auth.users:' as info;

SELECT 
    COUNT(*) as "Total_users",
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as "Emails_confirmés",
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as "Emails_non_confirmés"
FROM auth.users;

-- 12. Résumé du diagnostic
SELECT 
    '🏁 RÉSUMÉ DU DIAGNOSTIC:' as titre;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'user_id')
        THEN '✅ Colonne user_id présente'
        ELSE '❌ Colonne user_id manquante - EXÉCUTER fix-inscrits-table-user-id.sql'
    END as user_id_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'inscrits' AND constraint_type = 'FOREIGN KEY')
        THEN '✅ Contraintes de clé étrangère présentes'
        ELSE '⚠️ Contraintes de clé étrangère manquantes'
    END as foreign_key_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_class WHERE relname = 'inscrits' AND relrowsecurity = true)
        THEN '✅ RLS activé'
        ELSE '❌ RLS non activé'
    END as rls_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'pieces-candidats')
        THEN '✅ Bucket storage configuré'
        ELSE '❌ Bucket storage manquant'
    END as storage_status; 