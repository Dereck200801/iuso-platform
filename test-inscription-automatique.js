import { createClient } from '@supabase/supabase-js'

// Configuration Supabase (utilise les mêmes valeurs que votre app)
const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTQ3MjAsImV4cCI6MjA2NTkzMDcyMH0.7fpNjsSxXGz_9SvWETG6ZRLqrb47ffvEvbrL9KkO4vQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('==========================================')
console.log('🧪 DÉBUT DU TEST D\'INSCRIPTION AUTOMATIQUE')
console.log('==========================================')

async function testInscription() {
  const testEmail = 'candidat.test@exemple.com'
  const testData = {
    prenom: 'Jean',
    nom: 'DUPONT',
    genre: 'masculin',
    date_naissance: '2000-06-15',
    lieu_naissance: 'Libreville',
    nationalite: 'Gabon',
    telephone: '+241 01 02 03 04',
    adresse: '123 Avenue des Tests, Libreville',
    cycle: 'licence1',
    filiere: 'Management des Organisations',
    password: 'MotDePasse123!'
  }

  let testUserId = null
  let testSuccess = true

  try {
    // =====================================================================
    // ÉTAPE 1: NETTOYAGE DES DONNÉES PRÉCÉDENTES
    // =====================================================================
    
    console.log('📋 Étape 1: Nettoyage des données de test...')
    
    // Nettoyer les données précédentes (via l'admin API si possible)
    try {
      await supabase.from('inscrits').delete().eq('email', testEmail)
      await supabase.from('inscrits_temp').delete().eq('data->>email', testEmail)
      console.log('✅ Données de test nettoyées')
    } catch (error) {
      console.log('⚠️  Nettoyage partiel (certaines tables peuvent ne pas exister)')
    }

    // =====================================================================
    // ÉTAPE 2: SIMULATION D'INSCRIPTION
    // =====================================================================
    
    console.log('📋 Étape 2: Simulation d\'inscription...')
    
    // Créer un compte utilisateur via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testData.password,
      options: {
        data: {
          firstName: testData.prenom,
          lastName: testData.nom,
          role: 'candidat'
        }
      }
    })

    if (authError) {
      console.log('❌ Erreur création compte:', authError.message)
      if (authError.message.includes('already registered')) {
        console.log('📧 Compte existant, tentative de connexion...')
        
        // Essayer de se connecter
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testData.password
        })
        
        if (signInError) {
          console.log('❌ Erreur de connexion:', signInError.message)
          throw new Error('Impossible de créer ou connecter le compte')
        }
        
        testUserId = signInData.user?.id
        console.log('✅ Connexion réussie avec compte existant')
      } else {
        throw authError
      }
    } else {
      testUserId = authData.user?.id
      console.log('✅ Nouveau compte créé avec succès')
    }

    if (!testUserId) {
      throw new Error('Impossible d\'obtenir l\'ID utilisateur')
    }

    console.log(`👤 ID utilisateur: ${testUserId}`)

    // =====================================================================
    // ÉTAPE 3: VÉRIFICATION DE L'UTILISATEUR
    // =====================================================================
    
    console.log('📋 Étape 3: Vérification de l\'utilisateur...')
    
    // Récupérer les informations de l'utilisateur
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('❌ Erreur récupération utilisateur:', userError.message)
    } else {
      console.log('✅ Utilisateur récupéré avec succès')
      console.log(`📧 Email: ${userData.user?.email}`)
      console.log(`📊 Email confirmé: ${userData.user?.email_confirmed_at ? 'Oui' : 'Non'}`)
    }

    // =====================================================================
    // ÉTAPE 4: TENTATIVE D'INSERTION DANS INSCRITS
    // =====================================================================
    
    console.log('📋 Étape 4: Tentative d\'insertion dans la table inscrits...')
    
    // Générer un numéro de dossier unique
    const numeroDossier = `LIC${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`
    
    const inscriptionData = {
      auth_user_id: testUserId,
      numero_dossier: numeroDossier,
      prenom: testData.prenom,
      nom: testData.nom,
      genre: testData.genre,
      date_naissance: testData.date_naissance,
      lieu_naissance: testData.lieu_naissance,
      nationalite: testData.nationalite,
      email: testEmail,
      telephone: testData.telephone,
      adresse: testData.adresse,
      cycle: testData.cycle,
      filiere: testData.filiere,
      mot_de_passe: testData.password,
      statut: 'en_attente',
      transferred_from_temp: true,
      email_verified_at: new Date().toISOString(),
      date_inscription: new Date().toISOString(),
      date_modification: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('inscrits')
      .insert(inscriptionData)
      .select()
    
    if (insertError) {
      console.log('❌ Erreur insertion inscrits:', insertError.message)
      console.log('💡 Cela peut être dû aux politiques RLS ou à la structure de la table')
      testSuccess = false
    } else {
      console.log('✅ Candidat inséré dans la table inscrits avec succès')
      console.log(`📄 Numéro de dossier: ${numeroDossier}`)
    }

    // =====================================================================
    // ÉTAPE 5: VÉRIFICATIONS FINALES
    // =====================================================================
    
    console.log('📋 Étape 5: Vérifications finales...')
    
    // Vérifier que le candidat est bien dans la table inscrits
    const { data: verificationData, error: verificationError } = await supabase
      .from('inscrits')
      .select('*')
      .eq('email', testEmail)
    
    if (verificationError) {
      console.log('❌ Erreur vérification:', verificationError.message)
      testSuccess = false
    } else if (verificationData && verificationData.length > 0) {
      console.log('✅ Candidat trouvé dans la table inscrits')
      const candidat = verificationData[0]
      console.log('📋 Détails de l\'inscription:')
      console.log(`   📄 Numéro de dossier: ${candidat.numero_dossier || 'N/A'}`)
      console.log(`   👤 Candidat: ${candidat.prenom} ${candidat.nom}`)
      console.log(`   🎓 Formation: ${candidat.cycle} - ${candidat.filiere}`)
      console.log(`   📊 Statut: ${candidat.statut || 'N/A'}`)
      console.log(`   📅 Date inscription: ${candidat.date_inscription || 'N/A'}`)
    } else {
      console.log('❌ Candidat non trouvé dans la table inscrits')
      testSuccess = false
    }

    // Vérifier la structure de la table
    console.log('📋 Vérification de la structure de la table...')
    
    // Test avec une requête simple pour voir les colonnes disponibles
    const { data: structureTest, error: structureError } = await supabase
      .from('inscrits')
      .select('*')
      .limit(1)
    
    if (structureError) {
      console.log('❌ Erreur structure table:', structureError.message)
      console.log('💡 La table inscrits n\'existe peut-être pas ou a des problèmes de permissions')
    } else {
      console.log('✅ Table inscrits accessible')
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
    testSuccess = false
  }

  // =====================================================================
  // RÉSULTATS FINAUX
  // =====================================================================
  
  console.log('==========================================')
  console.log('🏁 RÉSULTATS DU TEST D\'INSCRIPTION')
  console.log('==========================================')
  
  if (testSuccess) {
    console.log('🎉 TESTS RÉUSSIS !')
    console.log('✅ Le processus d\'inscription fonctionne')
    console.log('✅ Le candidat est bien enregistré')
  } else {
    console.log('❌ CERTAINS TESTS ONT ÉCHOUÉ !')
    console.log('⚠️  Le système nécessite des vérifications')
    console.log('💡 Vérifiez:')
    console.log('   - Que la table inscrits existe')
    console.log('   - Que les politiques RLS sont correctes')
    console.log('   - Que la structure de la table est à jour')
  }
  
  console.log('==========================================')

  // =====================================================================
  // NETTOYAGE OPTIONNEL
  // =====================================================================
  
  console.log('🧹 Nettoyage des données de test...')
  
  try {
    // Nettoyer les données de test
    await supabase.from('inscrits').delete().eq('email', testEmail)
    console.log('✅ Données de test nettoyées')
  } catch (error) {
    console.log('⚠️  Nettoyage partiel')
  }

  // Déconnexion
  await supabase.auth.signOut()
  console.log('🔒 Session fermée')
  
  console.log('==========================================')
  console.log('🏁 TEST D\'INSCRIPTION TERMINÉ')
  console.log('==========================================')
}

// Exécuter le test
testInscription().catch(console.error) 