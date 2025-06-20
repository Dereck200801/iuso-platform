-- ================================================
-- Script de correction RLS pour IUSO Platform
-- À exécuter dans l'éditeur SQL de Supabase Cloud
-- ================================================

-- 1. Vérifier et créer la table inscrits si elle n'existe pas
CREATE TABLE IF NOT EXISTS inscrits (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_dossier VARCHAR UNIQUE DEFAULT ('IUSO' || EXTRACT(YEAR FROM NOW()) || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || LPAD((EXTRACT(HOUR FROM NOW()) * 60 + EXTRACT(MINUTE FROM NOW()))::TEXT, 4, '0')),
  email VARCHAR UNIQUE NOT NULL,
  prenom VARCHAR NOT NULL,
  nom VARCHAR NOT NULL,
  genre VARCHAR CHECK (genre IN ('masculin', 'feminin', 'autre')),
  date_naissance DATE,
  lieu_naissance VARCHAR,
  nationalite VARCHAR,
  telephone VARCHAR,
  adresse TEXT,
  cycle VARCHAR NOT NULL CHECK (cycle IN ('licence1', 'licence2', 'licence3', 'master1', 'master2', 'dut')),
  filiere VARCHAR NOT NULL,
  photo_identite_url TEXT,
  attestation_bac_url TEXT,
  mot_de_passe VARCHAR NOT NULL,
  statut VARCHAR DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'valide', 'refuse')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Supprimer toutes les politiques RLS existantes
DROP POLICY IF EXISTS "Users can view own record" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON inscrits;
DROP POLICY IF EXISTS "Users can update own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can view own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can update own record" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all records" ON inscrits;
DROP POLICY IF EXISTS "Admins can update all records" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for new candidates" ON inscrits;
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs propres inscriptions" ON inscrits;
DROP POLICY IF EXISTS "Permettre l'insertion pour tous" ON inscrits;
DROP POLICY IF EXISTS "Administrateurs peuvent tout voir" ON inscrits;

-- 3. Activer RLS sur la table
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- 4. Créer les nouvelles politiques RLS simplifiées
-- Permettre l'insertion pour TOUS (authentifiés ou non) - CRUCIAL pour l'inscription
CREATE POLICY "Allow public insert for registration" ON inscrits
    FOR INSERT 
    WITH CHECK (true);

-- Permettre la lecture pour les utilisateurs authentifiés de leur propre dossier
CREATE POLICY "Users can view own record" ON inscrits
    FOR SELECT 
    USING (auth.uid() = id);

-- Permettre la mise à jour pour les utilisateurs authentifiés de leur propre dossier
CREATE POLICY "Users can update own record" ON inscrits
    FOR UPDATE 
    USING (auth.uid() = id);

-- Politique pour les administrateurs (peuvent tout voir/modifier)
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

-- 5. Configuration du Storage pour les pièces justificatives
-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques de storage
DROP POLICY IF EXISTS "Candidats can upload their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Politique pour permettre l'upload pour TOUS les utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pieces-candidats' 
    AND auth.role() = 'authenticated'
);

-- Politique pour permettre la lecture des documents par leur propriétaire
CREATE POLICY "Users can view their documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats' 
    AND (
        auth.uid()::text = (storage.foldername(name))[1]
        OR EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'admin'
                OR auth.users.email LIKE '%@iuso-sne.%'
            )
        )
    )
);

-- Politique pour permettre la suppression des documents par leur propriétaire
CREATE POLICY "Users can delete their documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'pieces-candidats' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Créer la fonction pour générer le numéro de dossier
CREATE OR REPLACE FUNCTION generate_numero_dossier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_dossier IS NULL OR NEW.numero_dossier = '' THEN
        NEW.numero_dossier := 'IUSO' || TO_CHAR(NOW(), 'YYYY') || TO_CHAR(NOW(), 'DDD') || TO_CHAR((EXTRACT(HOUR FROM NOW()) * 60 + EXTRACT(MINUTE FROM NOW()))::INT, 'FM0000');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer le trigger pour le numéro de dossier
DROP TRIGGER IF EXISTS trigger_generate_numero_dossier ON inscrits;
CREATE TRIGGER trigger_generate_numero_dossier
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_dossier();

-- 8. Créer la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Créer le trigger pour la mise à jour automatique
DROP TRIGGER IF EXISTS trigger_update_updated_at ON inscrits;
CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 10. Configuration de l'authentification
-- Mettre à jour les paramètres d'auth pour permettre les inscriptions
UPDATE auth.config 
SET 
    site_url = 'http://localhost:5173',
    uri_allow_list = 'http://localhost:5173,http://localhost:5174,https://imerksaoefmzrsfpoamr.supabase.co'
WHERE TRUE;

-- 11. Vérification finale
SELECT 
    'Configuration RLS terminée' as status,
    COUNT(*) as nombre_politiques
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'inscrits';

-- Afficher les politiques créées
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'inscrits'
ORDER BY policyname; 