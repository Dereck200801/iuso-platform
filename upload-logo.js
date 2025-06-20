// Script pour uploader le logo IUSO vers Supabase Storage
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Configuration Supabase (remplacez par vos vraies valeurs)
const supabaseUrl = 'https://votre-projet.supabase.co'
const supabaseKey = 'votre-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadLogo() {
  try {
    console.log('🚀 Upload du logo IUSO vers Supabase Storage...')
    
    // Lire le fichier logo
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const logoPath = join(__dirname, 'src', 'assets', 'logo-iuso.png')
    
    const logoFile = readFileSync(logoPath)
    
    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('assets-publics')
      .upload('logo-iuso.png', logoFile, {
        contentType: 'image/png',
        upsert: true // Remplace si le fichier existe déjà
      })
    
    if (error) {
      console.error('❌ Erreur upload:', error)
      return
    }
    
    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('assets-publics')
      .getPublicUrl('logo-iuso.png')
    
    console.log('✅ Logo uploadé avec succès!')
    console.log('📎 URL publique:', urlData.publicUrl)
    console.log('🎯 Utilisez cette URL dans le template email')
    
    return urlData.publicUrl
    
  } catch (err) {
    console.error('❌ Erreur:', err)
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadLogo()
}

export { uploadLogo } 