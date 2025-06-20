import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X, Settings, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Afficher la bannière après un court délai
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    savePreferences(allAccepted)
  }

  const handleAcceptSelected = () => {
    savePreferences(preferences)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    savePreferences(onlyNecessary)
  }

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
    setShowPreferences(false)
    
    // Déclencher un événement personnalisé pour informer l'application
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }))
  }

  const handlePreferenceChange = (type: keyof typeof preferences, value: boolean) => {
    if (type === 'necessary') return // Les cookies nécessaires ne peuvent pas être désactivés
    setPreferences(prev => ({ ...prev, [type]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 flex items-start gap-4">
              <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nous utilisons des cookies 🍪
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, personnaliser le contenu
                  et analyser notre trafic. En cliquant sur "Accepter tout", vous consentez à notre utilisation des cookies.
                  <Link to="/cookies" className="text-blue-600 hover:underline ml-1">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Préférences
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="text-sm"
              >
                Refuser tout
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Accepter tout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de préférences */}
      {showPreferences && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Préférences de cookies</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Cookies nécessaires */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Cookies strictement nécessaires
                    </h3>
                    <p className="text-sm text-slate-600">
                      Ces cookies sont essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Toujours actif</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies fonctionnels */}
              <div className="space-y-3 pb-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Cookies fonctionnels
                    </h3>
                    <p className="text-sm text-slate-600">
                      Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du site.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.functional ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.functional ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="space-y-3 pb-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Cookies analytiques
                    </h3>
                    <p className="text-sm text-slate-600">
                      Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Cookies marketing
                    </h3>
                    <p className="text-sm text-slate-600">
                      Ces cookies peuvent être utilisés pour vous proposer du contenu marketing pertinent.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptSelected}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Enregistrer mes préférences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Accepter tout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 