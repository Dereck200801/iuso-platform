import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from './ui/spinner'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  requireAuth?: boolean
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si les droits admin sont requis mais l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // Si l'utilisateur est connecté mais essaie d'accéder aux pages publiques
  if (!requireAuth && user) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
} 