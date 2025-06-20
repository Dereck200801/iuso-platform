import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: { [key: string]: any }
  role?: 'candidat' | 'admin'
}

// Inscription d'un candidat
export const signUpCandidat = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'candidat'
      }
    }
  })
  
  if (error) throw error
  return data
}

// Connexion
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Déconnexion
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Récupérer l'utilisateur actuel
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Si l'erreur indique une session manquante, ce n'est pas grave
    if (error && error.message.includes('Auth session missing')) {
      return null
    }
    
    if (error) throw error
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      role: user.user_metadata?.role || 'candidat'
    }
  } catch (error: any) {
    // Si c'est juste une session manquante, retourner null sans erreur
    if (error.message?.includes('Auth session missing')) {
      return null
    }
    throw error
  }
}

// Vérifier si l'utilisateur est admin
export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'admin'
}

// Réinitialiser le mot de passe
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}

// Mettre à jour le mot de passe
export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

// Écouter les changements d'authentification
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (_, session) => {
    if (session?.user) {
      const user: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata,
        role: session.user.user_metadata?.role || 'candidat'
      }
      callback(user)
    } else {
      callback(null)
    }
  })
} 