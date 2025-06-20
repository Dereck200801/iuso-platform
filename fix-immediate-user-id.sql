-- SOLUTION IMMÉDIATE pour l'erreur "column user_id does not exist"
-- Exécutez ce script en premier pour corriger le problème

-- Étape 1: Ajouter la colonne user_id à la table inscrits
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS user_id UUID;

-- Étape 2: Ajouter la contrainte de clé étrangère
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'inscrits' 
        AND constraint_name = 'fk_inscrits_user_id'
    ) THEN
        ALTER TABLE inscrits ADD CONSTRAINT fk_inscrits_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Étape 3: Créer l'index
CREATE INDEX IF NOT EXISTS idx_inscrits_user_id ON inscrits(user_id);

-- Étape 4: Ajouter les autres colonnes essentielles si elles manquent
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS prenom VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nom VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS genre VARCHAR(20);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS date_naissance DATE;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS telephone VARCHAR(20);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS adresse TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS cycle VARCHAR(50);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS filiere VARCHAR(200);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS photo_identite_url TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS attestation_bac_url TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS numero_dossier VARCHAR(50);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'en_attente_validation';
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Étape 5: Ajouter la contrainte UNIQUE sur numero_dossier si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'inscrits' 
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%numero_dossier%'
    ) THEN
        ALTER TABLE inscrits ADD CONSTRAINT unique_numero_dossier UNIQUE (numero_dossier);
    END IF;
END $$;

-- Étape 6: Activer RLS
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- Étape 7: Créer les politiques RLS de base
DROP POLICY IF EXISTS "Users can view own inscription" ON inscrits;
DROP POLICY IF EXISTS "Users can insert own inscription" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all inscriptions" ON inscrits;

CREATE POLICY "Users can view own inscription" ON inscrits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inscription" ON inscrits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all inscriptions" ON inscrits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Étape 8: Créer le bucket storage si il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- Étape 9: Créer les politiques de storage
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'pieces-candidats' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'pieces-candidats' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Admins can view all documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'pieces-candidats' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Vérification finale
SELECT 'Configuration terminée avec succès!' as message;
SELECT 'La colonne user_id a été ajoutée à la table inscrits' as resultat; 