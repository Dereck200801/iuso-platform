-- Table pour tracker les comptes Auth orphelins
-- Ces comptes sont créés mais l'inscription a échoué
-- Permet un nettoyage manuel ou automatique ultérieur

CREATE TABLE IF NOT EXISTS orphaned_auth_accounts (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID NOT NULL,
    email TEXT NOT NULL,
    reason TEXT NOT NULL, -- 'inscription_failed', 'rollback_failed', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cleaned_up_at TIMESTAMPTZ NULL,
    cleaned_up_by TEXT NULL,
    notes TEXT NULL
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_orphaned_auth_accounts_auth_user_id 
ON orphaned_auth_accounts(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_orphaned_auth_accounts_email 
ON orphaned_auth_accounts(email);

CREATE INDEX IF NOT EXISTS idx_orphaned_auth_accounts_created_at 
ON orphaned_auth_accounts(created_at);

-- RLS (Row Level Security)
ALTER TABLE orphaned_auth_accounts ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion côté client (uniquement insertion)
CREATE POLICY "Allow insert orphaned accounts" ON orphaned_auth_accounts
    FOR INSERT
    WITH CHECK (true);

-- Politique pour lecture (admin seulement via service role)
CREATE POLICY "Admin can read orphaned accounts" ON orphaned_auth_accounts
    FOR SELECT
    USING (auth.role() = 'service_role');

-- Politique pour mise à jour (admin seulement via service role)
CREATE POLICY "Admin can update orphaned accounts" ON orphaned_auth_accounts
    FOR UPDATE
    USING (auth.role() = 'service_role');

-- Politique pour suppression (admin seulement via service role)
CREATE POLICY "Admin can delete orphaned accounts" ON orphaned_auth_accounts
    FOR DELETE
    USING (auth.role() = 'service_role');

-- Fonction pour nettoyer automatiquement les comptes orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_auth_accounts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleaned_count INTEGER := 0;
    orphan_record RECORD;
BEGIN
    -- Parcourir tous les comptes orphelins non nettoyés
    FOR orphan_record IN 
        SELECT id, auth_user_id, email, reason, created_at
        FROM orphaned_auth_accounts 
        WHERE cleaned_up_at IS NULL
        AND created_at < NOW() - INTERVAL '1 hour' -- Attendre au moins 1h avant nettoyage
    LOOP
        BEGIN
            -- Essayer de supprimer le compte Auth
            PERFORM auth.admin_delete_user(orphan_record.auth_user_id);
            
            -- Marquer comme nettoyé
            UPDATE orphaned_auth_accounts 
            SET 
                cleaned_up_at = NOW(),
                cleaned_up_by = 'auto_cleanup_function',
                notes = 'Automatically cleaned up successfully'
            WHERE id = orphan_record.id;
            
            cleaned_count := cleaned_count + 1;
            
            RAISE LOG 'Cleaned up orphaned account: % (email: %)', 
                orphan_record.auth_user_id, orphan_record.email;
                
        EXCEPTION WHEN others THEN
            -- Si la suppression échoue, noter l'erreur
            UPDATE orphaned_auth_accounts 
            SET 
                notes = COALESCE(notes, '') || ' | Cleanup failed: ' || SQLERRM
            WHERE id = orphan_record.id;
            
            RAISE LOG 'Failed to cleanup orphaned account: % (error: %)', 
                orphan_record.auth_user_id, SQLERRM;
        END;
    END LOOP;
    
    RETURN cleaned_count;
END;
$$;

-- Commentaires pour documentation
COMMENT ON TABLE orphaned_auth_accounts IS 'Tracks Auth accounts that were created but inscription process failed';
COMMENT ON COLUMN orphaned_auth_accounts.auth_user_id IS 'UUID of the Auth user that needs cleanup';
COMMENT ON COLUMN orphaned_auth_accounts.reason IS 'Why this account became orphaned (inscription_failed, rollback_failed, etc.)';
COMMENT ON FUNCTION cleanup_orphaned_auth_accounts() IS 'Function to automatically cleanup orphaned Auth accounts';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table orphaned_auth_accounts créée avec succès';
    RAISE NOTICE '📝 Utilisez cleanup_orphaned_auth_accounts() pour nettoyer les comptes orphelins';
    RAISE NOTICE '🔍 Consultez la table pour voir les comptes en attente de nettoyage';
END $$; 