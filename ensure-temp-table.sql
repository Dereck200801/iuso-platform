-- =====================================================================
-- SCRIPT D'INITIALISATION TABLE TEMPORAIRE
-- S'assurer que la table inscrits_temp existe pour le processus d'inscription
-- =====================================================================

-- Créer la table temporaire si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.inscrits_temp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_temp_user_id ON public.inscrits_temp(user_id);
CREATE INDEX IF NOT EXISTS idx_inscrits_temp_created_at ON public.inscrits_temp(created_at);

-- Activer RLS sur la table temporaire
ALTER TABLE public.inscrits_temp ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can insert their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can read their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can delete their own temp data" ON public.inscrits_temp;

-- Créer les politiques RLS pour la table temporaire
CREATE POLICY "Users can insert their own temp data" ON public.inscrits_temp
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own temp data" ON public.inscrits_temp
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own temp data" ON public.inscrits_temp
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction de nettoyage automatique des données expirées (plus de 7 jours)
CREATE OR REPLACE FUNCTION public.cleanup_expired_temp_inscriptions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.inscrits_temp
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    RAISE NOTICE 'Nettoyage automatique des données temporaires effectué';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Donner les permissions nécessaires
GRANT SELECT, INSERT, DELETE ON public.inscrits_temp TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_temp_inscriptions TO authenticated;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table inscrits_temp initialisée avec succès';
    RAISE NOTICE '✅ Politiques RLS configurées';
    RAISE NOTICE '✅ Fonction de nettoyage créée';
    RAISE NOTICE '📋 Votre système d''inscription est maintenant optimisé !';
END $$; 