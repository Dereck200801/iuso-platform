import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Toaster } from './components/ui/toast'
import ScrollToTop from './components/ScrollToTop'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import InscriptionPage from './pages/InscriptionPage'
import DashboardPage from './pages/DashboardPage'
import FormationsPage from './pages/FormationsPage'
import ConfirmationPage from './pages/ConfirmationPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import AdminPage from './pages/admin/AdminPage'
import AdminDossiersPage from './pages/admin/AdminDossiersPage'
import AdminMessagingPage from './pages/admin/AdminMessagingPage'

// AutoSync System
import { initAutoSave } from './utils/autoSave'
import { SyncLogger } from './utils/syncLogger'

import './App.css'

function App() {
  useEffect(() => {
    // Initialiser le système d'automatisation Supabase
    console.log('🚀 Initialisation du système AutoSync...')
    
    try {
      // Configuration du système d'automatisation
      const autoSave = initAutoSave({
        saveInterval: 30000,            // Sauvegarde toutes les 30 secondes
        changeDetectionInterval: 10000, // Détection de changements toutes les 10 secondes
        maxRetries: 3,                  // 3 tentatives maximum
        timeout: 30000,                 // Timeout de 30 secondes
        enableWindowEvents: true,       // Écouter les événements de fenêtre
        enablePeriodicSync: true,       // Synchronisation périodique
        enableChangeDetection: true,    // Détection de changements
        storageKeys: [                  // Clés localStorage à surveiller
          'inscrits_data',
          'user_data', 
          'form_data',
          'messages_data'
        ],
        retryDelay: 1000               // Délai initial entre tentatives
      })

      // Rendre accessible globalement pour le debugging
      ;(window as any).autoSaveManager = autoSave
      
      // Log de démarrage
      SyncLogger.log('app_init', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })

      // Health check initial
      SyncLogger.logHealthCheck()
      
      console.log('✅ Système AutoSync initialisé avec succès')
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du système AutoSync:', error)
      SyncLogger.logError(error as Error, { context: 'app_init' })
    }

    // Nettoyage à la fermeture
    return () => {
      if ((window as any).autoSaveManager) {
        (window as any).autoSaveManager.cleanup()
        console.log('🧹 Système AutoSync nettoyé')
      }
    }
  }, [])

  // Gestion des erreurs non capturées
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Erreur non gérée:', event.reason)
      SyncLogger.logError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'), 
        { context: 'unhandled_rejection', reason: event.reason }
      )
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Erreur globale:', event.error)
      SyncLogger.logError(event.error, { 
        context: 'global_error',
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  // Monitoring de la connectivité
  useEffect(() => {
    const handleOnline = () => {
      SyncLogger.logConnectivity(true, { event: 'online' })
      console.log('🌐 Connexion réseau rétablie')
    }

    const handleOffline = () => {
      SyncLogger.logConnectivity(false, { event: 'offline' })
      console.log('📡 Connexion réseau perdue')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Log de l'état initial
    SyncLogger.logConnectivity(navigator.onLine, { event: 'initial' })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AuthProvider>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Routes admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dossiers"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDossiersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMessagingPage />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </Layout>
    </AuthProvider>
  )
}

export default App
