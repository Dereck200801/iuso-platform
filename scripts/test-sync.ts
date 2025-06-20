import { syncToSupabase, syncFromSupabase, checkConnectivity, getSyncStats } from '../src/utils/supabaseSync'
import { SyncLogger } from '../src/utils/syncLogger'

async function testSyncSystem() {
  console.log('🧪 Test du système d\'automatisation Supabase...')
  console.log('=' .repeat(50))

  // 1. Test de connectivité
  console.log('1️⃣ Test de connectivité...')
  const isConnected = await checkConnectivity()
  console.log(`   Connexion: ${isConnected ? '✅ OK' : '❌ ÉCHEC'}`)

  if (!isConnected) {
    console.log('❌ Impossible de continuer sans connexion Supabase')
    return false
  }

  // 2. Test des données locales
  console.log('\n2️⃣ Vérification des données locales...')
  const stats = getSyncStats()
  console.log(`   Dernière sync: ${stats.lastSync || 'Jamais'}`)
  console.log(`   Nombre d'enregistrements: ${stats.dataCount}`)
  console.log(`   Modifications non sync: ${stats.hasUnsyncedData ? 'Oui' : 'Non'}`)

  // 3. Test de données d'exemple
  console.log('\n3️⃣ Création de données de test...')
  const testData = [
    {
      id: crypto.randomUUID(),
      email: 'test1@example.com',
      firstname: 'Test',
      lastname: 'User1',
      studycycle: 'LICENCE',
      filiere: 'INFORMATIQUE',
      status: 'en_cours',
      phone: '+221781234567',
      address: 'Dakar, Sénégal'
    },
    {
      id: crypto.randomUUID(),
      email: 'test2@example.com',
      firstname: 'Test',
      lastname: 'User2',
      studycycle: 'MASTER',
      filiere: 'GESTION',
      status: 'en_cours',
      phone: '+221787654321',
      address: 'Saint-Louis, Sénégal'
    }
  ]

  // Stocker en localStorage
  localStorage.setItem('inscrits_data', JSON.stringify(testData))
  console.log(`   ✅ ${testData.length} enregistrements de test créés`)

  // 4. Test de synchronisation vers Supabase
  console.log('\n4️⃣ Test de synchronisation vers Supabase...')
  const uploadResult = await syncToSupabase()
  
  if (uploadResult.success) {
    console.log(`   ✅ Upload réussi: ${uploadResult.count} enregistrements`)
    if (uploadResult.failed && uploadResult.failed > 0) {
      console.log(`   ⚠️ Échecs: ${uploadResult.failed}`)
      uploadResult.errors?.forEach(error => console.log(`      - ${error}`))
    }
  } else {
    console.log(`   ❌ Upload échoué: ${uploadResult.error}`)
  }

  // 5. Test de synchronisation depuis Supabase
  console.log('\n5️⃣ Test de synchronisation depuis Supabase...')
  
  // Vider le localStorage pour tester la récupération
  localStorage.removeItem('inscrits_data')
  
  const downloadResult = await syncFromSupabase()
  
  if (downloadResult.success) {
    console.log(`   ✅ Download réussi: ${downloadResult.count} enregistrements`)
    if (downloadResult.lightweight) {
      console.log('   ℹ️ Mode allégé activé (quota localStorage)')
    }
  } else {
    console.log(`   ❌ Download échoué: ${downloadResult.error}`)
  }

  // 6. Vérification des données récupérées
  console.log('\n6️⃣ Vérification des données récupérées...')
  const recoveredDataStr = localStorage.getItem('inscrits_data')
  if (recoveredDataStr) {
    const recoveredData = JSON.parse(recoveredDataStr)
    console.log(`   ✅ ${recoveredData.length} enregistrements récupérés`)
    
    // Vérifier que nos données de test sont présentes
    const testEmails = testData.map(d => d.email)
    const recoveredEmails = recoveredData.map((d: any) => d.email)
    const foundTestData = testEmails.filter(email => recoveredEmails.includes(email))
    
    console.log(`   ✅ ${foundTestData.length}/${testData.length} données de test retrouvées`)
  } else {
    console.log('   ❌ Aucune donnée récupérée')
  }

  // 7. Test des logs
  console.log('\n7️⃣ Test du système de logging...')
  SyncLogger.log('test_sync_complete', { 
    testData: testData.length,
    uploadSuccess: uploadResult.success,
    downloadSuccess: downloadResult.success
  })
  
  const logsSummary = SyncLogger.getLogsSummary()
  console.log(`   ✅ ${logsSummary.total} logs enregistrés`)
  console.log(`   ✅ ${logsSummary.errors} erreurs dans les logs`)

  // 8. Nettoyage des données de test
  console.log('\n8️⃣ Nettoyage des données de test...')
  try {
    // Note: En production, ajouter une fonction de nettoyage sécurisée
    console.log('   ℹ️ Nettoyage manuel requis en base de données')
    console.log('   ℹ️ Emails de test à supprimer: test1@example.com, test2@example.com')
  } catch (error) {
    console.log('   ⚠️ Erreur durant le nettoyage:', error)
  }

  console.log('\n' + '=' .repeat(50))
  console.log('🎉 Test du système d\'automatisation terminé!')
  console.log('=' .repeat(50))

  return uploadResult.success && downloadResult.success
}

// Fonction pour tester les performances
async function testPerformance() {
  console.log('\n⚡ Test de performance...')
  
  const startTime = performance.now()
  
  // Créer un dataset plus important
  const largeDataset = Array.from({ length: 100 }, (_, i) => ({
    id: crypto.randomUUID(),
    email: `perf-test-${i}@example.com`,
    firstname: `User${i}`,
    lastname: `Test${i}`,
    studycycle: i % 2 === 0 ? 'LICENCE' : 'MASTER',
    filiere: ['INFORMATIQUE', 'GESTION', 'MARKETING'][i % 3],
    status: 'en_cours'
  }))

  localStorage.setItem('perf_test_data', JSON.stringify(largeDataset))
  
  const syncResult = await syncToSupabase({ 
    storageKey: 'perf_test_data',
    tableName: 'inscrits'
  })
  
  const endTime = performance.now()
  const duration = endTime - startTime
  
  console.log(`   📊 ${largeDataset.length} enregistrements traités en ${duration.toFixed(2)}ms`)
  console.log(`   📊 Débit: ${(largeDataset.length / (duration / 1000)).toFixed(2)} enregistrements/seconde`)
  
  // Nettoyage
  localStorage.removeItem('perf_test_data')
  
  return syncResult.success
}

// Exécution principale
async function main() {
  try {
    const basicTestSuccess = await testSyncSystem()
    const perfTestSuccess = await testPerformance()
    
    console.log('\n📋 Résumé des tests:')
    console.log(`   Test basique: ${basicTestSuccess ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`)
    console.log(`   Test performance: ${perfTestSuccess ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`)
    
    process.exit(basicTestSuccess && perfTestSuccess ? 0 : 1)
  } catch (error) {
    console.error('❌ Erreur durant les tests:', error)
    process.exit(1)
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 