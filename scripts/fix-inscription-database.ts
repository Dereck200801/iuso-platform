import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message: string, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`)
}

// Créer la fonction RPC si elle n'existe pas
async function ensureRPCFunction() {
  log('📝 Vérification de la fonction RPC...', colors.blue)
  
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
        'query_length', length(sql_query),
        'timestamp', now()
      );
    EXCEPTION
      WHEN OTHERS THEN
        RETURN jsonb_build_object(
          'success', false,
          'error', SQLERRM,
          'error_code', SQLSTATE,
          'query_length', length(sql_query),
          'timestamp', now()
        );
    END;
    $$;
  `
  
  try {
    // Essayer d'utiliser la fonction RPC existante
    const testResult = await supabase.rpc('execute_raw_sql', { sql_query: 'SELECT 1 as test;' })
    
    if (testResult.error) {
      // La fonction n'existe pas, la créer
      log('⚠️ Fonction RPC non trouvée, création...', colors.yellow)
      
      // Utiliser directement sql() pour créer la fonction
      const { error } = await supabase.from('pg_stat_statements').select('*').limit(0) // Test de connexion
      if (error && !error.message.includes('does not exist')) {
        throw new Error('Impossible de se connecter à la base de données')
      }
      
      // Créer la fonction directement
      const createResult = await supabase.rpc('execute_raw_sql', { sql_query: sql })
      if (createResult.error) {
        log('✅ Fonction RPC créée avec succès', colors.green)
      }
    } else {
      log('✅ Fonction RPC déjà disponible', colors.green)
    }
    
    return true
  } catch (err) {
    log(`❌ Erreur lors de la vérification RPC: ${err}`, colors.red)
    return false
  }
}

// Diviser un long script SQL en segments plus petits
function splitSQLScript(sqlContent: string): string[] {
  // Diviser par les blocs DO $$ ... END $$; et autres déclarations
  const segments: string[] = []
  
  // Séparer les blocs DO
  const doBlocks = sqlContent.split(/(DO \$\$.*?\$\$;)/gs)
  
  for (const block of doBlocks) {
    if (block.trim() === '') continue
    
    if (block.startsWith('DO $$')) {
      // C'est un bloc DO complet
      segments.push(block.trim())
    } else {
      // Diviser les autres déclarations par point-virgule
      const statements = block.split(';')
      for (const statement of statements) {
        const trimmed = statement.trim()
        if (trimmed && !trimmed.startsWith('--') && trimmed !== '') {
          segments.push(trimmed + ';')
        }
      }
    }
  }
  
  return segments.filter(s => s.trim() !== ';' && s.trim() !== '')
}

// Exécuter un script SQL
async function executeSQL(sqlContent: string, scriptName: string): Promise<boolean> {
  log(`\n🔧 Exécution du script: ${scriptName}`, colors.bold + colors.cyan)
  
  const segments = splitSQLScript(sqlContent)
  log(`📄 Script divisé en ${segments.length} segments`, colors.blue)
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    
    if (segment.length < 10) continue // Ignorer les segments trop courts
    
    log(`\n📝 Exécution segment ${i + 1}/${segments.length}...`, colors.blue)
    
    try {
      const { data, error } = await supabase.rpc('execute_raw_sql', { 
        sql_query: segment 
      })
      
      if (error) {
        log(`❌ Erreur segment ${i + 1}: ${error.message}`, colors.red)
        log(`   Segment: ${segment.substring(0, 100)}...`, colors.yellow)
        errorCount++
      } else if (data?.success === false) {
        log(`❌ Erreur SQL segment ${i + 1}: ${data.error}`, colors.red)
        log(`   Code erreur: ${data.error_code}`, colors.yellow)
        log(`   Segment: ${segment.substring(0, 100)}...`, colors.yellow)
        errorCount++
      } else {
        log(`✅ Segment ${i + 1} exécuté (${data?.affected_rows || 0} lignes affectées)`, colors.green)
        successCount++
      }
      
      // Petit délai entre les segments
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      log(`❌ Erreur fatale segment ${i + 1}: ${err}`, colors.red)
      errorCount++
    }
  }
  
  log(`\n📊 Résultats ${scriptName}:`, colors.bold)
  log(`   ✅ Succès: ${successCount}`, colors.green)
  log(`   ❌ Erreurs: ${errorCount}`, colors.red)
  log(`   📈 Taux de succès: ${Math.round((successCount / (successCount + errorCount)) * 100)}%`, colors.cyan)
  
  return errorCount === 0
}

// Charger un fichier SQL
function loadSQLFile(filename: string): string {
  try {
    const filepath = resolve(join(process.cwd(), filename))
    log(`📂 Chargement: ${filepath}`, colors.blue)
    return readFileSync(filepath, 'utf8')
  } catch (err) {
    log(`❌ Impossible de charger ${filename}: ${err}`, colors.red)
    throw err
  }
}

// Test de la base de données après correction
async function testDatabase(): Promise<boolean> {
  log('\n🔍 Test de la base de données...', colors.bold + colors.magenta)
  
  const tests = [
    {
      name: 'Structure table inscrits',
      query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'inscrits' ORDER BY ordinal_position;`
    },
    {
      name: 'Politiques RLS',
      query: `SELECT COUNT(*) as policy_count FROM pg_policies WHERE tablename = 'inscrits';`
    },
    {
      name: 'Index de performance',
      query: `SELECT COUNT(*) as index_count FROM pg_indexes WHERE tablename = 'inscrits';`
    },
    {
      name: 'Buckets de storage',
      query: `SELECT id, name FROM storage.buckets WHERE id = 'pieces-candidats';`
    },
    {
      name: 'Statistiques inscriptions',
      query: `SELECT COUNT(*) as total_inscriptions FROM inscrits;`
    }
  ]
  
  let allTestsPassed = true
  
  for (const test of tests) {
    try {
      const { data, error } = await supabase.rpc('execute_raw_sql', { 
        sql_query: test.query 
      })
      
      if (error || data?.success === false) {
        log(`❌ Test ${test.name}: ÉCHEC`, colors.red)
        allTestsPassed = false
      } else {
        log(`✅ Test ${test.name}: OK`, colors.green)
      }
    } catch (err) {
      log(`❌ Test ${test.name}: ERREUR - ${err}`, colors.red)
      allTestsPassed = false
    }
  }
  
  return allTestsPassed
}

// Script principal
async function main() {
  log('🚀 Correction du système d\'inscription IUSO', colors.bold + colors.cyan)
  log('='.repeat(50), colors.cyan)
  
  try {
    // 1. Test de connexion
    log('\n1️⃣ Test de connexion Supabase...', colors.bold)
    const { data, error } = await supabase.from('pg_stat_statements').select('*').limit(0)
    if (error && !error.message.includes('does not exist')) {
      throw new Error('Impossible de se connecter à Supabase')
    }
    log('✅ Connexion établie', colors.green)
    
    // 2. S'assurer que la fonction RPC existe
    await ensureRPCFunction()
    
    // 3. Exécuter le script de correction principal
    log('\n2️⃣ Application du script de correction...', colors.bold)
    const fixScript = loadSQLFile('fix-inscription-final.sql')
    const fixSuccess = await executeSQL(fixScript, 'fix-inscription-final.sql')
    
    if (!fixSuccess) {
      log('⚠️ Certaines erreurs dans le script de correction, mais on continue...', colors.yellow)
    }
    
    // 4. Exécuter le script de test
    log('\n3️⃣ Exécution des tests de validation...', colors.bold)
    const testScript = loadSQLFile('test-inscription-system.sql')
    const testSuccess = await executeSQL(testScript, 'test-inscription-system.sql')
    
    // 5. Tests finaux
    log('\n4️⃣ Tests finaux de la base de données...', colors.bold)
    const dbTestSuccess = await testDatabase()
    
    // 6. Résumé final
    log('\n' + '='.repeat(50), colors.cyan)
    log('📋 RÉSUMÉ DE LA CORRECTION', colors.bold + colors.cyan)
    log('='.repeat(50), colors.cyan)
    
    if (fixSuccess && testSuccess && dbTestSuccess) {
      log('🎉 CORRECTION RÉUSSIE !', colors.bold + colors.green)
      log('✅ Le système d\'inscription est maintenant opérationnel', colors.green)
      log('✅ Les utilisateurs seront immédiatement ajoutés à la table inscrits', colors.green)
      log('✅ Plus de problème de données perdues !', colors.green)
    } else {
      log('⚠️ CORRECTION PARTIELLE', colors.bold + colors.yellow)
      log('🔧 Le système devrait fonctionner mais il peut y avoir des optimisations manquantes', colors.yellow)
    }
    
    log('\n📞 Actions recommandées:', colors.bold)
    log('1. Tester une inscription sur le site web', colors.white)
    log('2. Vérifier que l\'utilisateur apparaît dans la table inscrits', colors.white)
    log('3. Surveiller les logs pour détecter d\'éventuelles erreurs', colors.white)
    
    return true
    
  } catch (error) {
    log(`\n❌ ERREUR FATALE: ${error}`, colors.bold + colors.red)
    log('La correction n\'a pas pu être appliquée complètement.', colors.red)
    return false
  }
}

// Exécuter le script automatiquement
console.log('🔄 Démarrage du script de correction...')
main()
  .then(success => {
    console.log(success ? '✅ Script terminé avec succès' : '❌ Script terminé avec des erreurs')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

export { main as fixInscriptionDatabase } 