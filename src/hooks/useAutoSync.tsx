import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { getAutoSave } from '../utils/autoSave'
import { getSyncStats, checkConnectivity } from '../utils/supabaseSync'
import { ErrorRecoveryManager } from '../utils/errorRecovery'
import { SyncLogger } from '../utils/syncLogger'

// Définir le type SyncEvent localement pour éviter les imports circulaires
interface SyncEvent {
  type: 'save_start' | 'save_success' | 'save_error' | 'sync_start' | 'sync_success' | 'sync_error'
  data?: any
  error?: string
  timestamp: Date
}

export interface AutoSyncStatus {
  enabled: boolean
  saving: boolean
  syncing: boolean
  lastSave: Date | null
  lastSync: Date | null
  error: string | null
  connected: boolean
  dataCount: number
  hasUnsyncedData: boolean
  degradedMode: boolean
}

export interface AutoSyncControls {
  saveNow: () => Promise<boolean>
  syncNow: () => Promise<boolean>
  enable: () => void
  disable: () => void
  forceRecovery: () => Promise<void>
  clearError: () => void
  getStats: () => ReturnType<typeof getSyncStats>
  exportLogs: () => string
}

interface AutoSyncContextType extends AutoSyncStatus, AutoSyncControls {}

const AutoSyncContext = createContext<AutoSyncContextType | undefined>(undefined)

// Provider Component
export function AutoSyncProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AutoSyncStatus>({
    enabled: true,
    saving: false,
    syncing: false,
    lastSave: null,
    lastSync: null,
    error: null,
    connected: true,
    dataCount: 0,
    hasUnsyncedData: false,
    degradedMode: false
  })

  // Mise à jour du statut
  const updateStatus = useCallback((updates: Partial<AutoSyncStatus>) => {
    setStatus(prev => ({ ...prev, ...updates }))
  }, [])

  // Gestionnaire d'événements de synchronisation
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    switch (event.type) {
      case 'save_start':
        updateStatus({ saving: true, error: null })
        break
        
      case 'save_success':
        updateStatus({ 
          saving: false, 
          lastSave: event.timestamp,
          error: null
        })
        break
        
      case 'save_error':
        updateStatus({ 
          saving: false, 
          error: event.error || 'Erreur de sauvegarde'
        })
        break
        
      case 'sync_start':
        updateStatus({ syncing: true, error: null })
        break
        
      case 'sync_success':
        updateStatus({ 
          syncing: false, 
          lastSync: event.timestamp,
          error: null,
          dataCount: event.data?.count || 0
        })
        break
        
      case 'sync_error':
        updateStatus({ 
          syncing: false, 
          error: event.error || 'Erreur de synchronisation'
        })
        break
    }
  }, [updateStatus])

  // Vérification périodique de la connectivité
  const checkConnectionStatus = useCallback(async () => {
    try {
      const connected = await checkConnectivity()
      const stats = getSyncStats()
      const degradedMode = ErrorRecoveryManager.isDegradedMode()
      
      updateStatus({
        connected,
        dataCount: stats.dataCount,
        hasUnsyncedData: stats.hasUnsyncedData,
        degradedMode
      })
    } catch (error) {
      updateStatus({ connected: false })
    }
  }, [updateStatus])

  // Initialisation et nettoyage
  useEffect(() => {
    let autoSave: any = null
    let unsubscribe: (() => void) | null = null
    let intervalId: NodeJS.Timeout | null = null

    try {
      autoSave = getAutoSave()
      
      // S'abonner aux événements
      unsubscribe = autoSave.addListener(handleSyncEvent)
      
      // Vérification initiale du statut
      const initialStatus = autoSave.getStatus()
      updateStatus({
        enabled: initialStatus.enabled,
        saving: initialStatus.saving
      })
      
      // Vérification initiale de connectivité
      checkConnectionStatus()
      
      // Vérification périodique (toutes les 30 secondes)
      intervalId = setInterval(checkConnectionStatus, 30000)
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation AutoSync:', error)
      updateStatus({ error: 'Erreur d\'initialisation' })
    }

    // Écouter les changements de connectivité réseau
    const handleOnline = () => updateStatus({ connected: true })
    const handleOffline = () => updateStatus({ connected: false })
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      if (unsubscribe) unsubscribe()
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleSyncEvent, checkConnectionStatus, updateStatus])

  // Contrôles publics
  const saveNow = useCallback(async (): Promise<boolean> => {
    try {
      const autoSave = getAutoSave()
      const result = await autoSave.saveNow()
      
      if (result) {
        SyncLogger.log('manual_save_success')
      } else {
        SyncLogger.log('manual_save_failed')
      }
      
      return result
    } catch (error) {
      SyncLogger.logError(error as Error, { context: 'manual_save' })
      return false
    }
  }, [])

  const syncNow = useCallback(async (): Promise<boolean> => {
    try {
      const autoSave = getAutoSave()
      const result = await autoSave.syncNow()
      
      if (result) {
        SyncLogger.log('manual_sync_success')
        // Recharger les stats après sync
        await checkConnectionStatus()
      } else {
        SyncLogger.log('manual_sync_failed')
      }
      
      return result
    } catch (error) {
      SyncLogger.logError(error as Error, { context: 'manual_sync' })
      return false
    }
  }, [checkConnectionStatus])

  const enable = useCallback(() => {
    try {
      const autoSave = getAutoSave()
      autoSave.enable()
      updateStatus({ enabled: true })
      SyncLogger.log('autosync_enabled_by_user')
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error)
    }
  }, [updateStatus])

  const disable = useCallback(() => {
    try {
      const autoSave = getAutoSave()
      autoSave.disable()
      updateStatus({ enabled: false })
      SyncLogger.log('autosync_disabled_by_user')
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error)
    }
  }, [updateStatus])

  const forceRecovery = useCallback(async () => {
    try {
      updateStatus({ error: null })
      const result = await ErrorRecoveryManager.forceRecovery()
      
      if (result.success) {
        updateStatus({ error: null, degradedMode: false })
        await checkConnectionStatus()
        SyncLogger.log('force_recovery_success', result)
      } else {
        updateStatus({ error: result.error || 'Échec du recovery' })
        SyncLogger.log('force_recovery_failed', result)
      }
    } catch (error) {
      const errorMessage = (error as Error).message
      updateStatus({ error: errorMessage })
      SyncLogger.logError(error as Error, { context: 'force_recovery' })
    }
  }, [updateStatus, checkConnectionStatus])

  const clearError = useCallback(() => {
    updateStatus({ error: null })
  }, [updateStatus])

  const getStats = useCallback(() => {
    return getSyncStats()
  }, [])

  const exportLogs = useCallback(() => {
    return SyncLogger.exportLogs()
  }, [])

  const contextValue: AutoSyncContextType = {
    // Status
    enabled: status.enabled,
    saving: status.saving,
    syncing: status.syncing,
    lastSave: status.lastSave,
    lastSync: status.lastSync,
    error: status.error,
    connected: status.connected,
    dataCount: status.dataCount,
    hasUnsyncedData: status.hasUnsyncedData,
    degradedMode: status.degradedMode,
    
    // Controls
    saveNow,
    syncNow,
    enable,
    disable,
    forceRecovery,
    clearError,
    getStats,
    exportLogs
  }

  return (
    <AutoSyncContext.Provider value={contextValue}>
      {children}
    </AutoSyncContext.Provider>
  )
}

// Hook principal
export function useAutoSync(): AutoSyncContextType {
  const context = useContext(AutoSyncContext)
  
  if (context === undefined) {
    throw new Error('useAutoSync must be used within an AutoSyncProvider')
  }
  
  return context
}

// Hook simplifié pour le statut seulement
export function useAutoSyncStatus(): AutoSyncStatus {
  const context = useAutoSync()
  
  return {
    enabled: context.enabled,
    saving: context.saving,
    syncing: context.syncing,
    lastSave: context.lastSave,
    lastSync: context.lastSync,
    error: context.error,
    connected: context.connected,
    dataCount: context.dataCount,
    hasUnsyncedData: context.hasUnsyncedData,
    degradedMode: context.degradedMode
  }
}

// Hook pour les contrôles seulement
export function useAutoSyncControls(): AutoSyncControls {
  const context = useAutoSync()
  
  return {
    saveNow: context.saveNow,
    syncNow: context.syncNow,
    enable: context.enable,
    disable: context.disable,
    forceRecovery: context.forceRecovery,
    clearError: context.clearError,
    getStats: context.getStats,
    exportLogs: context.exportLogs
  }
} 