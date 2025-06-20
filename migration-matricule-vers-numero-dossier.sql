-- ========================================
-- MIGRATION : RENOMMER MATRICULE → NUMERO_DOSSIER
-- ========================================

-- 1. Renommer la colonne matricule en numero_dossier
ALTER TABLE inscrits RENAME COLUMN matricule TO numero_dossier;

-- 2. Renommer l'index correspondant
DROP INDEX IF EXISTS idx_inscrits_matricule;
CREATE INDEX IF NOT EXISTS idx_inscrits_numero_dossier ON inscrits(numero_dossier);

-- 3. Supprimer l'ancienne fonction et trigger
DROP FUNCTION IF EXISTS generate_matricule() CASCADE;
DROP TRIGGER IF EXISTS trigger_generate_matricule ON inscrits;

-- 4. Créer la nouvelle fonction de génération de numéro de dossier
CREATE OR REPLACE FUNCTION generate_numero_dossier()
RETURNS TRIGGER AS $$
DECLARE
    prefix VARCHAR(3);
    year VARCHAR(2);
    counter INTEGER;
    new_numero_dossier VARCHAR(20);
BEGIN
    -- Déterminer le préfixe selon le cycle
    IF NEW.cycle = 'licence1' THEN
        prefix := 'LIC';
    ELSIF NEW.cycle = 'dut' THEN
        prefix := 'DUT';
    ELSE
        prefix := 'GEN';
    END IF;
    
    -- Année sur 2 chiffres
    year := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Trouver le prochain numéro disponible
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_dossier FROM 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM inscrits 
    WHERE numero_dossier LIKE prefix || year || '%';
    
    -- Générer le numéro de dossier final (ex: LIC24001, DUT24001)
    new_numero_dossier := prefix || year || LPAD(counter::TEXT, 3, '0');
    
    -- Assigner le numéro de dossier
    NEW.numero_dossier := new_numero_dossier;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Créer le nouveau trigger
CREATE TRIGGER trigger_generate_numero_dossier
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    WHEN (NEW.numero_dossier IS NULL OR NEW.numero_dossier = '')
    EXECUTE FUNCTION generate_numero_dossier();

-- 6. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Migration terminée !';
    RAISE NOTICE '✅ Colonne matricule renommée en numero_dossier';
    RAISE NOTICE '✅ Index mis à jour';
    RAISE NOTICE '✅ Fonction et trigger mis à jour';
    RAISE NOTICE '🎉 Votre système utilise maintenant des numéros de dossier !';
END $$; 