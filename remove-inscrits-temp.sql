-- =============================================================
-- SUPPRESSION DÉFINITIVE DE LA TABLE TEMPORAIRE `inscrits_temp`
-- À exécuter dans l'éditeur SQL de Supabase (ou migration CI/CD)
-- =============================================================

begin;

-- 1. Retirer les éventuelles policies RLS associées
DROP POLICY IF EXISTS "Users can insert their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can read their own temp data"   ON public.inscrits_temp;
DROP POLICY IF EXISTS "Users can delete their own temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Allow authenticated insert temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Allow authenticated read temp data"   ON public.inscrits_temp;
DROP POLICY IF EXISTS "Allow authenticated delete temp data" ON public.inscrits_temp;
DROP POLICY IF EXISTS "Allow authenticated update temp data" ON public.inscrits_temp;

-- 2. Supprimer les fonctions ou triggers liés (si présents)
DROP FUNCTION IF EXISTS clean_old_temp_inscriptions CASCADE;

-- 3. Supprimer la table et tout ce qui dépend d'elle
DROP TABLE IF EXISTS public.inscrits_temp CASCADE;

commit;

-- ✅ Table `inscrits_temp` et éléments associés supprimés avec succès 