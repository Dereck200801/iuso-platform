-- =====================================================================
-- CORRECTION FINALE DU SYSTÈME D'INSCRIPTION IUSO
-- Script pour corriger la table inscrits et permettre l'enregistrement immédiat
-- =====================================================================

-- 1. S'assurer que la table inscrits existe avec toutes les colonnes nécessaires
CREATE TABLE IF NOT EXISTS inscrits (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    genre VARCHAR(20) NOT NULL CHECK (genre IN ('masculin', 'feminin', 'autre')),
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(100) NOT NULL,
    nationalite VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse TEXT NOT NULL,
    cycle VARCHAR(50) NOT NULL CHECK (cycle IN ('licence1', 'dut')),
    filiere VARCHAR(200) NOT NULL,
    photo_identite_url TEXT,
    attestation_bac_url TEXT,
    numero_dossier VARCHAR(50) UNIQUE NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente_validation' CHECK (statut IN ('en_attente_validation', 'en_attente_confirmation_email', 'valide', 'refuse', 'en_cours')),
    inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN 
    -- Vérifier et ajouter chaque colonne
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'user_id') THEN
        ALTER TABLE inscrits ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'email') THEN
        ALTER TABLE inscrits ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'prenom') THEN
        ALTER TABLE inscrits ADD COLUMN prenom VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'nom') THEN
        ALTER TABLE inscrits ADD COLUMN nom VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'genre') THEN
        ALTER TABLE inscrits ADD COLUMN genre VARCHAR(20) NOT NULL DEFAULT 'autre';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'date_naissance') THEN
        ALTER TABLE inscrits ADD COLUMN date_naissance DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'lieu_naissance') THEN
        ALTER TABLE inscrits ADD COLUMN lieu_naissance VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'nationalite') THEN
        ALTER TABLE inscrits ADD COLUMN nationalite VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'telephone') THEN
        ALTER TABLE inscrits ADD COLUMN telephone VARCHAR(20) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'adresse') THEN
        ALTER TABLE inscrits ADD COLUMN adresse TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'cycle') THEN
        ALTER TABLE inscrits ADD COLUMN cycle VARCHAR(50) NOT NULL DEFAULT 'licence1';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'filiere') THEN
        ALTER TABLE inscrits ADD COLUMN filiere VARCHAR(200) NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'photo_identite_url') THEN
        ALTER TABLE inscrits ADD COLUMN photo_identite_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'attestation_bac_url') THEN
        ALTER TABLE inscrits ADD COLUMN attestation_bac_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'numero_dossier') THEN
        ALTER TABLE inscrits ADD COLUMN numero_dossier VARCHAR(50) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'statut') THEN
        ALTER TABLE inscrits ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente_validation';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'inscription_date') THEN
        ALTER TABLE inscrits ADD COLUMN inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'created_at') THEN
        ALTER TABLE inscrits ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'updated_at') THEN
        ALTER TABLE inscrits ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 3. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_user_id ON inscrits(user_id);
CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);
CREATE INDEX IF NOT EXISTS idx_inscrits_numero_dossier ON inscrits(numero_dossier);
CREATE INDEX IF NOT EXISTS idx_inscrits_statut ON inscrits(statut);
CREATE INDEX IF NOT EXISTS idx_inscrits_cycle ON inscrits(cycle);
CREATE INDEX IF NOT EXISTS idx_inscrits_inscription_date ON inscrits(inscription_date);

-- 4. Activer RLS sur la table
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les anciennes politiques qui pourraient causer des conflits
DROP POLICY IF EXISTS "Users can view own inscription" ON inscrits;
DROP POLICY IF EXISTS "Users can insert own inscription" ON inscrits;
DROP POLICY IF EXISTS "Users can update own inscription" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all inscriptions" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated insert" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated select own" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated update own" ON inscrits;

-- 6. Créer les nouvelles politiques RLS plus permissives
CREATE POLICY "Allow authenticated users to insert their inscription" ON inscrits
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own inscription" ON inscrits
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own inscription" ON inscrits
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins to manage all inscriptions" ON inscrits
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'admin' OR
                auth.users.raw_user_meta_data->>'role' = 'super_admin'
            )
        )
    );

-- 7. Créer le bucket storage si il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- 8. Créer les politiques de storage pour les documents
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their documents" ON storage.objects;

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'pieces-candidats');

CREATE POLICY "Authenticated users can view their documents" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'pieces-candidats');

CREATE POLICY "Authenticated users can delete their documents" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'pieces-candidats');

-- 9. Créer la fonction de trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Créer le trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_inscrits_updated_at ON inscrits;
CREATE TRIGGER update_inscrits_updated_at
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Fonction pour générer un numéro de dossier unique
CREATE OR REPLACE FUNCTION generate_numero_dossier()
RETURNS VARCHAR AS $$
DECLARE
    new_numero VARCHAR(50);
    counter INTEGER;
BEGIN
    -- Générer un numéro basé sur l'année et un compteur
    SELECT COALESCE(MAX(
        CASE 
            WHEN numero_dossier ~ '^IUSO[0-9]+$' 
            THEN CAST(SUBSTRING(numero_dossier FROM 5) AS INTEGER)
            ELSE 0 
        END
    ), 0) + 1
    INTO counter
    FROM inscrits;
    
    new_numero := 'IUSO' || LPAD(counter::TEXT, 6, '0');
    
    RETURN new_numero;
END;
$$ LANGUAGE plpgsql;

-- 12. Afficher un résumé de la configuration
DO $$
DECLARE
    table_count INTEGER;
    column_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Compter les enregistrements
    SELECT COUNT(*) INTO table_count FROM inscrits;
    
    -- Compter les colonnes
    SELECT COUNT(*) INTO column_count 
    FROM information_schema.columns 
    WHERE table_name = 'inscrits';
    
    -- Compter les politiques RLS
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'inscrits';
    
    RAISE NOTICE '=== CORRECTION TERMINÉE ===';
    RAISE NOTICE 'Table inscrits configurée avec succès !';
    RAISE NOTICE 'Nombre d''inscriptions actuelles: %', table_count;
    RAISE NOTICE 'Nombre de colonnes: %', column_count;
    RAISE NOTICE 'Nombre de politiques RLS: %', policy_count;
    RAISE NOTICE 'Le système d''inscription est maintenant opérationnel.';
    RAISE NOTICE '================================';
END $$; 