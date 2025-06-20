-- Script complet pour corriger le système d'inscription
-- Ce script doit être exécuté dans Supabase SQL Editor

-- 1. Créer la table temporaire pour stocker les données d'inscription avant vérification d'email
CREATE TABLE IF NOT EXISTS public.inscrits_temp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_inscrits_temp_user_id ON public.inscrits_temp(user_id);

-- 2. Activer RLS sur la table temporaire
ALTER TABLE public.inscrits_temp ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS pour la table temporaire
CREATE POLICY "Users can insert their own temp data" ON public.inscrits_temp
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own temp data" ON public.inscrits_temp
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own temp data" ON public.inscrits_temp
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Créer la séquence pour les numéros de dossier
CREATE SEQUENCE IF NOT EXISTS numero_dossier_seq START WITH 1;

-- 5. Créer la fonction de transfert des données
CREATE OR REPLACE FUNCTION transfer_candidate_to_inscrits(
    p_user_id UUID,
    p_email TEXT,
    p_temp_data JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_numero_dossier TEXT;
    v_result JSONB;
BEGIN
    -- Générer un numéro de dossier unique
    v_numero_dossier := 'IUSO' || TO_CHAR(NOW(), 'YYYY') || LPAD(NEXTVAL('numero_dossier_seq')::TEXT, 6, '0');
    
    -- Insérer les données dans la table inscrits
    INSERT INTO public.inscrits (
        id,
        numero_dossier,
        email,
        prenom,
        nom,
        genre,
        date_naissance,
        lieu_naissance,
        nationalite,
        telephone,
        adresse,
        cycle,
        filiere,
        photo_identite_url,
        attestation_bac_url,
        mot_de_passe,
        statut,
        created_at
    ) VALUES (
        p_user_id,
        v_numero_dossier,
        COALESCE(p_temp_data->>'email', p_email),
        p_temp_data->>'prenom',
        p_temp_data->>'nom',
        p_temp_data->>'genre',
        (p_temp_data->>'date_naissance')::DATE,
        p_temp_data->>'lieu_naissance',
        p_temp_data->>'nationalite',
        p_temp_data->>'telephone',
        p_temp_data->>'adresse',
        p_temp_data->>'cycle',
        p_temp_data->>'filiere',
        p_temp_data->>'photo_identite_url',
        p_temp_data->>'attestation_bac_url',
        p_temp_data->>'mot_de_passe',
        'en_cours',
        NOW()
    );
    
    -- Retourner le résultat
    v_result := jsonb_build_object(
        'success', true,
        'numero_dossier', v_numero_dossier,
        'message', 'Inscription finalisée avec succès'
    );
    
    RETURN v_result;
EXCEPTION
    WHEN unique_violation THEN
        -- Si le candidat existe déjà, retourner son numéro de dossier
        SELECT jsonb_build_object(
            'success', true,
            'numero_dossier', numero_dossier,
            'message', 'Candidat déjà inscrit'
        ) INTO v_result
        FROM public.inscrits
        WHERE id = p_user_id OR email = p_email;
        
        RETURN v_result;
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Erreur lors du transfert des données'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION transfer_candidate_to_inscrits TO authenticated;
GRANT USAGE ON SEQUENCE numero_dossier_seq TO authenticated;

-- 7. Fonction pour nettoyer les anciennes entrées temporaires
CREATE OR REPLACE FUNCTION clean_old_temp_inscriptions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.inscrits_temp
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Vérifier que les buckets de storage existent
DO $$
BEGIN
    -- Créer le bucket pieces-candidats s'il n'existe pas
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('pieces-candidats', 'pieces-candidats', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 9. Configurer les politiques de storage pour pieces-candidats
CREATE POLICY "Authenticated users can upload files" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'pieces-candidats');

CREATE POLICY "Authenticated users can view their own files" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'pieces-candidats' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own files" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'pieces-candidats' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 10. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Script exécuté avec succès. Le système d''inscription est maintenant configuré correctement.';
END $$; 