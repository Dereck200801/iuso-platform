-- ============================================
-- MISE À JOUR TABLE INSCRITS - CONCOURS L1 & BTS
-- ============================================

-- Ajouter les colonnes manquantes pour le concours
ALTER TABLE inscrits 
ADD COLUMN IF NOT EXISTS genre VARCHAR(20),
ADD COLUMN IF NOT EXISTS date_naissance DATE,
ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);

-- Mettre à jour les commentaires des colonnes existantes
COMMENT ON COLUMN inscrits.id IS 'ID utilisateur (référence auth.users)';
COMMENT ON COLUMN inscrits.matricule IS 'Numéro de matricule généré automatiquement';
COMMENT ON COLUMN inscrits.email IS 'Email du candidat (unique)';
COMMENT ON COLUMN inscrits.firstname IS 'Prénom du candidat';
COMMENT ON COLUMN inscrits.lastname IS 'Nom du candidat';
COMMENT ON COLUMN inscrits.genre IS 'Genre: masculin, feminin, autre';
COMMENT ON COLUMN inscrits.date_naissance IS 'Date de naissance';
COMMENT ON COLUMN inscrits.lieu_naissance IS 'Lieu de naissance';
COMMENT ON COLUMN inscrits.nationalite IS 'Nationalité';
COMMENT ON COLUMN inscrits.phone IS 'Numéro de téléphone';
COMMENT ON COLUMN inscrits.address IS 'Adresse complète';
COMMENT ON COLUMN inscrits.studycycle IS 'Cycle d\'étude: licence1, dut (pour BTS)';
COMMENT ON COLUMN inscrits.filiere IS 'Filière choisie';
COMMENT ON COLUMN inscrits.photo IS 'Chemin vers la photo d\'identité';
COMMENT ON COLUMN inscrits.birthCertificate IS 'Chemin vers l\'acte de naissance (optionnel)';
COMMENT ON COLUMN inscrits.bacAttestation IS 'Chemin vers l\'attestation du bac';
COMMENT ON COLUMN inscrits.status IS 'Statut: en_cours, valide, refuse';

-- Créer des index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre);
CREATE INDEX IF NOT EXISTS idx_inscrits_date_naissance ON inscrits(date_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite);

-- Mettre à jour la vue des statistiques pour inclure les nouveaux champs
CREATE OR REPLACE VIEW stats_candidatures AS
SELECT 
    COUNT(*) as total_candidats,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN studycycle = 'licence1' THEN 1 END) as licence1,
    COUNT(CASE WHEN studycycle = 'dut' THEN 1 END) as bts_dut,
    COUNT(CASE WHEN genre = 'masculin' THEN 1 END) as masculin,
    COUNT(CASE WHEN genre = 'feminin' THEN 1 END) as feminin,
    COUNT(CASE WHEN genre = 'autre' THEN 1 END) as autre,
    COUNT(CASE WHEN nationalite = 'Gabon' THEN 1 END) as gabonais,
    COUNT(CASE WHEN nationalite != 'Gabon' THEN 1 END) as etrangers
FROM inscrits;

-- Créer une vue pour les candidats par ville de naissance
CREATE OR REPLACE VIEW stats_par_ville AS
SELECT 
    lieu_naissance,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours
FROM inscrits
WHERE lieu_naissance IS NOT NULL
GROUP BY lieu_naissance
ORDER BY total DESC;

-- Fonction pour générer des statistiques détaillées
CREATE OR REPLACE FUNCTION get_stats_detaillees()
RETURNS TABLE (
    total_candidats BIGINT,
    en_cours BIGINT,
    valides BIGINT,
    refuses BIGINT,
    licence1 BIGINT,
    bts_dut BIGINT,
    masculin BIGINT,
    feminin BIGINT,
    autre BIGINT,
    age_moyen NUMERIC,
    candidats_gabonais BIGINT,
    candidats_etrangers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_candidats,
        COUNT(CASE WHEN i.status = 'en_cours' THEN 1 END)::BIGINT as en_cours,
        COUNT(CASE WHEN i.status = 'valide' THEN 1 END)::BIGINT as valides,
        COUNT(CASE WHEN i.status = 'refuse' THEN 1 END)::BIGINT as refuses,
        COUNT(CASE WHEN i.studycycle = 'licence1' THEN 1 END)::BIGINT as licence1,
        COUNT(CASE WHEN i.studycycle = 'dut' THEN 1 END)::BIGINT as bts_dut,
        COUNT(CASE WHEN i.genre = 'masculin' THEN 1 END)::BIGINT as masculin,
        COUNT(CASE WHEN i.genre = 'feminin' THEN 1 END)::BIGINT as feminin,
        COUNT(CASE WHEN i.genre = 'autre' THEN 1 END)::BIGINT as autre,
        ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, i.date_naissance))), 2) as age_moyen,
        COUNT(CASE WHEN i.nationalite = 'Gabon' THEN 1 END)::BIGINT as candidats_gabonais,
        COUNT(CASE WHEN i.nationalite != 'Gabon' OR i.nationalite IS NULL THEN 1 END)::BIGINT as candidats_etrangers
    FROM inscrits i;
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Table inscrits mise à jour avec succès pour le concours L1 & BTS!';
    RAISE NOTICE 'Nouvelles colonnes ajoutées: genre, date_naissance, lieu_naissance, nationalite';
END $$; 