-- Test de connexion Supabase pour IUSO Platform
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier que nous sommes connectés
SELECT 'Connexion Supabase réussie!' as message, now() as timestamp;

-- Créer la table principale des inscrits (version simplifiée pour test)
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

-- Activer RLS sur la table
ALTER TABLE inscrits ENABLE ROW LEVEL SECURITY;

-- Politique simple pour permettre aux utilisateurs de voir leur propre dossier
CREATE POLICY "Users can view own record" ON inscrits
    FOR SELECT USING (auth.uid() = id);

-- Politique pour permettre l'insertion
CREATE POLICY "Allow insert for authenticated users" ON inscrits
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politique pour permettre la mise à jour de son propre dossier
CREATE POLICY "Users can update own record" ON inscrits
    FOR UPDATE USING (auth.uid() = id);

-- Afficher un message de confirmation
SELECT 'Table inscrits créée avec succès!' as message;
SELECT 'RLS activé avec politiques de base' as security_status; 