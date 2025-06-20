import { createClient } from '@supabase/supabase-js'
import { createStorageBuckets } from '../src/lib/supabase'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Créer la fonction RPC pour exécution SQL
export async function createRPCFunction() {
  console.log('📝 Création de la fonction RPC pour l\'exécution SQL...')
  
  const sql = `
    CREATE OR REPLACE FUNCTION public.execute_raw_sql(sql_query text)
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      affected_rows int;
      result_data jsonb;
    BEGIN
      EXECUTE sql_query;
      GET DIAGNOSTICS affected_rows = ROW_COUNT;
      
      RETURN jsonb_build_object(
        'success', true,
        'affected_rows', affected_rows,
        'query', sql_query,
        'timestamp', now()
      );
    EXCEPTION
      WHEN OTHERS THEN
        RETURN jsonb_build_object(
          'success', false,
          'error', SQLERRM,
          'error_code', SQLSTATE,
          'query', sql_query,
          'timestamp', now()
        );
    END;
    $$;
  `
  
  try {
    const { error } = await supabase.rpc('execute_raw_sql', { sql_query: sql })
    if (error) {
      console.error('❌ Erreur création RPC:', error)
      return false
    }
    console.log('✅ Fonction RPC créée avec succès')
    return true
  } catch (err) {
    console.error('❌ Erreur création RPC:', err)
    return false
  }
}

// Créer les fonctions utilitaires
export async function createUtilityFunctions() {
  console.log('🔧 Création des fonctions utilitaires...')
  
  const functions = [
    {
      name: 'get_table_stats',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_table_stats()
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          stats jsonb := '{}';
        BEGIN
          SELECT jsonb_build_object(
            'inscrits', (SELECT count(*) FROM inscrits),
            'messages', (SELECT count(*) FROM messages),
            'candidats_retenus', (SELECT count(*) FROM candidats_retenus),
            'admis_au_concours', (SELECT count(*) FROM admis_au_concours),
            'last_updated', now()
          ) INTO stats;
          
          RETURN stats;
        END;
        $$;
      `
    },
    {
      name: 'cleanup_old_data',
      sql: `
        CREATE OR REPLACE FUNCTION public.cleanup_old_data(days_old integer DEFAULT 90)
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          deleted_count int := 0;
        BEGIN
          -- Nettoyer les messages anciens
          DELETE FROM messages 
          WHERE date < now() - interval '1 day' * days_old;
          
          GET DIAGNOSTICS deleted_count = ROW_COUNT;
          
          RETURN jsonb_build_object(
            'success', true,
            'deleted_messages', deleted_count,
            'cleanup_date', now()
          );
        EXCEPTION
          WHEN OTHERS THEN
            RETURN jsonb_build_object(
              'success', false,
              'error', SQLERRM
            );
        END;
        $$;
      `
    },
    {
      name: 'sync_health_check',
      sql: `
        CREATE OR REPLACE FUNCTION public.sync_health_check()
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          health_data jsonb;
        BEGIN
          SELECT jsonb_build_object(
            'database_time', now(),
            'tables_exist', (
              SELECT jsonb_object_agg(table_name, true)
              FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name IN ('inscrits', 'messages', 'candidats_retenus', 'admis_au_concours')
            ),
            'connection_active', true,
            'last_check', now()
          ) INTO health_data;
          
          RETURN health_data;
        END;
        $$;
      `
    }
  ]
  
  let successCount = 0
  
  for (const func of functions) {
    try {
      const { error } = await supabase.rpc('execute_raw_sql', { sql_query: func.sql })
      if (error) {
        console.error(`❌ Erreur création fonction ${func.name}:`, error)
      } else {
        console.log(`✅ Fonction ${func.name} créée`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Erreur création fonction ${func.name}:`, err)
    }
  }
  
  return successCount === functions.length
}

// Créer les triggers pour updated_at
export async function createUpdateTriggers() {
  console.log('⚡ Création des triggers de mise à jour...')
  
  const triggerSQL = `
    -- Fonction pour mettre à jour updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language plpgsql;

    -- Trigger pour la table inscrits
    DROP TRIGGER IF EXISTS update_inscrits_updated_at ON inscrits;
    CREATE TRIGGER update_inscrits_updated_at
        BEFORE UPDATE ON inscrits
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Ajouter la colonne updated_at si elle n'existe pas
    ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  `
  
  try {
    const { error } = await supabase.rpc('execute_raw_sql', { sql_query: triggerSQL })
    if (error) {
      console.error('❌ Erreur création triggers:', error)
      return false
    }
    console.log('✅ Triggers créés avec succès')
    return true
  } catch (err) {
    console.error('❌ Erreur création triggers:', err)
    return false
  }
}

// Créer les index pour les performances
export async function createPerformanceIndexes() {
  console.log('📊 Création des index de performance...')
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_inscrits_email ON inscrits(email);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_status ON inscrits(status);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_created_at ON inscrits(created_at);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_updated_at ON inscrits(updated_at);',
    'CREATE INDEX IF NOT EXISTS idx_messages_from_email ON messages(from_email);',
    'CREATE INDEX IF NOT EXISTS idx_messages_to_email ON messages(to_email);',
    'CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date);',
    'CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);'
  ]
  
  let successCount = 0
  
  for (const indexSQL of indexes) {
    try {
      const { error } = await supabase.rpc('execute_raw_sql', { sql_query: indexSQL })
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Erreur création index:', error)
      } else {
        successCount++
      }
    } catch (err) {
      console.error('❌ Erreur création index:', err)
    }
  }
  
  console.log(`✅ ${successCount}/${indexes.length} index créés`)
  return successCount === indexes.length
}

// Configuration complète
export async function setupSupabaseInfrastructure() {
  console.log('🚀 Démarrage de la configuration Supabase...')
  console.log('🔗 URL:', supabaseUrl)
  
  try {
    // Test de connexion
    const { data, error } = await supabase.from('inscrits').select('count').limit(1)
    if (error) {
      console.error('❌ Impossible de se connecter à Supabase:', error)
      return false
    }
    console.log('✅ Connexion Supabase établie')
    
    // Créer les fonctions RPC
    await createRPCFunction()
    
    // Créer les fonctions utilitaires
    await createUtilityFunctions()
    
    // Créer les triggers
    await createUpdateTriggers()
    
    // Créer les index
    await createPerformanceIndexes()
    
    // Créer les buckets de storage
    console.log('🗄️ Configuration des buckets de storage...')
    await createStorageBuckets()
    
    // Vérification finale
    console.log('🔍 Vérification finale...')
    const healthCheck = await supabase.rpc('sync_health_check')
    if (healthCheck.data) {
      console.log('✅ Health check réussi:', healthCheck.data)
    }
    
    console.log('🎉 Configuration Supabase terminée avec succès!')
    return true
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
    return false
  }
}

// Exécuter le setup si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSupabaseInfrastructure()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Erreur fatale:', error)
      process.exit(1)
    })
} 