import { createClient } from '@supabase/supabase-js'

// ⚙️  Paramètres Supabase
const supabaseUrl = 'https://imerksaoefmzrsfpoamr.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM1NDcyMCwiZXhwIjoyMDY1OTMwNzIwfQ.BTv39Y4iP2NvMSW_R9WD4Xnr91RAVWyt-kEGTdT7IMA'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTQ3MjAsImV4cCI6MjA2NTkzMDcyMH0.7fpNjsSxXGz_9SvWETG6ZRLqrb47ffvEvbrL9KkO4vQ'

async function main() {
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const unique = Date.now()
  const email = `test_${unique}@example.com`
  const password = 'Password123!'

  // 1️⃣ Créer un utilisateur confirmé
  const { data: userData, error: adminErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'candidat' }
  })
  if (adminErr) throw adminErr
  const userId = userData.user?.id!
  console.log('✅ Utilisateur créé:', email, userId)

  // 2️⃣ Ouvrir une session avec la clé anon (rôle authenticated)
  const client = createClient(supabaseUrl, anonKey)
  const { error: signInErr } = await client.auth.signInWithPassword({ email, password })
  if (signInErr) throw signInErr
  console.log('✅ Session ouverte (authenticated)')

  // 3️⃣ Insertion dans inscrits
  const numero = `TEST${unique.toString().slice(-6)}`
  const { error: insertErr } = await client.from('inscrits').insert({
    user_id: userId,
    email,
    prenom: 'John',
    nom: 'Doe',
    genre: 'masculin',
    date_naissance: '1990-01-01',
    lieu_naissance: 'Libreville',
    nationalite: 'Gabon',
    telephone: '+241000000',
    adresse: 'Adresse test',
    cycle: 'licence1',
    filiere: 'Management',
    numero_dossier: numero,
    statut: 'en_attente_validation',
    inscription_date: new Date().toISOString()
  })
  if (insertErr) throw insertErr
  console.log('🎉 Insertion réussie ! Numéro de dossier =', numero)

  console.log('\nVous pouvez vérifier maintenant la table inscrits.')
}

main().catch((err) => {
  console.error('❌ Erreur:', err)
  process.exit(1)
}) 