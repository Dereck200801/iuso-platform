-- Script de diagnostic simplifié - Sans erreur de colonne manquante
-- Exécutez ce script APRÈS avoir exécuté fix-immediate-user-id.sql

-- 1. Vérifier si la table inscrits existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inscrits')
        THEN '✅ Table inscrits existe'
        ELSE '❌ Table inscrits n''existe pas'
    END as table_status;

-- 2. Vérifier la structure de la table inscrits
SELECT 
    column_name as "Colonne",
    data_type as "Type",
    is_nullable as "Nullable"
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- 3. Vérifier spécifiquement la colonne user_id
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'user_id')
        THEN '✅ Colonne user_id présente'
        ELSE '❌ Colonne user_id manquante'
    END as user_id_status;

-- 4. Vérifier les contraintes de clé étrangère
SELECT 
    tc.constraint_name as "Contrainte",
    kcu.column_name as "Colonne"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'inscrits';

-- 5. Vérifier si RLS est activé
SELECT 
    CASE 
        WHEN relrowsecurity 
        THEN '✅ RLS activé sur la table inscrits'
        ELSE '❌ RLS non activé sur la table inscrits'
    END as rls_status
FROM pg_class 
WHERE relname = 'inscrits';

-- 6. Vérifier le bucket storage
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'pieces-candidats')
        THEN '✅ Bucket pieces-candidats existe'
        ELSE '❌ Bucket pieces-candidats manquant'
    END as bucket_status;

-- 7. Compter les utilisateurs auth
SELECT 
    COUNT(*) as "Total_users_auth"
FROM auth.users;

-- 8. Compter les inscriptions (seulement si la table a des données)
SELECT 
    COUNT(*) as "Total_inscriptions"
FROM inscrits;

-- 9. Résumé final
SELECT 
    '🎉 DIAGNOSTIC TERMINÉ' as message,
    'Si toutes les vérifications sont ✅, le système est prêt!' as instruction; 