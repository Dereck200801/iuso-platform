-- =====================================================================
-- CORRECTION DES POLITIQUES RLS POUR LA TABLE TEMPORAIRE
-- Permettre l'insertion et l'accès aux données temporaires
-- =====================================================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can insert their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can read their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can delete their own temp data" ON public.inscrits_temp;

-- Créer des politiques plus permissives pour la table temporaire
CREATE POLICY "Allow authenticated insert temp data" ON public.inscrits_temp
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read temp data" ON public.inscrits_temp
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete temp data" ON public.inscrits_temp
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Créer une politique pour UPDATE aussi
CREATE POLICY "Allow authenticated update temp data" ON public.inscrits_temp
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Donner les permissions complètes à authenticated
GRANT ALL ON public.inscrits_temp TO authenticated;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Politiques RLS corrigées pour inscrits_temp';
    RAISE NOTICE '✅ Permissions accordées pour authenticated';
    RAISE NOTICE '🔧 Table temporaire maintenant pleinement fonctionnelle';
END $$; 