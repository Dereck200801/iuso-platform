-- Script SQL simplifié pour mettre à jour la table inscrits
-- À exécuter dans Supabase Dashboard > SQL Editor

-- 1. Ajouter les nouvelles colonnes nécessaires pour le concours L1 & BTS
ALTER TABLE inscrits 
ADD COLUMN IF NOT EXISTS genre VARCHAR(20),
ADD COLUMN IF NOT EXISTS date_naissance DATE,
ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);

-- 2. Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre);
CREATE INDEX IF NOT EXISTS idx_inscrits_date_naissance ON inscrits(date_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance);
CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite);

-- 3. Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inscrits' 
ORDER BY ordinal_position; 