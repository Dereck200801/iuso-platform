import { useState, useEffect } from 'react'

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsent {
  preferences: CookiePreferences
  timestamp: string
}

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Charger les préférences depuis le localStorage
    const storedConsent = localStorage.getItem('cookie-consent')
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent)
        setConsent(parsed)
      } catch (error) {
        console.error('Erreur lors du parsing des préférences de cookies:', error)
      }
    }
    setIsLoading(false)

    // Écouter les changements de préférences
    const handleConsentUpdate = (event: CustomEvent) => {
      const newConsent: CookieConsent = {
        preferences: event.detail,
        timestamp: new Date().toISOString()
      }
      setConsent(newConsent)
      
      // Appliquer les préférences
      applyPreferences(event.detail)
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    }
  }, [])

  const applyPreferences = (preferences: CookiePreferences) => {
    // Désactiver Google Analytics si non consenti
    if (!preferences.analytics && typeof window !== 'undefined') {
      // Désactiver Google Analytics
      (window as any)[`ga-disable-${process.env.VITE_GA_MEASUREMENT_ID}`] = true
      
      // Supprimer les cookies Google Analytics existants
      document.cookie.split(";").forEach((c) => {
        const cookie = c.trim()
        if (cookie.startsWith('_ga') || cookie.startsWith('_gid')) {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
        }
      })
    }

    // Désactiver les cookies fonctionnels si non consenti
    if (!preferences.functional) {
      // Supprimer les préférences utilisateur stockées
      const functionalKeys = ['theme-preference', 'language-preference', 'form-autosave']
      functionalKeys.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    }

    // Désactiver les cookies marketing si non consenti
    if (!preferences.marketing) {
      // Ici on pourrait désactiver les pixels de tracking, etc.
    }
  }

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    if (!consent) return

    const updatedPreferences = {
      ...consent.preferences,
      ...newPreferences
    }

    const newConsent: CookieConsent = {
      preferences: updatedPreferences,
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('cookie-consent', JSON.stringify(newConsent))
    setConsent(newConsent)
    applyPreferences(updatedPreferences)

    // Déclencher l'événement pour synchroniser avec la bannière
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: updatedPreferences }))
  }

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    if (!consent) return false
    return consent.preferences[type]
  }

  const revokeConsent = () => {
    localStorage.removeItem('cookie-consent')
    setConsent(null)
    
    // Recharger la page pour réinitialiser tout
    window.location.reload()
  }

  return {
    consent,
    isLoading,
    hasConsent,
    updatePreferences,
    revokeConsent,
    hasAnalyticsConsent: hasConsent('analytics'),
    hasFunctionalConsent: hasConsent('functional'),
    hasMarketingConsent: hasConsent('marketing')
  }
} 