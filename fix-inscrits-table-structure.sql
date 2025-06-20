-- =====================================================================
-- CORRECTION DE LA STRUCTURE DE LA TABLE INSCRITS
-- Ajout des colonnes manquantes pour le système de confirmation
-- =====================================================================

-- 1. Ajouter les colonnes manquantes à la table inscrits existante
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS transferred_from_temp BOOLEAN DEFAULT FALSE;
ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- 2. Modifier les contraintes de statut pour inclure les nouveaux statuts
ALTER TABLE inscrits DROP CONSTRAINT IF EXISTS inscrits_statut_check;
ALTER TABLE inscrits ADD CONSTRAINT inscrits_statut_check 
CHECK (statut IN ('en_attente', 'accepte', 'refuse', 'en_cours', 'en_attente_confirmation'));

-- 3. Modifier les contraintes de genre si nécessaire
ALTER TABLE inscrits DROP CONSTRAINT IF EXISTS inscrits_genre_check;
ALTER TABLE inscrits ADD CONSTRAINT inscrits_genre_check 
CHECK (genre IN ('masculin', 'feminin', 'autre', 'Masculin', 'Féminin', 'Autre'));

-- 4. Modifier les contraintes de cycle si nécessaire
ALTER TABLE inscrits DROP CONSTRAINT IF EXISTS inscrits_cycle_check;
ALTER TABLE inscrits ADD CONSTRAINT inscrits_cycle_check 
CHECK (cycle IN ('licence1', 'dut', 'licence', 'bts'));

-- 5. Ajouter des index pour les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_auth_user_id ON inscrits(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_inscrits_transferred_from_temp ON inscrits(transferred_from_temp);
CREATE INDEX IF NOT EXISTS idx_inscrits_email_verified_at ON inscrits(email_verified_at);

-- 6. Vérifier la structure finale de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Structure de la table inscrits corrigée avec succès !';
    RAISE NOTICE '📋 Colonnes ajoutées: auth_user_id, transferred_from_temp, email_verified_at';
    RAISE NOTICE '🔧 Contraintes mises à jour pour les nouveaux statuts';
END $$; 