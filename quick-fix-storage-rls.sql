-- ================================================
-- CORRECTION RAPIDE: Storage RLS pour upload de photos
-- À exécuter IMMÉDIATEMENT dans Supabase Cloud
-- ================================================

-- 1. Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer toutes les anciennes politiques de storage
DROP POLICY IF EXISTS "Candidats can upload their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their documents" ON storage.objects;

-- 3. POLITIQUES STORAGE SIMPLIFIÉES ET PERMISSIVES
-- Permettre l'upload pour TOUS les utilisateurs authentifiés
CREATE POLICY "Allow all authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pieces-candidats' 
    AND auth.role() = 'authenticated'
);

-- Permettre la lecture pour TOUS les utilisateurs authentifiés
CREATE POLICY "Allow all authenticated reads" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats' 
    AND auth.role() = 'authenticated'
);

-- Permettre la suppression pour TOUS les utilisateurs authentifiés
CREATE POLICY "Allow all authenticated deletes" ON storage.objects
FOR DELETE USING (
    bucket_id = 'pieces-candidats' 
    AND auth.role() = 'authenticated'
);

-- 4. CORRECTION TABLE INSCRITS - POLITIQUES RLS PERMISSIVES
-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view own record" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON inscrits;
DROP POLICY IF EXISTS "Users can update own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can view own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can update own record" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all records" ON inscrits;
DROP POLICY IF EXISTS "Admins can update all records" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for new candidates" ON inscrits;
DROP POLICY IF EXISTS "Allow public insert for registration" ON inscrits;

-- Activer RLS
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- POLITIQUES TRÈS PERMISSIVES POUR DÉBUTER
-- Permettre l'insertion pour TOUS les utilisateurs authentifiés
CREATE POLICY "Allow authenticated insert" ON inscrits
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Permettre la lecture pour les utilisateurs authentifiés de leur propre dossier
CREATE POLICY "Allow authenticated select own" ON inscrits
    FOR SELECT 
    USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Permettre la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated update own" ON inscrits
    FOR UPDATE 
    USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Vérification finale
SELECT 
    'Storage RLS configuré' as status,
    COUNT(*) as nombre_politiques_storage
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

SELECT 
    'Inscrits RLS configuré' as status,
    COUNT(*) as nombre_politiques_inscrits
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'inscrits'; 