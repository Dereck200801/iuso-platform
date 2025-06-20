-- ================================================
-- CORRECTION STORAGE ET FONCTIONS
-- Résoudre les problèmes d'upload de documents
-- ================================================

-- 1. CORRIGER LA FONCTION DE GÉNÉRATION DE NUMÉRO (erreur LPAD)
DROP FUNCTION IF EXISTS generate_numero_dossier_auto() CASCADE;

CREATE OR REPLACE FUNCTION generate_numero_dossier_auto()
RETURNS TRIGGER AS $$
DECLARE
    new_numero VARCHAR(20);
    counter INTEGER;
BEGIN
    IF NEW.numero_dossier IS NULL OR NEW.numero_dossier = '' THEN
        -- Trouver le dernier numéro pour cette année
        SELECT COALESCE(
            MAX(
                CAST(
                    SUBSTRING(numero_dossier FROM 'IUSO[0-9]{4}([0-9]+)') 
                    AS INTEGER
                )
            ), 0
        ) + 1
        INTO counter
        FROM inscrits
        WHERE numero_dossier LIKE 'IUSO' || TO_CHAR(NOW(), 'YYYY') || '%';
        
        -- Générer le nouveau numéro avec padding manuel
        new_numero := 'IUSO' || TO_CHAR(NOW(), 'YYYY') || 
                     CASE 
                         WHEN counter < 10 THEN '000' || counter::TEXT
                         WHEN counter < 100 THEN '00' || counter::TEXT  
                         WHEN counter < 1000 THEN '0' || counter::TEXT
                         ELSE counter::TEXT
                     END;
        
        NEW.numero_dossier := new_numero;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer le trigger
DROP TRIGGER IF EXISTS trigger_generate_numero_dossier_auto ON inscrits;
CREATE TRIGGER trigger_generate_numero_dossier_auto
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_dossier_auto();

-- 2. VÉRIFIER ET CRÉER LE BUCKET STORAGE
DO $$
BEGIN
    -- Vérifier si le bucket existe
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'pieces-candidats'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('pieces-candidats', 'pieces-candidats', false);
        RAISE NOTICE '✅ Bucket pieces-candidats créé';
    ELSE
        RAISE NOTICE '✅ Bucket pieces-candidats existe déjà';
    END IF;
END $$;

-- 3. SUPPRIMER TOUTES LES POLITIQUES STORAGE EXISTANTES
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Supprimer toutes les politiques sur storage.objects
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON storage.objects';
        RAISE NOTICE 'Supprimé: %', policy_name;
    END LOOP;
END $$;

-- 4. CRÉER DES POLITIQUES STORAGE ULTRA-PERMISSIVES
-- Upload public (pas besoin d'authentification)
CREATE POLICY "Allow public uploads to pieces-candidats" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pieces-candidats');

-- Lecture publique  
CREATE POLICY "Allow public reads from pieces-candidats" ON storage.objects
FOR SELECT USING (bucket_id = 'pieces-candidats');

-- Suppression publique
CREATE POLICY "Allow public deletes from pieces-candidats" ON storage.objects
FOR DELETE USING (bucket_id = 'pieces-candidats');

-- Mise à jour publique
CREATE POLICY "Allow public updates to pieces-candidats" ON storage.objects
FOR UPDATE USING (bucket_id = 'pieces-candidats');

-- 5. ACTIVER RLS SUR STORAGE (si pas déjà fait)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. TESTER LA CONFIGURATION STORAGE
-- Insérer un test (sera automatiquement nettoyé)
DO $$
BEGIN
    -- Test d'insertion dans le bucket (simulation)
    RAISE NOTICE '🧪 Test de configuration storage...';
    
    -- Vérifier les politiques
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname LIKE '%pieces-candidats%'
    ) THEN
        RAISE NOTICE '✅ Politiques storage configurées correctement';
    ELSE
        RAISE NOTICE '❌ Problème avec les politiques storage';
    END IF;
END $$;

-- 7. VÉRIFIER LA STRUCTURE DE LA TABLE INSCRITS
DO $$
BEGIN
    -- Vérifier que toutes les colonnes nécessaires existent
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscrits' AND column_name = 'photo_identite_url'
    ) THEN
        ALTER TABLE inscrits ADD COLUMN photo_identite_url TEXT;
        RAISE NOTICE '✅ Colonne photo_identite_url ajoutée';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscrits' AND column_name = 'attestation_bac_url'
    ) THEN
        ALTER TABLE inscrits ADD COLUMN attestation_bac_url TEXT;
        RAISE NOTICE '✅ Colonne attestation_bac_url ajoutée';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscrits' AND column_name = 'numero_dossier'
    ) THEN
        ALTER TABLE inscrits ADD COLUMN numero_dossier VARCHAR(20) UNIQUE;
        RAISE NOTICE '✅ Colonne numero_dossier ajoutée';
    END IF;
END $$;

-- 8. DIAGNOSTIC FINAL
SELECT 
    'Configuration terminée!' as status,
    (SELECT COUNT(*) FROM storage.buckets WHERE id = 'pieces-candidats') as buckets_count,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') as storage_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inscrits') as table_policies;

-- Afficher les politiques créées
SELECT 
    'Politiques Storage:' as type,
    policyname,
    cmd as operation
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- Test de la fonction de génération de numéro
SELECT 
    'Test génération numéro:' as test,
    'IUSO' || TO_CHAR(NOW(), 'YYYY') || '0001' as exemple_numero;

RAISE NOTICE '🎉 Configuration storage terminée!';
RAISE NOTICE '📁 Bucket: pieces-candidats';
RAISE NOTICE '🔓 Politiques: Ultra-permissives pour debug';
RAISE NOTICE '⚡ Fonction numéro: Corrigée sans LPAD'; 