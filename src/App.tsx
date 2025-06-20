import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { CandidatDataProvider } from './hooks/useCandidatData'
import { AutoSyncProvider } from './hooks/useAutoSync'
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
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import LegalPage from './pages/LegalPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'


// AutoSync System
import { initAutoSave } from './utils/autoSave'
import { SyncLogger } from './utils/syncLogger'

// Analytics
import { analytics } from './utils/analytics'

import './App.css'

// Composants wrapper pour les pages avec footer simplifié
const LoginPageWrapper = () => (
  <Layout simpleFooter={true}>
    <LoginPage />
  </Layout>
)

const InscriptionPageWrapper = () => (
  <Layout simpleFooter={true}>
    <InscriptionPage />
  </Layout>
)

const ConfirmationPageWrapper = () => (
  <Layout simpleFooter={true}>
    <ConfirmationPage />
  </Layout>
)

function App() {
  const location = useLocation()

  // Initialiser Google Analytics
  useEffect(() => {
    analytics.initialize()
  }, [])

  // Suivre les changements de page
  useEffect(() => {
    analytics.trackPageView(location.pathname)
  }, [location])

  useEffect(() => {
    // ⚠️ SYSTÈME AUTOSYNC TEMPORAIREMENT DÉSACTIVÉ
    // Pour résoudre le problème de récréation automatique de données de test
    console.log('⚠️ Système AutoSync désactivé pour éviter la récréation automatique de données')
    
    // TODO: Réactiver après résolution complète du problème
    // et configuration de filtres pour exclure les données de test
    
    /*
    // Code AutoSync désactivé temporairement
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
    */
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
      <CandidatDataProvider>
        <AutoSyncProvider>
          <ScrollToTop />
          <Routes>
        {/* Pages avec footer simplifié */}
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/inscription" element={<InscriptionPageWrapper />} />
        <Route path="/confirmation" element={<ConfirmationPageWrapper />} />

        {/* Pages avec footer complet */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/formations" element={
          <Layout>
            <FormationsPage />
          </Layout>
        } />
        <Route path="/verify-email" element={
          <Layout>
            <EmailVerificationPage />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <ContactPage />
          </Layout>
        } />
        <Route path="/faq" element={
          <Layout>
            <FAQPage />
          </Layout>
        } />

        {/* Pages légales */}
        <Route path="/legal" element={
          <Layout>
            <LegalPage />
          </Layout>
        } />
        <Route path="/privacy" element={
          <Layout>
            <PrivacyPolicyPage />
          </Layout>
        } />
        <Route path="/terms" element={
          <Layout>
            <TermsPage />
          </Layout>
        } />
        <Route path="/cookies" element={
          <Layout>
            <CookiesPage />
          </Layout>
        } />

        {/* Routes protégées - Dashboard sans Layout car il a son propre layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Routes supprimées - Fonctionnalités intégrées dans le dashboard */}
        <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
        <Route path="/documents" element={<Navigate to="/dashboard" replace />} />
        <Route path="/messages" element={<Navigate to="/dashboard" replace />} />

        {/* Routes admin */}
        <Route
          path="/admin"
          element={
            <Layout>
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/dossiers"
          element={
            <Layout>
              <ProtectedRoute requireAdmin>
                <AdminDossiersPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <Layout>
              <ProtectedRoute requireAdmin>
                <AdminMessagingPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster />
        </AutoSyncProvider>
      </CandidatDataProvider>
    </AuthProvider>
  )
}

export default App
