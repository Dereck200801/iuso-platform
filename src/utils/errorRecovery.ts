import { syncFromSupabase, syncToSupabase, checkConnectivity } from './supabaseSync'
import { SyncLogger } from './syncLogger'

export interface RecoveryResult {
  success: boolean
  message: string
  error?: string
  strategy?: string
}

export class ErrorRecoveryManager {
  private static retryCount = 0
  private static maxRetries = 5
  private static recoveryInProgress = false

  static async handleSyncError(error: any, retryCount = 0): Promise<RecoveryResult> {
    if (this.recoveryInProgress) {
      return { success: false, message: 'Recovery déjà en cours' }
    }

    this.recoveryInProgress = true
    SyncLogger.log('recovery_start', { error: error.message, retryCount })

    try {
      const strategies = [
        () => this.retryWithDelay(1000 * (retryCount + 1)),
        () => this.checkAndReconnect(),
        () => this.clearCacheAndRetry(),
        () => this.partialSyncFallback(),
        () => this.enableDegradedMode()
      ]
      
      if (retryCount < strategies.length) {
        const result = await strategies[retryCount]()
        SyncLogger.log('recovery_attempt', { strategy: retryCount, result })
        return result
      }
      
      // Dernier recours: mode dégradé
      return await this.enableDegradedMode()
    } catch (recoveryError: any) {
      SyncLogger.logError(recoveryError, { originalError: error.message })
      return { 
        success: false, 
        message: 'Échec de la récupération', 
        error: recoveryError.message 
      }
    } finally {
      this.recoveryInProgress = false
    }
  }

  private static async retryWithDelay(delay: number): Promise<RecoveryResult> {
    await new Promise(resolve => setTimeout(resolve, delay))
    
    try {
      const isOnline = await checkConnectivity()
      if (!isOnline) {
        throw new Error('Pas de connectivité')
      }

      const result = await syncToSupabase()
      if (result.success) {
        return { 
          success: true, 
          message: 'Récupération réussie par retry', 
          strategy: 'retry' 
        }
      }
      
      throw new Error(result.error || 'Retry échoué')
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Retry échoué', 
        error: error.message,
        strategy: 'retry' 
      }
    }
  }

  private static async checkAndReconnect(): Promise<RecoveryResult> {
    try {
      // Vérifier la connectivité réseau
      if (!navigator.onLine) {
        return { 
          success: false, 
          message: 'Pas de connexion réseau',
          strategy: 'reconnect' 
        }
      }

      // Tester la connexion Supabase
      const isConnected = await checkConnectivity()
      if (!isConnected) {
        // Tenter de rafraîchir la session
        const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession()
        
        if (!session) {
          return { 
            success: false, 
            message: 'Session expirée', 
            strategy: 'reconnect' 
          }
        }
      }

      // Tenter une nouvelle synchronisation
      const result = await syncToSupabase()
      return { 
        success: result.success, 
        message: result.success ? 'Reconnexion réussie' : 'Reconnexion échouée',
        error: result.error,
        strategy: 'reconnect' 
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Échec de reconnexion', 
        error: error.message,
        strategy: 'reconnect' 
      }
    }
  }

  private static async clearCacheAndRetry(): Promise<RecoveryResult> {
    try {
      // Sauvegarder les données critiques avant nettoyage
      const criticalData = this.extractCriticalData()
      
      // Nettoyer les caches corrompus
      const keysToClean = ['sync_logs', 'last_sync_time', 'has_unsynced_changes']
      keysToClean.forEach(key => localStorage.removeItem(key))
      
      // Tenter une nouvelle synchronisation
      const result = await syncFromSupabase({ forceCleanup: true })
      
      if (result.success) {
        // Réintégrer les données critiques si nécessaire
        await this.mergeCriticalData(criticalData)
        
        return { 
          success: true, 
          message: 'Cache nettoyé et resynchronisation réussie',
          strategy: 'cache_clear' 
        }
      }
      
      throw new Error(result.error || 'Resync après nettoyage échoué')
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Échec du nettoyage de cache', 
        error: error.message,
        strategy: 'cache_clear' 
      }
    }
  }

  private static async partialSyncFallback(): Promise<RecoveryResult> {
    try {
      // Tenter de synchroniser seulement les données essentielles
      const essentialKeys = ['inscrits_data']
      let successCount = 0
      
      for (const key of essentialKeys) {
        try {
          const result = await syncToSupabase({ storageKey: key })
          if (result.success) {
            successCount++
          }
        } catch (error) {
          SyncLogger.warn(`Échec sync partielle pour ${key}`, error)
        }
      }
      
      if (successCount > 0) {
        return { 
          success: true, 
          message: `Synchronisation partielle réussie (${successCount}/${essentialKeys.length})`,
          strategy: 'partial_sync' 
        }
      }
      
      throw new Error('Aucune synchronisation partielle réussie')
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Échec de la synchronisation partielle', 
        error: error.message,
        strategy: 'partial_sync' 
      }
    }
  }

  private static async enableDegradedMode(): Promise<RecoveryResult> {
    try {
      // Marquer le mode dégradé
      localStorage.setItem('degraded_mode', 'true')
      localStorage.setItem('degraded_mode_timestamp', new Date().toISOString())
      
      // Désactiver la synchronisation automatique temporairement
      localStorage.setItem('auto_sync_disabled', 'true')
      
      // Programmer une tentative de récupération dans 5 minutes
      setTimeout(() => {
        this.attemptRecoveryFromDegradedMode()
      }, 5 * 60 * 1000)
      
      SyncLogger.log('degraded_mode_enabled', { 
        reason: 'Échec de toutes les stratégies de récupération'
      })
      
      return { 
        success: true, 
        message: 'Mode dégradé activé - tentative de récupération programmée',
        strategy: 'degraded_mode' 
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Impossible d\'activer le mode dégradé', 
        error: error.message,
        strategy: 'degraded_mode' 
      }
    }
  }

  private static async attemptRecoveryFromDegradedMode() {
    if (localStorage.getItem('degraded_mode') !== 'true') return

    try {
      const isOnline = await checkConnectivity()
      if (!isOnline) {
        // Reprogrammer la tentative
        setTimeout(() => this.attemptRecoveryFromDegradedMode(), 5 * 60 * 1000)
        return
      }

      // Tenter une synchronisation complète
      const result = await syncFromSupabase()
      if (result.success) {
        // Sortir du mode dégradé
        localStorage.removeItem('degraded_mode')
        localStorage.removeItem('degraded_mode_timestamp')
        localStorage.removeItem('auto_sync_disabled')
        
        SyncLogger.log('degraded_mode_recovery', { success: true })
        
        // Redémarrer l'autosave si disponible
        if ((window as any).autoSaveManager) {
          (window as any).autoSaveManager.enable()
        }
      } else {
        // Reprogrammer une nouvelle tentative
        setTimeout(() => this.attemptRecoveryFromDegradedMode(), 10 * 60 * 1000)
      }
    } catch (error) {
      SyncLogger.logError(error as Error, { context: 'degraded_mode_recovery' })
      // Reprogrammer une nouvelle tentative
      setTimeout(() => this.attemptRecoveryFromDegradedMode(), 10 * 60 * 1000)
    }
  }

  static async emergencyRecovery(): Promise<RecoveryResult> {
    try {
      SyncLogger.log('emergency_recovery_start')
      
      // 1. Sauvegarder les données critiques
      const criticalData = this.extractCriticalData()
      
      // 2. Nettoyer l'état corrompu
      const keysToPreserve = ['auth_token', 'user_session']
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (!keysToPreserve.includes(key)) {
          localStorage.removeItem(key)
        }
      })
      
      // 3. Restaurer depuis Supabase
      const result = await syncFromSupabase({ forceCleanup: true })
      
      if (!result.success) {
        throw new Error(result.error || 'Échec de restauration depuis Supabase')
      }
      
      // 4. Réintégrer les données critiques
      await this.mergeCriticalData(criticalData)
      
      SyncLogger.log('emergency_recovery_success', { 
        restoredCount: result.count 
      })
      
      return { 
        success: true, 
        message: `Recovery d'urgence réussi - ${result.count} enregistrements restaurés`,
        strategy: 'emergency' 
      }
    } catch (error: any) {
      SyncLogger.logError(error, { context: 'emergency_recovery' })
      return { 
        success: false, 
        message: 'Échec du recovery d\'urgence', 
        error: error.message,
        strategy: 'emergency' 
      }
    }
  }

  private static extractCriticalData(): any {
    const critical: any = {}
    
    try {
      // Données d'authentification
      const session = localStorage.getItem('supabase.auth.token')
      if (session) critical.auth_session = session
      
      // Données utilisateur en cours
      const currentUser = localStorage.getItem('current_user')
      if (currentUser) critical.current_user = currentUser
      
      // Formulaires en cours
      const formData = localStorage.getItem('form_data')
      if (formData) critical.form_data = formData
      
    } catch (error) {
      SyncLogger.warn('Erreur lors de l\'extraction des données critiques', error)
    }
    
    return critical
  }

  private static async mergeCriticalData(criticalData: any): Promise<void> {
    try {
      Object.entries(criticalData).forEach(([key, value]) => {
        if (value) {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        }
      })
    } catch (error) {
      SyncLogger.warn('Erreur lors de la fusion des données critiques', error)
    }
  }

  static isDegradedMode(): boolean {
    return localStorage.getItem('degraded_mode') === 'true'
  }

  static getDegradedModeInfo() {
    const timestamp = localStorage.getItem('degraded_mode_timestamp')
    return {
      enabled: this.isDegradedMode(),
      since: timestamp ? new Date(timestamp) : null,
      duration: timestamp ? Date.now() - new Date(timestamp).getTime() : 0
    }
  }

  static async forceRecovery(): Promise<RecoveryResult> {
    this.recoveryInProgress = false // Reset l'état
    return await this.emergencyRecovery()
  }
} 