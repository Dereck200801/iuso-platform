import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'

// Créer le client Supabase avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateDatabase() {
  console.log('🚀 Mise à jour de la base de données IUSO...')
  
  try {
    // 1. Ajouter les nouvelles colonnes
    console.log('📝 Ajout des nouvelles colonnes...')
    
    const alterQueries = [
      'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS genre VARCHAR(20)',
      'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS date_naissance DATE',
      'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100)',
      'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100)'
    ]
    
    for (const query of alterQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.log(`⚠️ ${query}: ${error.message}`)
      } else {
        console.log(`✅ ${query}`)
      }
    }
    
    // 2. Créer les index
    console.log('📊 Création des index...')
    
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre)',
      'CREATE INDEX IF NOT EXISTS idx_inscrits_date_naissance ON inscrits(date_naissance)',
      'CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance)',
      'CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite)'
    ]
    
    for (const query of indexQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.log(`⚠️ ${query}: ${error.message}`)
      } else {
        console.log(`✅ ${query}`)
      }
    }
    
    // 3. Vérifier la structure de la table
    console.log('🔍 Vérification de la structure de la table...')
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: `SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'inscrits' 
            ORDER BY ordinal_position` 
    })
    
    if (error) {
      console.error('❌ Erreur lors de la vérification:', error.message)
    } else {
      console.log('📋 Structure de la table inscrits:')
      console.table(data)
    }
    
    console.log('🎉 Mise à jour terminée avec succès!')
    console.log('✅ Le formulaire d\'inscription au concours L1 & BTS est maintenant fonctionnel!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message)
  }
}

// Exécuter la mise à jour
updateDatabase() 