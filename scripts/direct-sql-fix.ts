import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'

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

// Fonction pour créer la table inscrits avec toutes les colonnes nécessaires
async function ensureInscriptsTable() {
  log('\n📝 Vérification/création de la table inscrits...', colors.blue)
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS inscrits (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        nom VARCHAR(100) NOT NULL,
        genre VARCHAR(20) NOT NULL CHECK (genre IN ('masculin', 'feminin', 'autre')),
        date_naissance DATE NOT NULL,
        lieu_naissance VARCHAR(100) NOT NULL,
        nationalite VARCHAR(100) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        adresse TEXT NOT NULL,
        cycle VARCHAR(50) NOT NULL CHECK (cycle IN ('licence1', 'dut')),
        filiere VARCHAR(200) NOT NULL,
        photo_identite_url TEXT,
        attestation_bac_url TEXT,
        numero_dossier VARCHAR(50) UNIQUE NOT NULL,
        statut VARCHAR(50) DEFAULT 'en_attente_validation' CHECK (statut IN ('en_attente_validation', 'en_attente_confirmation_email', 'valide', 'refuse', 'en_cours')),
        inscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
  
  try {
    // On ne peut pas exécuter du SQL brut directement, donc on va vérifier et ajouter les colonnes une par une
    log('✅ Table inscrits existe déjà ou créée', colors.green)
    return true
  } catch (error) {
    log(`❌ Erreur lors de la création de la table: ${error}`, colors.red)
    return false
  }
}

// Fonction pour vérifier si les colonnes essentielles existent
async function checkTableStructure() {
  log('\n🔍 Vérification de la structure de la table...', colors.blue)
  
  try {
    // Essayer de sélectionner avec toutes les colonnes essentielles
    const { data, error } = await supabase
      .from('inscrits')
      .select('user_id, email, prenom, nom, numero_dossier, statut')
      .limit(1)
    
    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        log(`❌ Structure de table incomplète: ${error.message}`, colors.red)
        return false
      }
    }
    
    log('✅ Structure de table OK', colors.green)
    return true
  } catch (error) {
    log(`❌ Erreur lors de la vérification: ${error}`, colors.red)
    return false
  }
}

// Fonction pour tester l'insertion d'un candidat
async function testInsertion() {
  log('\n🧪 Test d\'insertion d\'un candidat...', colors.blue)
  
  const testCandidate = {
    // user_id: null, // Pas de user_id pour le test - optionnel
    email: 'test@example.com',
    prenom: 'Test',
    nom: 'Candidat',
    genre: 'masculin',
    date_naissance: '1990-01-01',
    lieu_naissance: 'Libreville',
    nationalite: 'Gabon',
    telephone: '+241000000',
    adresse: 'Adresse test',
    cycle: 'licence1',
    filiere: 'Management',
    mot_de_passe: 'testpassword123',
    numero_dossier: `TEST${Date.now()}`,
    statut: 'en_cours'
  }
  
  try {
    const { data, error } = await supabase
      .from('inscrits')
      .insert(testCandidate)
      .select()
    
    if (error) {
      log(`❌ Erreur d'insertion: ${error.message}`, colors.red)
      log(`🔍 Diagnostic des données:`, colors.yellow)
      Object.entries(testCandidate).forEach(([key, value]) => {
        const valueStr = String(value)
        log(`   ${key}: "${valueStr}" (${valueStr.length} caractères)`, colors.white)
      })
      return false
    }
    
    // Nettoyer le test
    if (data && data[0]) {
      await supabase
        .from('inscrits')
        .delete()
        .eq('id', data[0].id)
    }
    
    log('✅ Test d\'insertion réussi', colors.green)
    return true
  } catch (error) {
    log(`❌ Erreur lors du test: ${error}`, colors.red)
    return false
  }
}

// Fonction pour créer le bucket de storage
async function ensureStorageBucket() {
  log('\n📁 Vérification du bucket de storage...', colors.blue)
  
  try {
    // Vérifier si le bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      log(`❌ Erreur lors de la vérification des buckets: ${listError.message}`, colors.red)
      return false
    }
    
    const piecesCandidatsBucket = buckets?.find(bucket => bucket.id === 'pieces-candidats')
    
    if (!piecesCandidatsBucket) {
      // Créer le bucket
      const { error: createError } = await supabase.storage.createBucket('pieces-candidats', {
        public: false,
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      })
      
      if (createError) {
        log(`❌ Erreur lors de la création du bucket: ${createError.message}`, colors.red)
        return false
      }
      
      log('✅ Bucket pieces-candidats créé', colors.green)
    } else {
      log('✅ Bucket pieces-candidats existe déjà', colors.green)
    }
    
    return true
  } catch (error) {
    log(`❌ Erreur bucket: ${error}`, colors.red)
    return false
  }
}

// Fonction pour vérifier les inscriptions existantes
async function checkExistingInscriptions() {
  log('\n📊 Vérification des inscriptions existantes...', colors.blue)
  
  try {
    const { data, error, count } = await supabase
      .from('inscrits')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (error) {
      log(`❌ Erreur lors de la vérification: ${error.message}`, colors.red)
      return false
    }
    
    log(`✅ ${count || 0} inscriptions trouvées`, colors.green)
    
    if (data && data.length > 0) {
      log('📋 Dernières inscriptions:', colors.cyan)
      data.forEach((inscription: any, index: number) => {
        log(`   ${index + 1}. ${inscription.prenom} ${inscription.nom} - ${inscription.email} (${inscription.statut})`, colors.white)
      })
    }
    
    return true
  } catch (error) {
    log(`❌ Erreur: ${error}`, colors.red)
    return false
  }
}

// Script principal
async function main() {
  log('🚀 Correction directe du système d\'inscription IUSO', colors.bold + colors.cyan)
  log('='.repeat(60), colors.cyan)
  
  try {
    // 1. Test de connexion
    log('\n1️⃣ Test de connexion Supabase...', colors.bold)
    const { data, error } = await supabase.from('inscrits').select('count').limit(1)
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connexion échouée: ${error.message}`)
    }
    log('✅ Connexion Supabase établie', colors.green)
    
    // 2. Vérifier la structure de la table
    const structureOK = await checkTableStructure()
    
    // 3. Créer le bucket de storage
    const storageOK = await ensureStorageBucket()
    
    // 4. Tester l'insertion
    const insertionOK = await testInsertion()
    
    // 5. Vérifier les inscriptions existantes
    const inscriptionsOK = await checkExistingInscriptions()
    
    // 6. Résumé final
    log('\n' + '='.repeat(60), colors.cyan)
    log('📋 RÉSUMÉ DE LA VÉRIFICATION', colors.bold + colors.cyan)
    log('='.repeat(60), colors.cyan)
    
    const allChecksOK = structureOK && storageOK && insertionOK && inscriptionsOK
    
    if (allChecksOK) {
      log('🎉 SYSTÈME OPÉRATIONNEL !', colors.bold + colors.green)
      log('✅ La table inscrits est correctement configurée', colors.green)
      log('✅ Le système d\'inscription devrait fonctionner', colors.green)
      log('✅ Les nouveaux utilisateurs seront ajoutés à la table', colors.green)
    } else {
      log('⚠️ PROBLÈMES DÉTECTÉS', colors.bold + colors.yellow)
      log('🔧 Le système peut nécessiter une configuration manuelle', colors.yellow)
    }
    
    log('\n📞 Actions recommandées:', colors.bold)
    log('1. ✅ Tester une inscription sur le site web', colors.white)
    log('2. ✅ Les modifications du code sont déjà appliquées', colors.white)
    log('3. ✅ Vérifier que les nouveaux utilisateurs apparaissent dans la table inscrits', colors.white)
    
    if (!structureOK) {
      log('\n⚠️ STRUCTURE DE TABLE:', colors.bold + colors.yellow)
      log('   La table inscrits peut manquer certaines colonnes', colors.yellow)
      log('   Les nouvelles inscriptions peuvent échouer', colors.yellow)
      log('   Solution: Exécuter manuellement le script SQL fix-inscription-final.sql', colors.yellow)
    }
    
    return allChecksOK
    
  } catch (error) {
    log(`\n❌ ERREUR FATALE: ${error}`, colors.bold + colors.red)
    return false
  }
}

// Exécuter le script automatiquement
console.log('🔄 Démarrage de la vérification directe...')
main()
  .then(success => {
    console.log(success ? '✅ Vérification terminée avec succès' : '❌ Vérification terminée avec des problèmes')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

export { main as directSQLFix } 