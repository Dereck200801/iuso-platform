import { syncToSupabase, syncFromSupabase } from './supabaseSync'
import { SyncLogger } from './syncLogger'
import { ErrorRecoveryManager } from './errorRecovery'

export interface AutoSaveConfig {
  saveInterval?: number
  changeDetectionInterval?: number
  maxRetries?: number
  timeout?: number
  enableWindowEvents?: boolean
  enablePeriodicSync?: boolean
  enableChangeDetection?: boolean
  storageKeys?: string[]
  retryDelay?: number
}

export interface SyncEvent {
  type: 'save_start' | 'save_success' | 'save_error' | 'sync_start' | 'sync_success' | 'sync_error'
  data?: any
  error?: string
  timestamp: Date
}

export class AutoSaveManager {
  private isEnabled = true
  private isSaving = false
  private saveInterval: number
  private changeDetectionInterval: number
  private maxRetries: number
  private timeout: number
  private enableWindowEvents: boolean
  private enablePeriodicSync: boolean
  private enableChangeDetection: boolean
  private storageKeys: string[]
  private retryDelay: number
  private lastDataHash: string | null = null
  private listeners = new Set<(event: SyncEvent) => void>()
  private intervalIds: NodeJS.Timeout[] = []

  constructor(config: AutoSaveConfig = {}) {
    this.saveInterval = config.saveInterval || 30000 // 30 secondes
    this.changeDetectionInterval = config.changeDetectionInterval || 10000 // 10 secondes
    this.maxRetries = config.maxRetries || 3
    this.timeout = config.timeout || 30000
    this.enableWindowEvents = config.enableWindowEvents !== false
    this.enablePeriodicSync = config.enablePeriodicSync !== false
    this.enableChangeDetection = config.enableChangeDetection !== false
    this.storageKeys = config.storageKeys || ['inscrits_data', 'user_data', 'form_data']
    this.retryDelay = config.retryDelay || 1000
  }

  init() {
    if (this.enableChangeDetection) {
      this.startChangeDetection()
    }
    
    if (this.enablePeriodicSync) {
      this.startPeriodicSync()
    }
    
    if (this.enableWindowEvents) {
      this.setupWindowEvents()
      this.setupBeforeUnload()
    }

    SyncLogger.log('autosave_init', { config: this.getConfig() })
    console.log('🚀 AutoSave Manager initialisé')
  }

  private getConfig() {
    return {
      saveInterval: this.saveInterval,
      changeDetectionInterval: this.changeDetectionInterval,
      maxRetries: this.maxRetries,
      enableWindowEvents: this.enableWindowEvents,
      enablePeriodicSync: this.enablePeriodicSync,
      enableChangeDetection: this.enableChangeDetection,
      storageKeys: this.storageKeys
    }
  }

  // Détection de changements par hachage
  private startChangeDetection() {
    const intervalId = setInterval(() => {
      if (!this.isEnabled || this.isSaving) return

      const currentHash = this.hashData(this.getCurrentData())
      if (this.lastDataHash && this.lastDataHash !== currentHash) {
        this.triggerSave('change_detected')
      }
      this.lastDataHash = currentHash
    }, this.changeDetectionInterval)

    this.intervalIds.push(intervalId)
  }

  // Synchronisation périodique
  private startPeriodicSync() {
    const intervalId = setInterval(() => {
      if (!this.isEnabled || this.isSaving) return

      if (this.hasDataToSync()) {
        this.triggerSave('periodic')
      }
    }, this.saveInterval)

    this.intervalIds.push(intervalId)
  }

  // Événements de fenêtre
  private setupWindowEvents() {
    window.addEventListener('focus', () => {
      if (this.isEnabled) {
        this.triggerDownload()
      }
    })
    
    window.addEventListener('blur', () => {
      if (this.isEnabled) {
        this.triggerSave('window_blur')
      }
    })
    
    document.addEventListener('visibilitychange', () => {
      if (!this.isEnabled) return

      if (document.hidden) {
        this.triggerSave('visibility_hidden')
      } else {
        this.triggerDownload()
      }
    })
  }

  // Sauvegarde avant fermeture
  private setupBeforeUnload() {
    window.addEventListener('beforeunload', async (event) => {
      if (this.hasDataToSync()) {
        // Tenter une sauvegarde synchrone rapide
        event.preventDefault()
        await this.forceSave()
      }
    })
  }

  private hashData(data: any): string {
    return btoa(JSON.stringify(data)).slice(0, 16)
  }

  private getCurrentData(): any {
    const data: any = {}
    this.storageKeys.forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          data[key] = JSON.parse(item)
        } catch {
          data[key] = item
        }
      }
    })
    return data
  }

  private hasDataToSync(): boolean {
    return this.storageKeys.some(key => {
      const item = localStorage.getItem(key)
      return item && item !== 'null' && item !== '[]' && item !== '{}'
    })
  }

  async triggerSave(reason: string) {
    if (this.isSaving || !this.isEnabled) return

    this.isSaving = true
    this.emitEvent({ type: 'save_start', data: { reason }, timestamp: new Date() })

    try {
      const result = await this.performSave()
      
      if (result.success) {
        this.emitEvent({ 
          type: 'save_success', 
          data: { reason, result }, 
          timestamp: new Date() 
        })
        SyncLogger.log('save_success', { reason, result })
      } else {
        throw new Error(result.error || 'Erreur de sauvegarde inconnue')
      }
    } catch (error: any) {
      this.emitEvent({ 
        type: 'save_error', 
        error: error.message, 
        data: { reason }, 
        timestamp: new Date() 
      })
      SyncLogger.log('save_error', { reason, error: error.message })
      
      // Tentative de récupération
      await ErrorRecoveryManager.handleSyncError(error)
    } finally {
      this.isSaving = false
    }
  }

  async triggerDownload() {
    if (this.isSaving || !this.isEnabled) return

    this.emitEvent({ type: 'sync_start', timestamp: new Date() })

    try {
      const result = await syncFromSupabase()
      
      if (result.success) {
        this.emitEvent({ 
          type: 'sync_success', 
          data: result, 
          timestamp: new Date() 
        })
        SyncLogger.log('sync_success', result)
        
        // Mettre à jour le hash après sync
        this.lastDataHash = this.hashData(this.getCurrentData())
      } else {
        throw new Error(result.error || 'Erreur de synchronisation inconnue')
      }
    } catch (error: any) {
      this.emitEvent({ 
        type: 'sync_error', 
        error: error.message, 
        timestamp: new Date() 
      })
      SyncLogger.log('sync_error', { error: error.message })
    }
  }

  private async performSave(): Promise<{ success: boolean; error?: string; result?: any }> {
    let retryCount = 0
    
    while (retryCount < this.maxRetries) {
      try {
        const result = await Promise.race([
          syncToSupabase(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), this.timeout)
          )
        ]) as any

        return { success: true, result }
      } catch (error: any) {
        retryCount++
        
        if (retryCount < this.maxRetries) {
          // Délai exponentiel
          const delay = this.retryDelay * Math.pow(2, retryCount - 1)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          return { success: false, error: error.message }
        }
      }
    }

    return { success: false, error: 'Max retries exceeded' }
  }

  async forceSave(): Promise<boolean> {
    if (!this.hasDataToSync()) return true

    try {
      const result = await syncToSupabase()
      return result.success || false
    } catch (error) {
      console.error('Force save failed:', error)
      return false
    }
  }

  // Gestion des listeners
  addListener(callback: (event: SyncEvent) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private emitEvent(event: SyncEvent) {
    this.listeners.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Erreur dans listener:', error)
      }
    })
  }

  // Contrôles publics
  enable() {
    this.isEnabled = true
    SyncLogger.log('autosave_enabled')
  }

  disable() {
    this.isEnabled = false
    SyncLogger.log('autosave_disabled')
  }

  async saveNow(): Promise<boolean> {
    await this.triggerSave('manual')
    return !this.isSaving
  }

  async syncNow(): Promise<boolean> {
    await this.triggerDownload()
    return true
  }

  getStatus() {
    return {
      enabled: this.isEnabled,
      saving: this.isSaving,
      hasData: this.hasDataToSync(),
      lastHash: this.lastDataHash
    }
  }

  cleanup() {
    this.intervalIds.forEach(id => clearInterval(id))
    this.intervalIds = []
    this.listeners.clear()
    SyncLogger.log('autosave_cleanup')
  }
}

// Instance globale
let globalAutoSave: AutoSaveManager | null = null

export function initAutoSave(config?: AutoSaveConfig): AutoSaveManager {
  if (globalAutoSave) {
    globalAutoSave.cleanup()
  }
  
  globalAutoSave = new AutoSaveManager(config)
  globalAutoSave.init()
  return globalAutoSave
}

export function getAutoSave(): AutoSaveManager {
  if (!globalAutoSave) {
    globalAutoSave = new AutoSaveManager()
    globalAutoSave.init()
  }
  return globalAutoSave
} 