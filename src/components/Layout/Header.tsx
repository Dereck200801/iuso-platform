import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Menu as MenuIcon, 
  X, 
  User, 
  LogOut, 
  Settings,
  Bell,
  ChevronDown,
  Sparkles,
  Home,
  FileText,
  BarChart3,
  Info,
  Phone,
  HelpCircle,
  LogIn
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/auth'
import { IUSO_INFO } from '../../lib/constants'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// Import du logo IUSO
import iusoLogo from '../../assets/logo-iuso.png'
import { useCandidatData } from '@/hooks/useCandidatData'
import { supabase } from '@/lib/supabase'
import React from 'react'

interface HeaderProps {
  onMenuClick?: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: candidat } = useCandidatData()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Déconnexion réussie')
      navigate('/')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  // Navigation centrale pour tous les visiteurs (style vitrine)
  const centralNavItems = [
    { label: 'Accueil', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'Formations', href: '/formations', icon: <FileText className="h-4 w-4" /> },
    { label: 'À propos', href: '/about', icon: <Info className="h-4 w-4" /> },
    { label: 'Contact', href: '/contact', icon: <Phone className="h-4 w-4" /> },
    { label: 'FAQ', href: '/faq', icon: <HelpCircle className="h-4 w-4" /> }
  ]

  // Navigation mobile spécifique selon le rôle
  const candidatMobileItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Mon Profil', href: '/dashboard?tab=profil', icon: <User className="h-4 w-4" /> },
    { label: 'Mes Documents', href: '/dashboard?tab=documents', icon: <FileText className="h-4 w-4" /> },
    { label: 'Messages', href: '/dashboard?tab=messages', icon: <Bell className="h-4 w-4" /> }
  ]

  const adminMobileItems = [
    { label: 'Administration', href: '/admin', icon: <Settings className="h-4 w-4" /> },
    { label: 'Dossiers', href: '/admin/dossiers', icon: <FileText className="h-4 w-4" /> },
    { label: 'Messages', href: '/admin/messages', icon: <Bell className="h-4 w-4" /> },
    { label: 'Statistiques', href: '/admin/stats', icon: <BarChart3 className="h-4 w-4" /> }
  ]

  const getMobileNavItems = () => {
    if (!user) return centralNavItems
    if (isAdmin) return [...centralNavItems, ...adminMobileItems]
    return [...centralNavItems, ...candidatMobileItems]
  }

  const getInitials = (email: string | undefined) => {
    return email?.charAt(0).toUpperCase() || 'U'
  }

  // Générer l'URL publique de la photo d'identité si disponible
  const avatarUrl = React.useMemo(() => {
    if (candidat?.photo) {
      try {
        const { data } = supabase.storage
          .from('pieces-candidats')
          .getPublicUrl(candidat.photo)
        return data.publicUrl || undefined
      } catch {
        return undefined
      }
    }
    return undefined
  }, [candidat?.photo])

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo IUSO officiel */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-slate-100 transition-colors duration-200"
                onClick={onMenuClick}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            )}
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src={iusoLogo} 
                  alt="Logo IUSO" 
                  className="h-10 w-auto object-contain sm:h-12 md:h-14 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-gilroy group-hover:text-blue-600 transition-colors duration-200">
                  {IUSO_INFO.name}
                </div>
                <div className="text-sm text-slate-500 font-medium hidden md:block">
                  Plateforme de candidatures
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation centrale (style vitrine) */}
          <nav className="hidden lg:flex items-center gap-1">
            {centralNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-gilroy transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Enhanced User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Enhanced Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5 text-slate-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </Button>

                {/* Admin Access Button - only for admins */}
                {isAdmin && (
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 font-gilroy font-medium"
                  >
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}

                {/* Enhanced User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-slate-50/80 hover:shadow-sm rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200/60">
                      <Avatar className="h-8 w-8 ring-2 ring-slate-200/60 transition-all duration-200 hover:ring-blue-300/60">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={user.email || 'avatar'} />}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-gilroy font-medium">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-slate-500 hidden md:block transition-transform duration-200 group-hover:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt={user.email || 'avatar'} />}
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-gilroy">
                              {getInitials(user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-none font-gilroy text-slate-900 truncate">{user.email}</p>
                            <p className="text-xs leading-none text-slate-500 mt-1">
                              {isAdmin ? 'Administrateur' : 'Candidat'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="h-4 w-4" />
                      <span>Mon Profil</span>
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <BarChart3 className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-gilroy font-medium"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/inscription">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/50 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {getMobileNavItems().map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-gilroy transition-all duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 