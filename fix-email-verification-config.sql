-- =====================================================================
-- SCRIPT DE CORRECTION - Configuration Email Verification IUSO-SNE
-- =====================================================================
-- Ce script corrige les problèmes de liens d'email expirés

-- 1. Vérifier la configuration actuelle
SELECT 
    'Configuration auth actuelle:' as info,
    jsonb_pretty(config) as current_config
FROM auth.config;

-- 2. Mettre à jour la configuration auth si nécessaire
-- Note: Ceci doit être fait principalement via le dashboard Supabase

-- 3. Nettoyer les anciens tokens expirés
DELETE FROM auth.refresh_tokens 
WHERE created_at < (NOW() - INTERVAL '7 days');

-- 4. Vérifier les utilisateurs avec email non confirmé
SELECT 
    'Utilisateurs avec email non confirmé:' as info,
    COUNT(*) as count,
    array_agg(email ORDER BY created_at DESC) FILTER (WHERE email IS NOT NULL) as emails
FROM auth.users 
WHERE email_confirmed_at IS NULL 
AND created_at > (NOW() - INTERVAL '24 hours');

-- 5. Réinitialiser les tokens de confirmation pour les utilisateurs récents
UPDATE auth.users 
SET 
    confirmation_token = encode(gen_random_bytes(32), 'hex'),
    confirmation_sent_at = NOW(),
    email_confirmed_at = NULL
WHERE email_confirmed_at IS NULL 
AND created_at > (NOW() - INTERVAL '2 hours')
AND email IS NOT NULL;

-- 6. Fonction pour renvoyer un email de confirmation manuellement
CREATE OR REPLACE FUNCTION resend_confirmation_email(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    new_token TEXT;
BEGIN
    -- Trouver l'utilisateur
    SELECT * INTO user_record
    FROM auth.users 
    WHERE email = user_email
    AND email_confirmed_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Utilisateur non trouvé ou email déjà confirmé'
        );
    END IF;
    
    -- Générer un nouveau token
    new_token := encode(gen_random_bytes(32), 'hex');
    
    -- Mettre à jour l'utilisateur
    UPDATE auth.users 
    SET 
        confirmation_token = new_token,
        confirmation_sent_at = NOW()
    WHERE id = user_record.id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Token de confirmation régénéré',
        'user_id', user_record.id,
        'email', user_email
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Nettoyer les données temporaires anciennes
DELETE FROM inscrits_temp 
WHERE created_at < (NOW() - INTERVAL '24 hours');

-- 8. Vérifier l'état de la table inscrits_temp
SELECT 
    'État table inscrits_temp:' as info,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as recent_records
FROM inscrits_temp;

-- =====================================================================
-- INFORMATIONS IMPORTANTES POUR LA CORRECTION MANUELLE
-- =====================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🔧 CORRECTION EMAIL VERIFICATION IUSO';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ÉTAPES À SUIVRE MANUELLEMENT:';
    RAISE NOTICE '';
    RAISE NOTICE '1. 🌐 DASHBOARD SUPABASE → Authentication → Settings:';
    RAISE NOTICE '   Site URL: http://localhost:5176';
    RAISE NOTICE '   Redirect URLs: http://localhost:5176/verify-email';
    RAISE NOTICE '                   http://localhost:5173/verify-email';
    RAISE NOTICE '                   http://localhost:5174/verify-email';
    RAISE NOTICE '';
    RAISE NOTICE '2. 📧 DASHBOARD SUPABASE → Authentication → Email Templates:';
    RAISE NOTICE '   Template: "Confirm signup"';
    RAISE NOTICE '   Redirect URL: {{ .SiteURL }}/verify-email?token={{ .TokenHash }}&type=signup';
    RAISE NOTICE '';
    RAISE NOTICE '3. ⚙️ REDÉMARRER LES SERVICES DOCKER:';
    RAISE NOTICE '   docker-compose down && docker-compose up -d';
    RAISE NOTICE '';
    RAISE NOTICE '4. 🧪 TESTER AVEC NOUVEL EMAIL:';
    RAISE NOTICE '   Utiliser un email différent de ceux déjà testés';
    RAISE NOTICE '';
    RAISE NOTICE '📞 Si le problème persiste, utiliser la fonction:';
    RAISE NOTICE '   SELECT resend_confirmation_email(''email@test.com'');';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$; 