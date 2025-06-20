export interface LogEntry {
  timestamp: string
  event: string
  data?: any
  userAgent?: string
  url?: string
  sessionId?: string
}

// Déclaration globale optionnelle pour Google Analytics
declare const gtag: (...args: any[]) => void

export class SyncLogger {
  private static maxLogs = 100
  private static sessionId = crypto.randomUUID()

  static log(event: string, data: any = {}) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId
    }
    
    // Stockage local des logs
    try {
      const logs = this.getLogs()
      logs.push(logEntry)
      
      // Garder seulement les derniers logs
      if (logs.length > this.maxLogs) {
        logs.splice(0, logs.length - this.maxLogs)
      }
      
      localStorage.setItem('sync_logs', JSON.stringify(logs))
    } catch (error) {
      console.warn('Impossible de sauvegarder les logs:', error)
    }
    
    // Log en console pour le debug
    console.log(`[AutoSync] ${event}:`, data)
    
    // Envoyer à un service d'analytics si configuré
    this.sendToAnalytics(logEntry)
  }
  
  static getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('sync_logs') || '[]')
    } catch {
      return []
    }
  }
  
  static clearLogs() {
    localStorage.removeItem('sync_logs')
  }
  
  static getLogsSummary() {
    const logs = this.getLogs()
    const summary = {
      total: logs.length,
      events: {} as Record<string, number>,
      errors: logs.filter(log => log.event.includes('error')).length,
      lastActivity: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
      sessionStart: logs.find(log => log.sessionId === this.sessionId)?.timestamp || null
    }
    
    // Compter les événements
    logs.forEach(log => {
      summary.events[log.event] = (summary.events[log.event] || 0) + 1
    })
    
    return summary
  }
  
  static exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2)
  }
  
  private static sendToAnalytics(logEntry: LogEntry) {
    // Envoyer à Google Analytics si disponible
    if (typeof gtag !== 'undefined') {
      gtag('event', 'supabase_sync', {
        event_category: 'AutoSync',
        event_label: logEntry.event,
        custom_map: {
          sync_data: JSON.stringify(logEntry.data)
        }
      })
    }
    
    // Envoyer à d'autres services d'analytics
    if ((window as any).analytics) {
      (window as any).analytics.track('Supabase Sync', {
        event: logEntry.event,
        data: logEntry.data,
        timestamp: logEntry.timestamp
      })
    }
    
    // Plausible Analytics si disponible
    if ((window as any).plausible) {
      (window as any).plausible('AutoSync', {
        props: {
          event: logEntry.event,
          success: !logEntry.event.includes('error')
        }
      })
    }
  }
  
  // Performance monitoring
  static startTimer(operation: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      this.log(`${operation}_duration`, { duration, unit: 'ms' })
    }
  }
  
  // Error tracking avec contexte
  static logError(error: Error, context: any = {}) {
    this.log('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context
    })
  }
  
  // Métriques de performance
  static logPerformance(metrics: {
    operation: string
    duration: number
    dataSize?: number
    recordCount?: number
  }) {
    this.log('performance', metrics)
  }
  
  // État de la connectivité
  static logConnectivity(isOnline: boolean, details?: any) {
    this.log('connectivity', { isOnline, details })
  }
  
  // Usage de localStorage
  static logStorageUsage() {
    if (typeof navigator !== 'undefined' && 'storage' in navigator) {
      navigator.storage.estimate().then(estimate => {
        this.log('storage_usage', {
          used: estimate.usage,
          quota: estimate.quota,
          percentage: estimate.quota ? (estimate.usage! / estimate.quota * 100).toFixed(2) : null
        })
      })
    }
  }
  
  // Debugging helpers
  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[AutoSync Debug] ${message}`, data)
      this.log('debug', { message, data })
    }
  }
  
  static warn(message: string, data?: any) {
    console.warn(`[AutoSync Warning] ${message}`, data)
    this.log('warning', { message, data })
  }
  
  // Health check du système
  static logHealthCheck() {
    const health = {
      localStorage: this.checkLocalStorage(),
      connectivity: navigator.onLine,
      memory: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    }
    
    this.log('health_check', health)
    return health
  }
  
  private static checkLocalStorage(): boolean {
    try {
      const testKey = '__ls_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
  
  private static getMemoryUsage(): any {
    if ('memory' in performance) {
      return {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      }
    }
    return null
  }
} 