-- Script pour corriger la table inscrits - Ajouter la colonne user_id manquante
-- IUSO-SNE - Correction de la structure de la table

-- 1. Vérifier la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- 2. Ajouter la colonne user_id si elle n'existe pas
DO $$ 
BEGIN 
    -- Vérifier si la colonne user_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscrits' AND column_name = 'user_id'
    ) THEN
        -- Ajouter la colonne user_id
        ALTER TABLE inscrits ADD COLUMN user_id UUID;
        
        -- Ajouter la contrainte de clé étrangère
        ALTER TABLE inscrits ADD CONSTRAINT fk_inscrits_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Créer l'index pour optimiser les performances
        CREATE INDEX IF NOT EXISTS idx_inscrits_user_id ON inscrits(user_id);
        
        RAISE NOTICE 'Colonne user_id ajoutée avec succès à la table inscrits';
    ELSE
        RAISE NOTICE 'La colonne user_id existe déjà dans la table inscrits';
    END IF;
END $$;

-- 3. Vérifier que la colonne email existe aussi
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscrits' AND column_name = 'email'
    ) THEN
        ALTER TABLE inscrits ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';
        RAISE NOTICE 'Colonne email ajoutée';
    END IF;
END $$;

-- 4. Vérifier et ajouter les autres colonnes essentielles si elles manquent
DO $$ 
BEGIN 
    -- Prenom
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'prenom') THEN
        ALTER TABLE inscrits ADD COLUMN prenom VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    -- Nom
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'nom') THEN
        ALTER TABLE inscrits ADD COLUMN nom VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    -- Genre
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'genre') THEN
        ALTER TABLE inscrits ADD COLUMN genre VARCHAR(20) NOT NULL DEFAULT '';
    END IF;
    
    -- Date de naissance
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'date_naissance') THEN
        ALTER TABLE inscrits ADD COLUMN date_naissance DATE;
    END IF;
    
    -- Lieu de naissance
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'lieu_naissance') THEN
        ALTER TABLE inscrits ADD COLUMN lieu_naissance VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    -- Nationalité
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'nationalite') THEN
        ALTER TABLE inscrits ADD COLUMN nationalite VARCHAR(100) NOT NULL DEFAULT '';
    END IF;
    
    -- Téléphone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'telephone') THEN
        ALTER TABLE inscrits ADD COLUMN telephone VARCHAR(20) NOT NULL DEFAULT '';
    END IF;
    
    -- Adresse
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'adresse') THEN
        ALTER TABLE inscrits ADD COLUMN adresse TEXT NOT NULL DEFAULT '';
    END IF;
    
    -- Cycle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'cycle') THEN
        ALTER TABLE inscrits ADD COLUMN cycle VARCHAR(50) NOT NULL DEFAULT '';
    END IF;
    
    -- Filière
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'filiere') THEN
        ALTER TABLE inscrits ADD COLUMN filiere VARCHAR(200) NOT NULL DEFAULT '';
    END IF;
    
    -- Photo d'identité URL
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'photo_identite_url') THEN
        ALTER TABLE inscrits ADD COLUMN photo_identite_url TEXT;
    END IF;
    
    -- Attestation BAC URL
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'attestation_bac_url') THEN
        ALTER TABLE inscrits ADD COLUMN attestation_bac_url TEXT;
    END IF;
    
    -- Numéro de dossier
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'numero_dossier') THEN
        ALTER TABLE inscrits ADD COLUMN numero_dossier VARCHAR(50) UNIQUE;
    END IF;
    
    -- Statut
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'statut') THEN
        ALTER TABLE inscrits ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente_validation';
    END IF;
    
    -- Date d'inscription
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'inscription_date') THEN
        ALTER TABLE inscrits ADD COLUMN inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Created at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'created_at') THEN
        ALTER TABLE inscrits ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Updated at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inscrits' AND column_name = 'updated_at') THEN
        ALTER TABLE inscrits ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    RAISE NOTICE 'Toutes les colonnes essentielles ont été vérifiées/ajoutées';
END $$;

-- 5. Supprimer les contraintes NOT NULL temporairement pour les données existantes
ALTER TABLE inscrits ALTER COLUMN email DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN prenom DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN nom DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN genre DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN lieu_naissance DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN nationalite DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN telephone DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN adresse DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN cycle DROP NOT NULL;
ALTER TABLE inscrits ALTER COLUMN filiere DROP NOT NULL;

-- 6. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);
CREATE INDEX IF NOT EXISTS idx_inscrits_numero_dossier ON inscrits(numero_dossier);
CREATE INDEX IF NOT EXISTS idx_inscrits_statut ON inscrits(statut);

-- 7. Recréer les politiques RLS si elles n'existent pas
DO $$ 
BEGIN 
    -- Activer RLS si pas déjà fait
    ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;
    
    -- Supprimer les anciennes politiques si elles existent
    DROP POLICY IF EXISTS "Users can view own inscription" ON inscrits;
    DROP POLICY IF EXISTS "Users can insert own inscription" ON inscrits;
    DROP POLICY IF EXISTS "Admins can view all inscriptions" ON inscrits;
    
    -- Recréer les politiques
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
    
    RAISE NOTICE 'Politiques RLS recréées avec succès';
END $$;

-- 8. Recréer les fonctions et triggers
CREATE OR REPLACE FUNCTION generate_numero_dossier()
RETURNS TEXT AS $$
DECLARE
    nouveau_numero TEXT;
    existe BOOLEAN;
BEGIN
    LOOP
        -- Générer un numéro au format IUSO + 6 chiffres
        nouveau_numero := 'IUSO' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Vérifier si le numéro existe déjà
        SELECT EXISTS(SELECT 1 FROM inscrits WHERE numero_dossier = nouveau_numero) INTO existe;
        
        -- Si le numéro n'existe pas, le retourner
        IF NOT existe THEN
            RETURN nouveau_numero;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour auto-générer le numéro de dossier
CREATE OR REPLACE FUNCTION set_numero_dossier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_dossier IS NULL OR NEW.numero_dossier = '' THEN
        NEW.numero_dossier := generate_numero_dossier();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS trigger_set_numero_dossier ON inscrits;

-- Créer le nouveau trigger
CREATE TRIGGER trigger_set_numero_dossier
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION set_numero_dossier();

-- Fonction pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS trigger_update_updated_at ON inscrits;

-- Créer le nouveau trigger
CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Vérifier la structure finale
SELECT 'Structure finale de la table inscrits:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- 10. Message de confirmation
SELECT 'Table inscrits corrigée avec succès! La colonne user_id a été ajoutée.' as resultat; 