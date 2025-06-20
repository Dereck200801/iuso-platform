import { supabase, safeUpsert, mapFieldsToCamelCase, mapFieldsToSnakeCase } from '../lib/supabase'

export interface SyncResult {
  success: boolean
  count?: number
  failed?: number
  errors?: string[]
  error?: string
  lightweight?: boolean
}

export interface SyncOptions {
  forceCleanup?: boolean
  filter?: any
  tableName?: string
  storageKey?: string
}

// Synchronisation de localStorage vers Supabase
export async function syncToSupabase(options: SyncOptions = {}): Promise<SyncResult> {
  const {
    tableName = 'inscrits',
    storageKey = 'inscrits_data'
  } = options

  try {
    const dataStr = localStorage.getItem(storageKey)
    if (!dataStr || dataStr === '[]' || dataStr === 'null') {
      return { success: true, count: 0 }
    }

    const data = JSON.parse(dataStr)
    const dataArray = Array.isArray(data) ? data : [data]
    
    if (dataArray.length === 0) {
      return { success: true, count: 0 }
    }

    const results = { success: 0, failed: 0, errors: [] as string[] }
    
    for (const item of dataArray) {
      try {
        // S'assurer qu'il y a un ID
        if (!item.id) {
          item.id = crypto.randomUUID()
        }

        const { error } = await safeUpsert(tableName, item, 'id')
        
        if (error) {
          results.failed++
          results.errors.push(error.message || 'Erreur inconnue')
        } else {
          results.success++
        }
      } catch (err: any) {
        results.failed++
        results.errors.push(err.message || 'Erreur inconnue')
      }
    }
    
    return {
      success: results.failed === 0,
      count: results.success,
      failed: results.failed,
      errors: results.errors
    }
  } catch (error: any) {
    console.error('Erreur syncToSupabase:', error)
    return { success: false, error: error.message }
  }
}

// Synchronisation de Supabase vers localStorage
export async function syncFromSupabase(options: SyncOptions = {}): Promise<SyncResult> {
  const {
    forceCleanup = false,
    filter = null,
    tableName = 'inscrits',
    storageKey = 'inscrits_data'
  } = options
  
  try {
    if (forceCleanup) {
      // Nettoyer seulement les clés spécifiées
      const keysToClean = [storageKey, 'user_data', 'form_data']
      keysToClean.forEach(key => localStorage.removeItem(key))
    }
    
    let query = supabase.from(tableName).select('*')
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    if (error) throw error
    
    if (!data || data.length === 0) {
      localStorage.setItem(storageKey, '[]')
      return { success: true, count: 0 }
    }
    
    // Mapper vers camelCase pour localStorage
    const mappedData = data.map(mapFieldsToCamelCase)
    
    // Gestion du quota localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(mappedData))
    } catch (quotaError: any) {
      if (quotaError.name === 'QuotaExceededError') {
        console.warn('Quota localStorage dépassé, passage en mode allégé')
        
        // Stratégie de récupération: données allégées
        const lightData = mappedData.map(removeHeavyFields)
        
        try {
          localStorage.clear()
          localStorage.setItem(storageKey, JSON.stringify(lightData))
          return { success: true, count: lightData.length, lightweight: true }
        } catch (secondError) {
          // Dernier recours: garder seulement les données essentielles
          const essentialData = mappedData.slice(0, 10).map(keepEssentialFields)
          localStorage.setItem(storageKey, JSON.stringify(essentialData))
          return { success: true, count: essentialData.length, lightweight: true }
        }
      } else {
        throw quotaError
      }
    }
    
    return { success: true, count: mappedData.length }
  } catch (error: any) {
    console.error('Erreur syncFromSupabase:', error)
    return { success: false, error: error.message }
  }
}

// Synchronisation spécifique pour les messages
export async function syncMessagesToSupabase(): Promise<SyncResult> {
  return syncToSupabase({
    tableName: 'messages',
    storageKey: 'messages_data'
  })
}

export async function syncMessagesFromSupabase(userEmail?: string): Promise<SyncResult> {
  const filter = userEmail ? { from_email: userEmail } : null
  return syncFromSupabase({
    tableName: 'messages',
    storageKey: 'messages_data',
    filter
  })
}

// Synchronisation différentielle (seulement les changements)
export async function syncDelta(lastSyncTime?: string): Promise<SyncResult> {
  try {
    let query = supabase
      .from('inscrits')
      .select('*')
    
    if (lastSyncTime) {
      query = query.gte('updated_at', lastSyncTime)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    if (!data || data.length === 0) {
      return { success: true, count: 0 }
    }
    
    // Fusionner avec les données existantes
    const existingData = JSON.parse(localStorage.getItem('inscrits_data') || '[]')
    const mappedNewData = data.map(mapFieldsToCamelCase)
    
    // Créer un Map pour une fusion efficace
    const dataMap = new Map(existingData.map((item: any) => [item.id, item]))
    
    // Mettre à jour avec les nouvelles données
    mappedNewData.forEach(item => {
      dataMap.set(item.id, item)
    })
    
    const mergedData = Array.from(dataMap.values())
    localStorage.setItem('inscrits_data', JSON.stringify(mergedData))
    
    // Sauvegarder le timestamp de la dernière sync
    localStorage.setItem('last_sync_time', new Date().toISOString())
    
    return { success: true, count: mappedNewData.length }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Synchronisation complète bidirectionnelle
export async function fullSync(): Promise<{ upload: SyncResult; download: SyncResult }> {
  const upload = await syncToSupabase()
  const download = await syncFromSupabase()
  
  return { upload, download }
}

// Utilitaires pour gérer le quota localStorage
function removeHeavyFields(item: any): any {
  const { photo, birthCertificate, bacAttestation, ...lightItem } = item
  return {
    ...lightItem,
    photo: photo ? '[FILE_REMOVED]' : null,
    birthCertificate: birthCertificate ? '[FILE_REMOVED]' : null,
    bacAttestation: bacAttestation ? '[FILE_REMOVED]' : null
  }
}

function keepEssentialFields(item: any): any {
  return {
    id: item.id,
    email: item.email,
    firstname: item.firstname,
    lastname: item.lastname,
    status: item.status,
    studycycle: item.studycycle,
    filiere: item.filiere
  }
}

// Vérification de la connectivité
export async function checkConnectivity(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('inscrits')
      .select('id')
      .limit(1)
    
    return !error
  } catch {
    return false
  }
}

// Obtenir les statistiques de sync
export function getSyncStats(): {
  lastSync: string | null
  dataCount: number
  hasUnsyncedData: boolean
} {
  const lastSync = localStorage.getItem('last_sync_time')
  const data = JSON.parse(localStorage.getItem('inscrits_data') || '[]')
  const hasUnsyncedData = localStorage.getItem('has_unsynced_changes') === 'true'
  
  return {
    lastSync,
    dataCount: data.length,
    hasUnsyncedData
  }
}

// Marquer les données comme ayant des changements non synchronisés
export function markAsUnsynced() {
  localStorage.setItem('has_unsynced_changes', 'true')
}

// Marquer les données comme synchronisées
export function markAsSynced() {
  localStorage.removeItem('has_unsynced_changes')
} 