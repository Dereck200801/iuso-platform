-- ============================================
-- PLATEFORME IUSO - CONFIGURATION BASE DE DONNÉES
-- ============================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES PRINCIPALES
-- ============================================

-- Table des candidats inscrits
CREATE TABLE IF NOT EXISTS inscrits (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  matricule VARCHAR UNIQUE,
  email VARCHAR UNIQUE NOT NULL,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  phone VARCHAR,
  address TEXT,
  studycycle VARCHAR NOT NULL,
  filiere VARCHAR NOT NULL,
  photo TEXT,
  birthCertificate TEXT,
  bacAttestation TEXT,
  status VARCHAR DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'valide', 'refuse')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de messagerie
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email VARCHAR NOT NULL,
  to_email VARCHAR NOT NULL,
  from_role VARCHAR NOT NULL CHECK (from_role IN ('candidat', 'admin')),
  to_role VARCHAR NOT NULL CHECK (to_role IN ('candidat', 'admin')),
  subject VARCHAR NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  attachments JSONB
);

-- Table des candidats retenus
CREATE TABLE IF NOT EXISTS candidats_retenus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule VARCHAR NOT NULL,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  studycycle VARCHAR NOT NULL,
  filiere VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des admis au concours
CREATE TABLE IF NOT EXISTS admis_au_concours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule VARCHAR NOT NULL,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  studycycle VARCHAR NOT NULL,
  filiere VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FONCTIONS ET TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at sur inscrits
DROP TRIGGER IF EXISTS update_inscrits_updated_at ON inscrits;
CREATE TRIGGER update_inscrits_updated_at
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer un matricule automatiquement
CREATE OR REPLACE FUNCTION generate_matricule(cycle VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    cycle_code VARCHAR(3);
    year_code VARCHAR(2);
    random_num VARCHAR(4);
    new_matricule VARCHAR(9);
BEGIN
    -- Extraire les 3 premiers caractères du cycle en majuscules
    cycle_code := UPPER(SUBSTRING(cycle FROM 1 FOR 3));
    
    -- Obtenir les 2 derniers chiffres de l'année
    year_code := RIGHT(EXTRACT(YEAR FROM NOW())::TEXT, 2);
    
    -- Générer un nombre aléatoire à 4 chiffres
    random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Construire le matricule
    new_matricule := cycle_code || year_code || random_num;
    
    -- Vérifier l'unicité et régénérer si nécessaire
    WHILE EXISTS (SELECT 1 FROM inscrits WHERE matricule = new_matricule) LOOP
        random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        new_matricule := cycle_code || year_code || random_num;
    END LOOP;
    
    RETURN new_matricule;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le matricule
CREATE OR REPLACE FUNCTION set_matricule()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.matricule IS NULL OR NEW.matricule = '' THEN
        NEW.matricule := generate_matricule(NEW.studycycle);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_matricule ON inscrits;
CREATE TRIGGER trigger_set_matricule
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION set_matricule();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidats_retenus ENABLE ROW LEVEL SECURITY;
ALTER TABLE admis_au_concours ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES RLS - TABLE INSCRITS
-- ============================================

-- Les candidats peuvent voir et modifier leur propre dossier
CREATE POLICY "Candidats can view own record" ON inscrits
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Candidats can update own record" ON inscrits
    FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can view all records" ON inscrits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update all records" ON inscrits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Permettre l'insertion pour les nouveaux candidats
CREATE POLICY "Allow insert for new candidates" ON inscrits
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- POLITIQUES RLS - TABLE MESSAGES
-- ============================================

-- Les utilisateurs peuvent voir les messages qui leur sont destinés ou qu'ils ont envoyés
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (
        to_email = auth.email() OR from_email = auth.email()
    );

-- Les utilisateurs peuvent envoyer des messages
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (from_email = auth.email());

-- Les utilisateurs peuvent marquer leurs messages comme lus
CREATE POLICY "Users can update their messages" ON messages
    FOR UPDATE USING (to_email = auth.email());

-- ============================================
-- POLITIQUES RLS - TABLES ADMIN SEULEMENT
-- ============================================

-- Candidats retenus - Admin seulement
CREATE POLICY "Admin only access to candidats_retenus" ON candidats_retenus
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Admis au concours - Admin seulement
CREATE POLICY "Admin only access to admis_au_concours" ON admis_au_concours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour les statistiques
CREATE OR REPLACE VIEW stats_candidatures AS
SELECT 
    COUNT(*) as total_candidats,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN studycycle = 'licence1' THEN 1 END) as licence1,
    COUNT(CASE WHEN studycycle = 'licence2' THEN 1 END) as licence2,
    COUNT(CASE WHEN studycycle = 'licence3' THEN 1 END) as licence3,
    COUNT(CASE WHEN studycycle = 'master1' THEN 1 END) as master1,
    COUNT(CASE WHEN studycycle = 'master2' THEN 1 END) as master2,
    COUNT(CASE WHEN studycycle = 'dut' THEN 1 END) as dut
FROM inscrits;

-- Vue pour les candidatures par filière
CREATE OR REPLACE VIEW stats_par_filiere AS
SELECT 
    filiere,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN status = 'refuse' THEN 1 END) as refuses,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours
FROM inscrits
GROUP BY filiere
ORDER BY total DESC;

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Créer un utilisateur admin de test (à exécuter après avoir créé le compte)
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@iuso-sne.edu.sn';

-- ============================================
-- STORAGE BUCKET CONFIGURATION
-- ============================================

-- Créer le bucket pour les pièces justificatives
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre aux candidats d'uploader leurs documents
CREATE POLICY "Candidats can upload their documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pieces-candidats' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux candidats de voir leurs documents
CREATE POLICY "Candidats can view their documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux candidats de supprimer leurs documents
CREATE POLICY "Candidats can delete their documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'pieces-candidats' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux admins de voir tous les documents
CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'pieces-candidats' 
    AND EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ============================================

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_inscrits_matricule ON inscrits(matricule);
CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);
CREATE INDEX IF NOT EXISTS idx_inscrits_status ON inscrits(status);
CREATE INDEX IF NOT EXISTS idx_inscrits_studycycle ON inscrits(studycycle);
CREATE INDEX IF NOT EXISTS idx_inscrits_filiere ON inscrits(filiere);
CREATE INDEX IF NOT EXISTS idx_inscrits_created_at ON inscrits(created_at);

CREATE INDEX IF NOT EXISTS idx_messages_to_email ON messages(to_email);
CREATE INDEX IF NOT EXISTS idx_messages_from_email ON messages(from_email);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- ============================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================

COMMENT ON TABLE inscrits IS 'Table principale des candidats inscrits';
COMMENT ON TABLE messages IS 'Table de messagerie entre candidats et administration';
COMMENT ON TABLE candidats_retenus IS 'Liste des candidats retenus après sélection';
COMMENT ON TABLE admis_au_concours IS 'Liste finale des candidats admis';

COMMENT ON COLUMN inscrits.matricule IS 'Matricule unique généré automatiquement';
COMMENT ON COLUMN inscrits.status IS 'Statut du dossier: en_cours, valide, refuse';
COMMENT ON COLUMN messages.read IS 'Indicateur si le message a été lu';

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Configuration de la base de données IUSO terminée avec succès!';
    RAISE NOTICE 'Tables créées: inscrits, messages, candidats_retenus, admis_au_concours';
    RAISE NOTICE 'RLS activé sur toutes les tables avec politiques appropriées';
    RAISE NOTICE 'Bucket storage "pieces-candidats" configuré';
    RAISE NOTICE 'Vues statistiques créées: stats_candidatures, stats_par_filiere';
END $$; 