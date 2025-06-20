import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCookieConsent } from '@/hooks/useCookieConsent'

export const CookieSettingsButton = () => {
  const { consent } = useCookieConsent()

  // Ne pas afficher le bouton si aucun consentement n'a été donné
  if (!consent) return null

  const handleClick = () => {
    // Supprimer le consentement pour forcer l'affichage de la bannière
    localStorage.removeItem('cookie-consent')
    window.location.reload()
  }

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-40 rounded-full shadow-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
      size="icon"
      title="Paramètres des cookies"
    >
      <Cookie className="h-5 w-5" />
    </Button>
  )
} 