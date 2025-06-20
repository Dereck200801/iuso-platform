// Script pour mettre à jour la base de données Supabase via l'API REST

const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'

async function executeSQLQuery(query) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      // Essayer une approche alternative avec l'API SQL
      const sqlResponse = await fetch(`${supabaseUrl}/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/sql',
          'apikey': supabaseServiceKey
        },
        body: query
      })
      
      if (!sqlResponse.ok) {
        throw new Error(`HTTP error! status: ${sqlResponse.status}`)
      }
      
      return await sqlResponse.json()
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ Erreur pour la requête "${query}":`, error.message)
    return { error: error.message }
  }
}

async function updateDatabase() {
  console.log('🚀 Mise à jour de la base de données IUSO via API REST...')
  
  // 1. Ajouter les nouvelles colonnes
  console.log('📝 Ajout des nouvelles colonnes...')
  
  const alterQueries = [
    'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS genre VARCHAR(20);',
    'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS date_naissance DATE;',
    'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100);',
    'ALTER TABLE inscrits ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100);'
  ]
  
  for (const query of alterQueries) {
    console.log(`Exécution: ${query}`)
    const result = await executeSQLQuery(query)
    if (result.error) {
      console.log(`⚠️ ${result.error}`)
    } else {
      console.log(`✅ Succès`)
    }
  }
  
  // 2. Créer les index
  console.log('📊 Création des index...')
  
  const indexQueries = [
    'CREATE INDEX IF NOT EXISTS idx_inscrits_genre ON inscrits(genre);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_date_naissance ON inscrits(date_naissance);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_lieu_naissance ON inscrits(lieu_naissance);',
    'CREATE INDEX IF NOT EXISTS idx_inscrits_nationalite ON inscrits(nationalite);'
  ]
  
  for (const query of indexQueries) {
    console.log(`Exécution: ${query}`)
    const result = await executeSQLQuery(query)
    if (result.error) {
      console.log(`⚠️ ${result.error}`)
    } else {
      console.log(`✅ Succès`)
    }
  }
  
  console.log('🎉 Script terminé!')
  console.log('💡 Si des erreurs sont apparues, essayez d\'exécuter les commandes manuellement dans le dashboard Supabase.')
}

// Exécuter la mise à jour
updateDatabase().catch(console.error) 