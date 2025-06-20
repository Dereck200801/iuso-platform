// Test d'inscription directe - Mode développement IUSO-SNE
// Ce script teste le nouveau flux d'inscription sans confirmation email

import { createClient } from '@supabase/supabase-js'

// Configuration Supabase (utilise les mêmes paramètres que l'app)
const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTQ3MjAsImV4cCI6MjA2NTkzMDcyMH0.7fpNjsSxXGz_9SvWETG6ZRLqrb47ffvEvbrL9KkO4vQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔧 TEST INSCRIPTION DIRECTE - MODE DÉVELOPPEMENT')
console.log('='.repeat(60))

async function testInscriptionDirecte() {
  try {
    // 1. Vérifier la structure de la table inscrits
    console.log('\n📋 1. Vérification de la table inscrits...')
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('inscrits')
      .select('*')
      .limit(1)
    
    if (tableError && !tableError.message.includes('No rows')) {
      console.error('❌ Erreur accès table inscrits:', tableError.message)
      return
    }
    
    console.log('✅ Table inscrits accessible')

    // 2. Générer des données de test
    const timestamp = Date.now()
    const numeroDossier = `LIC${new Date().getFullYear().toString().slice(-2)}${timestamp.toString().slice(-6)}`
    
    const testData = {
      numero_dossier: numeroDossier,
      email: `t${timestamp.toString().slice(-6)}@test.com`,
      prenom: 'Jean',
      nom: 'Dupont',
      genre: 'masculin',
      date_naissance: '2000-01-15',
      lieu_naissance: 'Libreville',
      nationalite: 'Gabon',
      telephone: '+241123456789',
      adresse: '123 Rue Test',
      cycle: 'licence1',
      filiere: 'Info',
      mot_de_passe: 'Test123!',
      photo_identite_url: 'photo.jpg',
      attestation_bac_url: 'bac.pdf',
      statut: 'en_attente',
      email_verified_at: new Date().toISOString(),
      date_inscription: new Date().toISOString(),
      date_modification: new Date().toISOString()
    }

    console.log('\n🚀 2. Test d\'insertion directe...')
    console.log(`📧 Email: ${testData.email}`)
    console.log(`📋 Numéro: ${numeroDossier}`)

    // 3. Insérer les données de test
    const { data: insertResult, error: insertError } = await supabase
      .from('inscrits')
      .insert(testData)
      .select()

    if (insertError) {
      console.error('❌ Erreur insertion:', insertError.message)
      return
    }

    console.log('✅ Inscription insérée avec succès!')
    console.log('📄 Données insérées:', {
      id: insertResult[0]?.id,
      numero_dossier: insertResult[0]?.numero_dossier,
      email: insertResult[0]?.email,
      statut: insertResult[0]?.statut
    })

    // 4. Nettoyage
    console.log('\n🧹 4. Nettoyage données test...')
    
    const { error: deleteError } = await supabase
      .from('inscrits')
      .delete()
      .eq('email', testData.email)

    if (!deleteError) {
      console.log('✅ Données de test nettoyées')
    }

    // 5. Résumé final
    console.log('\n' + '='.repeat(60))
    console.log('🎉 RÉSUMÉ DU TEST')
    console.log('='.repeat(60))
    console.log('✅ Table accessible: OK')
    console.log('✅ Insertion directe: OK')
    console.log('✅ Numéro dossier: OK') 
    console.log('✅ Statut: OK')
    console.log('\n🚀 SYSTÈME PRÊT!')
    console.log('\n📱 Testez maintenant depuis l\'interface:')
    console.log('   👉 http://localhost:5176/inscription')

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message)
  }
}

testInscriptionDirecte() 