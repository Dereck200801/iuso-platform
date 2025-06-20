import { useState, useEffect, useCallback } from 'react'
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

export function useAutoSync(): AutoSyncStatus & AutoSyncControls {
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
    const autoSave = getAutoSave()
    
    // S'abonner aux événements
    const unsubscribe = autoSave.addListener(handleSyncEvent)
    
    // Vérification initiale du statut
    const initialStatus = autoSave.getStatus()
    updateStatus({
      enabled: initialStatus.enabled,
      saving: initialStatus.saving
    })
    
    // Vérification initiale de connectivité
    checkConnectionStatus()
    
    // Vérification périodique (toutes les 30 secondes)
    const intervalId = setInterval(checkConnectionStatus, 30000)
    
    // Écouter les changements de connectivité réseau
    const handleOnline = () => updateStatus({ connected: true })
    const handleOffline = () => updateStatus({ connected: false })
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      unsubscribe()
      clearInterval(intervalId)
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
    const autoSave = getAutoSave()
    autoSave.enable()
    updateStatus({ enabled: true })
    SyncLogger.log('autosync_enabled_by_user')
  }, [updateStatus])

  const disable = useCallback(() => {
    const autoSave = getAutoSave()
    autoSave.disable()
    updateStatus({ enabled: false })
    SyncLogger.log('autosync_disabled_by_user')
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

  return {
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
}

// Hook simplifié pour le statut seulement
export function useAutoSyncStatus(): AutoSyncStatus {
  const fullHook = useAutoSync()
  
  return {
    enabled: fullHook.enabled,
    saving: fullHook.saving,
    syncing: fullHook.syncing,
    lastSave: fullHook.lastSave,
    lastSync: fullHook.lastSync,
    error: fullHook.error,
    connected: fullHook.connected,
    dataCount: fullHook.dataCount,
    hasUnsyncedData: fullHook.hasUnsyncedData,
    degradedMode: fullHook.degradedMode
  }
}

// Hook pour les contrôles seulement
export function useAutoSyncControls(): AutoSyncControls {
  const fullHook = useAutoSync()
  
  return {
    saveNow: fullHook.saveNow,
    syncNow: fullHook.syncNow,
    enable: fullHook.enable,
    disable: fullHook.disable,
    forceRecovery: fullHook.forceRecovery,
    clearError: fullHook.clearError,
    getStats: fullHook.getStats,
    exportLogs: fullHook.exportLogs
  }
} 