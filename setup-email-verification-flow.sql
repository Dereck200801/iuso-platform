-- Configuration du flow de vérification d'email pour IUSO-SNE
-- Ce fichier configure le système de confirmation d'email et d'inscription

-- 1. Configuration de l'authentification Supabase
-- Dans le dashboard Supabase > Authentication > Settings

-- Email Templates > Confirm signup:
-- Subject: Confirmez votre inscription au concours IUSO-SNE
-- Body: Utiliser le template email-template-confirmation-fixed.html

-- Redirect URLs:
-- Site URL: https://votre-domaine.com
-- Redirect URLs: 
-- - https://votre-domaine.com/verify-email
-- - http://localhost:5173/verify-email (pour le développement)

-- 2. Vérifier que la table inscrits existe avec la bonne structure
CREATE TABLE IF NOT EXISTS inscrits (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    genre VARCHAR(20) NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(100) NOT NULL,
    nationalite VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse TEXT NOT NULL,
    cycle VARCHAR(50) NOT NULL,
    filiere VARCHAR(200) NOT NULL,
    photo_identite_url TEXT,
    attestation_bac_url TEXT,
    numero_dossier VARCHAR(50) UNIQUE NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente_validation',
    inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_user_id ON inscrits(user_id);
CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);
CREATE INDEX IF NOT EXISTS idx_inscrits_numero_dossier ON inscrits(numero_dossier);
CREATE INDEX IF NOT EXISTS idx_inscrits_statut ON inscrits(statut);

-- 4. RLS (Row Level Security) pour la table inscrits
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres données
CREATE POLICY "Users can view own inscription" ON inscrits
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre l'insertion de nouvelles inscriptions
CREATE POLICY "Users can insert own inscription" ON inscrits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour les administrateurs (voir toutes les inscriptions)
CREATE POLICY "Admins can view all inscriptions" ON inscrits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 5. Fonction pour générer un numéro de dossier unique
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

-- 6. Trigger pour auto-générer le numéro de dossier si pas fourni
CREATE OR REPLACE FUNCTION set_numero_dossier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_dossier IS NULL OR NEW.numero_dossier = '' THEN
        NEW.numero_dossier := generate_numero_dossier();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_numero_dossier
    BEFORE INSERT ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION set_numero_dossier();

-- 7. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON inscrits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Configuration du storage pour les documents
-- Créer les buckets s'ils n'existent pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pieces-candidats', 'pieces-candidats', false)
ON CONFLICT (id) DO NOTHING;

-- Politiques de storage pour les photos d'identité et attestations
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

-- 9. Vue pour les statistiques des inscriptions
CREATE OR REPLACE VIEW inscription_stats AS
SELECT 
    COUNT(*) as total_inscriptions,
    COUNT(CASE WHEN statut = 'en_attente_validation' THEN 1 END) as en_attente,
    COUNT(CASE WHEN statut = 'valide' THEN 1 END) as valides,
    COUNT(CASE WHEN statut = 'rejete' THEN 1 END) as rejetes,
    COUNT(CASE WHEN cycle = 'licence1' THEN 1 END) as licence,
    COUNT(CASE WHEN cycle = 'dut' THEN 1 END) as bts,
    DATE_TRUNC('day', inscription_date) as date_inscription
FROM inscrits
GROUP BY DATE_TRUNC('day', inscription_date)
ORDER BY date_inscription DESC;

-- 10. Fonction pour nettoyer les données temporaires expirées
CREATE OR REPLACE FUNCTION cleanup_expired_temp_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les utilisateurs non confirmés après 7 jours
    DELETE FROM auth.users 
    WHERE email_confirmed_at IS NULL 
    AND created_at < NOW() - INTERVAL '7 days';
    
    -- Nettoyer les fichiers orphelins dans le storage
    -- (Cette partie nécessiterait une logique plus complexe)
END;
$$ LANGUAGE plpgsql;

-- Programmer le nettoyage automatique (si pg_cron est disponible)
-- SELECT cron.schedule('cleanup-temp-data', '0 2 * * *', 'SELECT cleanup_expired_temp_data();');

COMMENT ON TABLE inscrits IS 'Table des candidats inscrits au concours IUSO-SNE';
COMMENT ON FUNCTION generate_numero_dossier() IS 'Génère un numéro de dossier unique au format IUSO + 6 chiffres';
COMMENT ON FUNCTION cleanup_expired_temp_data() IS 'Nettoie les données temporaires expirées';

-- Messages de confirmation
SELECT 'Configuration de la base de données terminée avec succès!' as message;
SELECT 'N''oubliez pas de configurer les templates d''email dans le dashboard Supabase!' as reminder; 