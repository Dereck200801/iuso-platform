// Utilitaire pour gérer Google Analytics avec consentement

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

class Analytics {
  private isInitialized = false
  private hasConsent = false
  private queuedEvents: AnalyticsEvent[] = []

  // Vérifier si l'utilisateur a consenti aux cookies analytics
  private checkConsent(): boolean {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) return false
    
    try {
      const parsed = JSON.parse(consent)
      return parsed.preferences?.analytics === true
    } catch {
      return false
    }
  }

  // Initialiser Google Analytics
  initialize() {
    this.hasConsent = this.checkConsent()
    
    if (!this.hasConsent) {
      console.log('Analytics: Pas de consentement, Google Analytics non initialisé')
      return
    }

    // Vérifier si GA est déjà chargé
    if (typeof window !== 'undefined' && !(window as any).gtag) {
      // Charger le script Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`
      script.async = true
      document.head.appendChild(script);

      // Initialiser gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(arguments)
      }
      (window as any).gtag = gtag

      gtag('js', new Date())
      gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        anonymize_ip: true, // Anonymiser les IPs pour le RGPD
        cookie_flags: 'SameSite=None;Secure'
      })

      this.isInitialized = true
      console.log('Analytics: Google Analytics initialisé')

      // Traiter les événements en attente
      this.processQueuedEvents()
    }
  }

  // Traiter les événements en attente
  private processQueuedEvents() {
    while (this.queuedEvents.length > 0) {
      const event = this.queuedEvents.shift()
      if (event) {
        this.trackEvent(event)
      }
    }
  }

  // Suivre une page vue
  trackPageView(path?: string) {
    if (!this.hasConsent) return

    if (this.isInitialized && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path || window.location.pathname,
        page_title: document.title
      })
    }
  }

  // Suivre un événement
  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (!this.hasConsent) return

    if (this.isInitialized && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    } else {
      // Mettre en file d'attente si pas encore initialisé
      this.queuedEvents.push({ action, category, label, value })
    }
  }

  // Suivre les conversions (inscriptions, etc.)
  trackConversion(conversionLabel: string, value?: number) {
    if (!this.hasConsent) return

    if (this.isInitialized && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: `${import.meta.env.VITE_GA_MEASUREMENT_ID}/${conversionLabel}`,
        value: value || 0,
        currency: 'XAF' // Franc CFA
      })
    }
  }

  // Mettre à jour le consentement
  updateConsent(hasAnalyticsConsent: boolean) {
    this.hasConsent = hasAnalyticsConsent

    if (hasAnalyticsConsent && !this.isInitialized) {
      // Initialiser si consentement accordé
      this.initialize()
    } else if (!hasAnalyticsConsent && this.isInitialized) {
      // Désactiver si consentement révoqué
      if (typeof window !== 'undefined') {
        (window as any)[`ga-disable-${import.meta.env.VITE_GA_MEASUREMENT_ID}`] = true
      }
      this.isInitialized = false
      console.log('Analytics: Google Analytics désactivé')
    }
  }
}

// Instance singleton
export const analytics = new Analytics()

// Hooks et utilitaires pour React
export const useAnalytics = () => {
  return {
    trackEvent: (event: AnalyticsEvent) => analytics.trackEvent(event),
    trackPageView: (path?: string) => analytics.trackPageView(path),
    trackConversion: (label: string, value?: number) => analytics.trackConversion(label, value)
  }
}

// Événements prédéfinis pour l'IUSO
export const trackInscriptionStart = () => {
  analytics.trackEvent({
    action: 'inscription_start',
    category: 'engagement',
    label: 'Début du formulaire d\'inscription'
  })
}

export const trackInscriptionComplete = () => {
  analytics.trackEvent({
    action: 'inscription_complete',
    category: 'conversion',
    label: 'Inscription complétée avec succès'
  })
  analytics.trackConversion('inscription')
}

export const trackFormationView = (formationName: string) => {
  analytics.trackEvent({
    action: 'formation_view',
    category: 'engagement',
    label: formationName
  })
}

export const trackDocumentDownload = (documentName: string) => {
  analytics.trackEvent({
    action: 'document_download',
    category: 'engagement',
    label: documentName
  })
}

export const trackContactFormSubmit = () => {
  analytics.trackEvent({
    action: 'contact_form_submit',
    category: 'engagement',
    label: 'Formulaire de contact soumis'
  })
}

// Écouter les changements de consentement
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentUpdated', ((event: CustomEvent) => {
    analytics.updateConsent(event.detail.analytics)
  }) as EventListener)
} 