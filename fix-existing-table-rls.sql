-- ================================================
-- CORRECTION RLS POUR TABLE EXISTANTE
-- Compatible avec structure SERIAL ID
-- ================================================

-- 1. Créer le bucket storage s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer TOUTES les politiques storage existantes
DROP POLICY IF EXISTS "Candidats can upload their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Candidats can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated deletes" ON storage.objects;

-- 3. POLITIQUES STORAGE ULTRA-PERMISSIVES
-- Upload pour tous les utilisateurs authentifiés
CREATE POLICY "Public upload policy" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pieces-candidats'
);

-- Lecture pour tous
CREATE POLICY "Public read policy" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats'
);

-- Suppression pour tous les utilisateurs authentifiés
CREATE POLICY "Public delete policy" ON storage.objects
FOR DELETE USING (
    bucket_id = 'pieces-candidats'
);

-- 4. VÉRIFIER/CORRIGER LA TABLE INSCRITS
-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS prenom VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nom VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS genre VARCHAR(20);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS date_naissance DATE;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS telephone VARCHAR(20);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS adresse TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS cycle VARCHAR(20);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS filiere VARCHAR(100);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS photo_identite_url TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS attestation_bac_url TEXT;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS mot_de_passe VARCHAR(255);
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'en_cours';

-- 5. Supprimer TOUTES les politiques RLS existantes de la table inscrits
DROP POLICY IF EXISTS "Users can view own record" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON inscrits;
DROP POLICY IF EXISTS "Users can update own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can view own record" ON inscrits;
DROP POLICY IF EXISTS "Candidats can update own record" ON inscrits;
DROP POLICY IF EXISTS "Admins can view all records" ON inscrits;
DROP POLICY IF EXISTS "Admins can update all records" ON inscrits;
DROP POLICY IF EXISTS "Allow insert for new candidates" ON inscrits;
DROP POLICY IF EXISTS "Allow public insert for registration" ON inscrits;
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs propres inscriptions" ON inscrits;
DROP POLICY IF EXISTS "Permettre l'insertion pour tous" ON inscrits;
DROP POLICY IF EXISTS "Administrateurs peuvent tout voir" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated insert" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated select own" ON inscrits;
DROP POLICY IF EXISTS "Allow authenticated update own" ON inscrits;

-- 6. Activer RLS
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- 7. POLITIQUES ULTRA-PERMISSIVES POUR DÉBUTER
-- Permettre l'insertion pour TOUS (même non authentifiés)
CREATE POLICY "Allow public registration" ON inscrits
    FOR INSERT 
    WITH CHECK (true);

-- Permettre la lecture pour TOUS
CREATE POLICY "Allow public read" ON inscrits
    FOR SELECT 
    USING (true);

-- Permettre la mise à jour pour TOUS
CREATE POLICY "Allow public update" ON inscrits
    FOR UPDATE 
    USING (true);

-- 8. FONCTION DE GÉNÉRATION DE NUMÉRO DE DOSSIER (compatible structure existante)
CREATE OR REPLACE FUNCTION generate_numero_dossier_auto()
RETURNS TRIGGER AS $$
DECLARE
    new_numero VARCHAR(20);
BEGIN
    IF NEW.numero_dossier IS NULL OR NEW.numero_dossier = '' THEN
        -- Générer un numéro simple : IUSO + année + numéro séquentiel
        SELECT 'IUSO' || TO_CHAR(NOW(), 'YYYY') || LPAD(COALESCE(MAX(CAST(SUBSTRING(numero_dossier FROM 9) AS INTEGER)), 0) + 1, 4, '0')
        INTO new_numero
        FROM inscrits
        WHERE numero_dossier LIKE 'IUSO' || TO_CHAR(NOW(), 'YYYY') || '%';
        
        NEW.numero_dossier := new_numero;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Supprimer l'ancien trigger et créer le nouveau
DROP TRIGGER IF EXISTS trigger_generate_numero_dossier ON inscrits;
DROP TRIGGER IF EXISTS trigger_generate_numero_dossier_auto ON inscrits;

CREATE TRIGGER trigger_generate_numero_dossier_auto
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_dossier_auto();

-- 10. Vérification finale
SELECT 
    'Configuration terminée!' as status,
    COUNT(*) as storage_policies
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

SELECT 
    'Politiques inscrits:' as status,
    COUNT(*) as table_policies
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'inscrits';

-- Afficher les colonnes de la table pour vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position; 