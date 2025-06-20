import { useState, useEffect, createContext, useContext } from 'react'
import { type AuthUser, getCurrentUser, onAuthStateChange } from '../lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur initial
    getCurrentUser()
      .then(setUser)
      .catch((error) => {
        // Ne pas logger les erreurs de session manquante
        if (!error.message?.includes('Auth session missing')) {
          console.error('Auth error:', error)
        }
        setUser(null)
      })
      .finally(() => setLoading(false))

    // Écouter les changements d'authentification
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    isAdmin: user?.role === 'admin'
  }
} 