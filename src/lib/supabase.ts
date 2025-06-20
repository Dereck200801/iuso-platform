import { createClient } from '@supabase/supabase-js'

// Configuration flexible avec fallbacks
const supabaseUrl = localStorage.getItem('supabase_url') 
  || import.meta.env.VITE_SUPABASE_URL
  || 'https://imerksaoefmzrsfpoamr.supabase.co'

const supabaseAnonKey = localStorage.getItem('supabase_anon_key')
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXJrc2FvZWZtenJzZnBvYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTQ3MjAsImV4cCI6MjA2NTkzMDcyMH0.7fpNjsSxXGz_9SvWETG6ZRLqrb47ffvEvbrL9KkO4vQ'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  auth: { 
    persistSession: true, 
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
})

// Mapping de champs personnalisé
const fieldMapping: Record<string, string> = {
  firstName: 'firstname',
  lastName: 'lastname',
  phoneNumber: 'phone',
  dateOfBirth: 'date_naissance',
  placeOfBirth: 'lieu_naissance',
  nationality: 'nationalite',
  studyCycle: 'studycycle',
  studyField: 'filiere',
  birthCertificate: 'birthCertificate',
  bacAttestation: 'bacAttestation',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

// Fonctions de mapping camelCase ↔ snake_case
export function mapFieldsToSnakeCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj
  
  const mapped: any = {}
  Object.entries(obj).forEach(([key, value]) => {
    const snakeKey = fieldMapping[key] || key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)
    mapped[snakeKey] = value
  })
  return mapped
}

export function mapFieldsToCamelCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj
  
  const mapped: any = {}
  const reverseMapping = Object.fromEntries(
    Object.entries(fieldMapping).map(([k, v]) => [v, k])
  )
  
  Object.entries(obj).forEach(([key, value]) => {
    const camelKey = reverseMapping[key] || key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    mapped[camelKey] = value
  })
  return mapped
}

// Fonction d'upsert sécurisée avec mapping automatique
export async function safeUpsert(tableName: string, data: any, primaryKey = 'id') {
  try {
    // Mapper les champs camelCase vers snake_case
    const mappedData = mapFieldsToSnakeCase(data)
    
    // Vérifier l'existence
    const { data: existing } = await supabase
      .from(tableName)
      .select(primaryKey)
      .eq(primaryKey, data[primaryKey])
      .single()
    
    if (existing) {
      // Mise à jour
      return await supabase
        .from(tableName)
        .update(mappedData)
        .eq(primaryKey, data[primaryKey])
    } else {
      // Insertion
      return await supabase
        .from(tableName)
        .insert(mappedData)
    }
  } catch (error) {
    console.error('Erreur safeUpsert:', error)
    return { error }
  }
}



// Fonction pour créer les buckets de storage
export async function createStorageBuckets() {
  const buckets = [
    { name: 'pieces-candidats', public: true, fileSizeLimit: 50 * 1024 * 1024 },
    { name: 'documents', public: true, fileSizeLimit: 10 * 1024 * 1024 },
    { name: 'images', public: true, fileSizeLimit: 5 * 1024 * 1024 }
  ]
  
  for (const bucket of buckets) {
    const { error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit
    })
    
    if (error && !error.message.includes('already exists')) {
      console.error(`Erreur bucket ${bucket.name}:`, error)
    } else {
      console.log(`✅ Bucket ${bucket.name} configuré`)
    }
  }
}

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      inscrits: {
        Row: {
          id: string
          matricule: string | null
          email: string
          firstname: string
          lastname: string
          phone: string | null
          address: string | null
          studycycle: string
          filiere: string
          photo: string | null
          birthCertificate: string | null
          bacAttestation: string | null
          status: 'en_cours' | 'valide' | 'refuse'
          created_at: string
        }
        Insert: {
          id?: string
          matricule?: string | null
          email: string
          firstname: string
          lastname: string
          phone?: string | null
          address?: string | null
          studycycle: string
          filiere: string
          photo?: string | null
          birthCertificate?: string | null
          bacAttestation?: string | null
          status?: 'en_cours' | 'valide' | 'refuse'
          created_at?: string
        }
        Update: {
          id?: string
          matricule?: string | null
          email?: string
          firstname?: string
          lastname?: string
          phone?: string | null
          address?: string | null
          studycycle?: string
          filiere?: string
          photo?: string | null
          birthCertificate?: string | null
          bacAttestation?: string | null
          status?: 'en_cours' | 'valide' | 'refuse'
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          from_email: string
          to_email: string
          from_role: 'candidat' | 'admin'
          to_role: 'candidat' | 'admin'
          subject: string
          content: string
          date: string
          read: boolean
          attachments: any | null
        }
        Insert: {
          id?: string
          from_email: string
          to_email: string
          from_role: 'candidat' | 'admin'
          to_role: 'candidat' | 'admin'
          subject: string
          content: string
          date?: string
          read?: boolean
          attachments?: any | null
        }
        Update: {
          id?: string
          from_email?: string
          to_email?: string
          from_role?: 'candidat' | 'admin'
          to_role?: 'candidat' | 'admin'
          subject?: string
          content?: string
          date?: string
          read?: boolean
          attachments?: any | null
        }
      }
      candidats_retenus: {
        Row: {
          id: string
          matricule: string
          firstname: string
          lastname: string
          email: string
          studycycle: string
          filiere: string
          created_at: string
        }
        Insert: {
          id?: string
          matricule: string
          firstname: string
          lastname: string
          email: string
          studycycle: string
          filiere: string
          created_at?: string
        }
        Update: {
          id?: string
          matricule?: string
          firstname?: string
          lastname?: string
          email?: string
          studycycle?: string
          filiere?: string
          created_at?: string
        }
      }
      admis_au_concours: {
        Row: {
          id: string
          matricule: string
          firstname: string
          lastname: string
          email: string
          studycycle: string
          filiere: string
          created_at: string
        }
        Insert: {
          id?: string
          matricule: string
          firstname: string
          lastname: string
          email: string
          studycycle: string
          filiere: string
          created_at?: string
        }
        Update: {
          id?: string
          matricule?: string
          firstname?: string
          lastname?: string
          email?: string
          studycycle?: string
          filiere?: string
          created_at?: string
        }
      }
    }
  }
} 