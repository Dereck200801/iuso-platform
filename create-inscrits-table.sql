-- ========================================
-- CRÉATION DE LA TABLE INSCRITS COMPLÈTE
-- Pour le système d'inscription IUSO-SNE
-- ========================================

-- Supprimer la table si elle existe (optionnel)
-- DROP TABLE IF EXISTS inscrits CASCADE;

-- Créer la table inscrits avec toutes les colonnes nécessaires
CREATE TABLE IF NOT EXISTS inscrits (
  -- Clé primaire
  id SERIAL PRIMARY KEY,
  
  -- Identifiant unique (numéro de dossier auto-généré)
  numero_dossier VARCHAR(20) UNIQUE NOT NULL,
  
  -- Informations personnelles (Étape 1)
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  genre VARCHAR(20) NOT NULL CHECK (genre IN ('Masculin', 'Féminin', 'Autre')),
  date_naissance DATE NOT NULL,
  lieu_naissance VARCHAR(100) NOT NULL,
  nationalite VARCHAR(100) NOT NULL,
  
  -- Coordonnées (Étape 2)
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  adresse TEXT NOT NULL,
  
  -- Accès au compte (Étape 3)
  mot_de_passe VARCHAR(255) NOT NULL,
  
  -- Formation (Étape 4)
  cycle VARCHAR(20) NOT NULL CHECK (cycle IN ('licence1', 'dut')),
  filiere VARCHAR(100) NOT NULL,
  
  -- Documents (Étape 5)
  photo_identite_url VARCHAR(500),
  attestation_bac_url VARCHAR(500),
  
  -- Statut et métadonnées
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse', 'en_cours')),
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CRÉATION DES INDEX POUR OPTIMISATION
-- ========================================

-- Index sur les colonnes les plus utilisées pour les recherches
CREATE INDEX IF NOT EXISTS idx_inscrits_numero_dossier ON inscrits(numero_dossier);
CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);
CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre);
CREATE INDEX IF NOT EXISTS idx_inscrits_cycle ON inscrits(cycle);
CREATE INDEX IF NOT EXISTS idx_inscrits_filiere ON inscrits(filiere);
CREATE INDEX IF NOT EXISTS idx_inscrits_statut ON inscrits(statut);
CREATE INDEX IF NOT EXISTS idx_inscrits_date_inscription ON inscrits(date_inscription);
CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite);

-- Index composé pour les statistiques
CREATE INDEX IF NOT EXISTS idx_inscrits_cycle_filiere ON inscrits(cycle, filiere);
CREATE INDEX IF NOT EXISTS idx_inscrits_statut_date ON inscrits(statut, date_inscription);

-- ========================================
-- FONCTION DE GÉNÉRATION DE NUMÉRO DE DOSSIER
-- ========================================

-- Fonction pour générer automatiquement le numéro de dossier
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

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger pour générer automatiquement le numéro de dossier à l'insertion
DROP TRIGGER IF EXISTS trigger_generate_numero_dossier ON inscrits;
CREATE TRIGGER trigger_generate_numero_dossier
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    WHEN (NEW.numero_dossier IS NULL OR NEW.numero_dossier = '')
    EXECUTE FUNCTION generate_numero_dossier();

-- Trigger pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_modified_time ON inscrits;
CREATE TRIGGER trigger_update_modified_time
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_time();

-- ========================================
-- VUES POUR LES STATISTIQUES
-- ========================================

-- Vue pour les statistiques par cycle et filière
CREATE OR REPLACE VIEW stats_inscriptions AS
SELECT 
    cycle,
    filiere,
    COUNT(*) as nombre_inscrits,
    COUNT(CASE WHEN statut = 'accepte' THEN 1 END) as acceptes,
    COUNT(CASE WHEN statut = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
    DATE_TRUNC('day', MIN(date_inscription)) as premiere_inscription,
    DATE_TRUNC('day', MAX(date_inscription)) as derniere_inscription
FROM inscrits
GROUP BY cycle, filiere
ORDER BY cycle, filiere;

-- Vue pour les statistiques par genre
CREATE OR REPLACE VIEW stats_genre AS
SELECT 
    genre,
    cycle,
    COUNT(*) as nombre,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as pourcentage
FROM inscrits
GROUP BY genre, cycle
ORDER BY cycle, genre;

-- Vue pour les statistiques par nationalité
CREATE OR REPLACE VIEW stats_nationalite AS
SELECT 
    nationalite,
    COUNT(*) as nombre,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as pourcentage
FROM inscrits
GROUP BY nationalite
ORDER BY nombre DESC;

-- ========================================
-- POLITIQUES DE SÉCURITÉ RLS (Row Level Security)
-- ========================================

-- Activer RLS sur la table
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir seulement leurs propres données
CREATE POLICY "Utilisateurs peuvent voir leurs propres inscriptions" ON inscrits
    FOR SELECT USING (auth.uid()::text = email);

-- Politique pour permettre l'insertion (inscription)
CREATE POLICY "Permettre l'insertion pour tous" ON inscrits
    FOR INSERT WITH CHECK (true);

-- Politique pour les administrateurs (à ajuster selon vos besoins)
CREATE POLICY "Administrateurs peuvent tout voir" ON inscrits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@iuso-sne.ga'
        )
    );

-- ========================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ========================================

-- Données de test supprimées pour éviter les insertions automatiques

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================

-- Afficher la structure de la table créée
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table inscrits créée avec succès!';
    RAISE NOTICE '🎉 Système d''inscription IUSO-SNE prêt!';
    RAISE NOTICE '📊 Vues statistiques créées: stats_inscriptions, stats_genre, stats_nationalite';
    RAISE NOTICE '🔒 Politiques de sécurité RLS activées';
    RAISE NOTICE '⚡ Triggers de génération automatique de numéro de dossier activés';
END $$; 