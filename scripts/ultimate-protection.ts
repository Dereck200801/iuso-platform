import { createClient } from '@supabase/supabase-js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const supabase = createClient(
  'https://imerksaoefmzrsfpoamr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

let protectionActive = true
let protectionLog: any[] = []

// Fonction pour identifier les données de test - PATTERNS GÉNÉRIQUES UNIQUEMENT
function isTestData(record: any): boolean {
  return (
    // Emails de test génériques
    record.email?.includes('@test.com') ||
    record.email?.includes('@e.co') ||
    record.email?.includes('@ex.co') ||
    record.email?.includes('@temp.') ||
    record.email?.includes('@exemple.') ||
    record.email?.includes('@example.') ||
    record.email?.match(/^test[-.]/) ||
    record.email?.match(/^t\d+@/) ||
    
    // Noms suspects génériques (plus de noms hardcodés)
    (record.prenom?.toLowerCase().includes('test') || record.nom?.toLowerCase().includes('test')) ||
    (record.prenom?.toLowerCase().includes('demo') || record.nom?.toLowerCase().includes('demo')) ||
    (record.prenom?.toLowerCase().includes('sample') || record.nom?.toLowerCase().includes('sample')) ||
    
    // Numéros de dossier suspects (patterns automatiques)
    record.numero_dossier?.match(/^LIC\d{8}$/) ||
    record.numero_dossier?.match(/^TEST/) ||
    record.numero_dossier?.match(/^DEMO/) ||
    
    // Données temporaires ou de développement
    record.telephone?.includes('000000') ||
    record.telephone?.includes('123456') ||
    record.adresse?.toLowerCase().includes('test') ||
    record.adresse?.toLowerCase().includes('temp')
  )
}

// Suppression immédiate
async function deleteTestData(records: any[]) {
  console.log(`🔥 SUPPRESSION IMMÉDIATE DE ${records.length} DONNÉE(S) DE TEST...`)
  
  let deleted = 0
  for (const record of records) {
    try {
      const { error } = await supabase
        .from('inscrits')
        .delete()
        .eq('id', record.id)
      
      if (!error) {
        deleted++
        console.log(`✅ Supprimé ID ${record.id}: ${record.prenom} ${record.nom} (${record.email})`)
      } else {
        console.log(`❌ Erreur ID ${record.id}: ${error.message}`)
      }
    } catch (err) {
      console.log(`❌ Erreur fatale ID ${record.id}: ${err}`)
    }
  }
  
  console.log(`📊 ${deleted}/${records.length} suppressions réussies`)
  return deleted
}

// Arrêt des processus suspects
async function stopSuspiciousProcesses() {
  try {
    console.log('🛑 Arrêt des processus Node.js suspects...')
    await execAsync('tasklist /FI "IMAGENAME eq node.exe" | findstr node.exe')
    await execAsync('taskkill /F /IM node.exe')
    console.log('✅ Processus Node.js arrêtés')
  } catch (err) {
    // Pas de processus Node.js actifs - c'est bien
  }
  
  try {
    console.log('🛑 Vérification Docker...')
    const { stdout } = await execAsync('docker ps -q')
    if (stdout.trim()) {
      console.log('🐳 Arrêt des containers Docker...')
      await execAsync('docker stop $(docker ps -q)')
      console.log('✅ Containers Docker arrêtés')
    }
  } catch (err) {
    // Docker non actif - c'est bien
  }
}

// Surveillance continue
async function protectDatabase() {
  console.log('🛡️ PROTECTION ACTIVE - SURVEILLANCE CONTINUE')
  console.log('=' .repeat(60))
  
  let iteration = 0
  
  while (protectionActive) {
    iteration++
    const timestamp = new Date().toLocaleTimeString()
    
    try {
      // Vérifier la base de données
      const { data, error, count } = await supabase
        .from('inscrits')
        .select('*', { count: 'exact' })
      
      if (error) {
        console.log(`❌ [${timestamp}] Erreur DB: ${error.message}`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
      
      const currentCount = count || 0
      
      if (currentCount > 0 && data) {
        // Identifier les données de test
        const testRecords = data.filter(isTestData)
        
        if (testRecords.length > 0) {
          console.log(`\n🚨 [${timestamp}] INTRUSION DÉTECTÉE !`)
          console.log(`📊 ${testRecords.length} donnée(s) de test trouvée(s) sur ${currentCount} total`)
          
          // Log de l'intrusion
          protectionLog.push({
            timestamp: new Date().toISOString(),
            detected: testRecords.length,
            total: currentCount,
            records: testRecords.map(r => ({
              id: r.id,
              name: `${r.prenom} ${r.nom}`,
              email: r.email,
              numero: r.numero_dossier
            }))
          })
          
          // Suppression immédiate
          const deleted = await deleteTestData(testRecords)
          
          // Arrêter les processus suspects
          await stopSuspiciousProcesses()
          
          console.log(`✅ [${timestamp}] Protection réussie - ${deleted} intrusion(s) neutralisée(s)`)
        }
      }
      
      // Affichage périodique
      if (iteration % 60 === 0) {
        console.log(`[${timestamp}] Protection active - ${currentCount} enregistrement(s) - ${protectionLog.length} intrusion(s) bloquée(s)`)
      }
      
    } catch (err) {
      console.log(`❌ [${timestamp}] Erreur protection: ${err}`)
    }
    
    // Attendre 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

// Nettoyage initial
async function initialCleanup() {
  console.log('🧹 NETTOYAGE INITIAL...')
  
  const { data, error } = await supabase.from('inscrits').select('*')
  
  if (error) {
    console.log(`❌ Erreur: ${error.message}`)
    return false
  }
  
  if (!data || data.length === 0) {
    console.log('✅ Base de données déjà propre')
    return true
  }
  
  const testRecords = data.filter(isTestData)
  
  if (testRecords.length > 0) {
    console.log(`📋 ${testRecords.length} donnée(s) de test détectée(s):`)
    testRecords.forEach(r => {
      console.log(`   - ID ${r.id}: ${r.prenom} ${r.nom} (${r.email})`)
    })
    
    await deleteTestData(testRecords)
  }
  
  await stopSuspiciousProcesses()
  
  console.log('✅ Nettoyage initial terminé')
  return true
}

async function main() {
  console.log('🚀 PROTECTION ULTIME ANTI-RÉCRÉATION AUTOMATIQUE')
  console.log('Surveillance 24/7 avec suppression immédiate des intrusions')
  console.log('=' .repeat(80))
  
  // Nettoyage initial
  await initialCleanup()
  
  console.log('\n🛡️ Démarrage de la protection continue...')
  console.log('Appuyez sur Ctrl+C pour arrêter\n')
  
  // Démarrer la protection
  await protectDatabase()
}

// Arrêt propre
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Arrêt de la protection...')
  protectionActive = false
  
  if (protectionLog.length > 0) {
    console.log('\n📋 RAPPORT DE PROTECTION:')
    console.log('=' .repeat(40))
    protectionLog.forEach((log, index) => {
      console.log(`${index + 1}. ${log.timestamp}`)
      console.log(`   🚨 ${log.detected} intrusion(s) détectée(s) sur ${log.total} enregistrement(s)`)
      log.records.forEach((r: any) => console.log(`   - ${r.name} (${r.email})`))
      console.log('')
    })
    
    console.log(`🎯 TOTAL: ${protectionLog.length} tentative(s) d'intrusion bloquée(s)`)
  } else {
    console.log('🎉 Aucune intrusion détectée - Protection parfaite !')
  }
  
  console.log('\n✅ Protection arrêtée proprement')
  process.exit(0)
})

main() 