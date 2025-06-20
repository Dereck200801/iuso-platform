import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardSkeleton } from "@/components/ui/skeleton"
import { useCandidatData } from "@/hooks/useCandidatData"
import { useAuth } from "@/hooks/useAuth"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Header } from "@/components/Layout/Header"
import ProfileComponent from "@/components/dashboard/ProfileComponent"
import DocumentsComponent from "@/components/dashboard/DocumentsComponent"
import MessagesComponent from "@/components/dashboard/MessagesComponent"
import OverviewChart from "@/components/dashboard/OverviewChart"
import SectionTransition from "@/components/dashboard/SectionTransition"
import {
  User,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
  Bell,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Home,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Zap,
  Eye,
  Building,
  Heart,
  Share2,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Menu,
  X
} from "lucide-react"
import { FILIERES } from "@/lib/constants"

const DashboardPage = () => {
  const { data: candidat, loading: loadingCandidat, error: errorCandidat } = useCandidatData()
  const { user, loading: loadingAuth } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Marquer comme initialisé une fois que les données de base sont chargées
  useEffect(() => {
    if (!loadingAuth && user) {
      setIsInitialized(true)
    }
  }, [loadingAuth, user])

  // Calcul progression basé sur les vrais champs de la table inscrits avec protection
  const { requiredFields, filledCount, completionPercentage } = useMemo(() => {
    const fields = [
      "firstName", "lastName", "studyCycle", "studyField", 
      "phone", "address", "photo", "bacAttestation"
    ]
    
    if (!candidat) {
      return {
        requiredFields: fields,
        filledCount: 0,
        completionPercentage: 0
      }
    }

    const filled = fields.filter(field => {
      const value = candidat[field]
      return value !== null && value !== undefined && value !== ''
    }).length

    return {
      requiredFields: fields,
      filledCount: filled,
      completionPercentage: Math.round((filled / fields.length) * 100)
    }
  }, [candidat])

  // Statut avec couleurs cohérentes avec le thème
  const statusInfo = useMemo(() => {
    if (!candidat) return { 
      color: "slate", 
      text: "Chargement...", 
      icon: Clock,
      bgColor: "bg-slate-100",
      textColor: "text-slate-700"
    }
    
    switch (candidat.status) {
      case "valide": 
        return { 
          color: "emerald", 
          text: "Candidature validée", 
          icon: CheckCircle2,
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700"
        }
      case "refuse": 
        return { 
          color: "red", 
          text: "Candidature refusée", 
          icon: AlertCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-700"
        }
      default: 
        return { 
          color: "blue", 
          text: "En cours d'évaluation", 
          icon: Clock,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700"
        }
    }
  }, [candidat])

  const StatusIcon = statusInfo.icon

  // Actions à faire basées sur les vraies données avec protection
  const nextActions = useMemo(() => {
    if (!candidat) return []
    
    const actions = []
    
    if (!candidat.firstName || !candidat.lastName) {
      actions.push({ 
        title: "Compléter vos informations personnelles", 
        desc: "Nom, prénom requis",
        url: "/profile", 
        icon: User, 
        urgent: true 
      })
    }
    if (!candidat.phone || !candidat.address) {
      actions.push({ 
        title: "Ajouter vos coordonnées", 
        desc: "Téléphone et adresse",
        url: "/profile", 
        icon: Phone, 
        urgent: true 
      })
    }
    if (!candidat.studyField) {
      actions.push({ 
        title: "Choisir votre filière", 
        desc: "Sélectionnez votre programme d'études",
        url: "/formations", 
        icon: BookOpen, 
        urgent: true 
      })
    }
    if (!candidat.photo || !candidat.bacAttestation) {
      actions.push({ 
        title: "Télécharger vos documents", 
        desc: "Photo d'identité et attestation BAC",
        url: "/documents", 
        icon: FileText, 
        urgent: false 
      })
    }
    
    return actions.slice(0, 3)
  }, [candidat])

  // Trouver la formation correspondante avec protection
  const currentFormation = useMemo(() => {
    if (!candidat?.studyField) return null
    return FILIERES.find(f => f.label === candidat.studyField || f.value === candidat.studyField) || null
  }, [candidat?.studyField])

  const greeting = useMemo(() => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }, [currentTime])

  // Menu items pour le dashboard
  const menuItems = useMemo(() => [
    { 
      id: 'overview', 
      label: 'Vue d\'ensemble', 
      icon: Home, 
      section: 'overview',
      description: 'Aperçu général'
    },
    { 
      id: 'profile', 
      label: 'Mon Profil', 
      icon: User, 
      section: 'profile',
      description: 'Informations personnelles'
    },
    { 
      id: 'documents', 
      label: 'Mes Documents', 
      icon: FileText, 
      section: 'documents',
      description: 'Pièces justificatives'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      section: 'messages',
      description: 'Communications'
    },
    { 
      id: 'formations', 
      label: 'Formations', 
      icon: BookOpen, 
      href: '/formations',
      description: 'Programmes d\'études'
    },
    { 
      id: 'help', 
      label: 'Aide', 
      icon: HelpCircle, 
      href: '/faq',
      description: 'Questions fréquentes'
    }
  ], [])

  const isActiveMenuItem = (item: any) => {
    if (item.section) {
      return activeSection === item.section
    }
    if (item.href) {
      return location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    }
    return false
  }

  // États de chargement améliorés
  const isLoading = loadingAuth || loadingCandidat || !isInitialized
  const hasError = errorCandidat && !loadingCandidat

  // Gestion des paramètres d'URL pour les sections
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const section = searchParams.get('section')
    if (section && ['overview', 'profile', 'documents', 'messages'].includes(section)) {
      setActiveSection(section)
    }
  }, [location.search])

  // Fonction pour changer de section
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    navigate(`/dashboard?section=${section}`, { replace: true })
  }

  // Données par défaut sécurisées
  const displayName = candidat?.firstName || user?.email?.split('@')[0] || "Candidat"
  const displayEmail = candidat?.email || user?.email || "email@example.com"
  const displayMatricule = candidat?.matricule || "En attente"
  const displayCreatedAt = candidat?.createdAt 
    ? new Date(candidat.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })
    : "---"

  // Fonction pour rendre le contenu selon la section active
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileComponent />
      case 'documents':
        return <DocumentsComponent />
      case 'messages':
        return <MessagesComponent />
      case 'overview':
      default:
        return renderOverviewContent()
    }
  }

  // Contenu de la vue d'ensemble (contenu actuel du dashboard)
  const renderOverviewContent = () => (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Actions prioritaires */}
      <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group relative">
          {/* Effet de brillance en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-8 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl">
                  <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-gilroy text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                    Actions prioritaires
                  </h2>
                  <p className="text-slate-600 font-gilroy group-hover:text-slate-700 transition-colors duration-300">
                    Complétez votre dossier pour finaliser votre candidature
                  </p>
                </div>
              </div>
              {nextActions.length > 0 && (
                <Badge className="bg-red-100 text-red-700 border-red-200 animate-bounce-in hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {nextActions.length} en attente
                  </div>
                </Badge>
              )}
            </div>

            {nextActions.length > 0 ? (
              <div className="space-y-4">
                {nextActions.map((action, index) => (
                  <div 
                    key={index}
                    className="group/item bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-500 border border-slate-100 hover:border-blue-200 transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up relative overflow-hidden"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    {/* Effet de vague au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Particules décoratives */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover/item:opacity-100 animate-ping transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover/item:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3 rounded-xl text-white group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-500 shadow-lg group-hover/item:shadow-xl ${
                        action.urgent ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        <action.icon className="h-5 w-5 group-hover/item:animate-pulse" />
                        
                        {/* Badge urgence */}
                        {action.urgent && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold font-gilroy text-slate-900 mb-1 group-hover/item:text-blue-700 transition-colors duration-300">
                          {action.title}
                        </h4>
                        <p className="text-sm text-slate-600 group-hover/item:text-slate-700 transition-colors duration-300">{action.desc}</p>
                        
                        {/* Barre de progression pour l'urgence */}
                        <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <div className={`h-full rounded-full transition-all duration-1000 ${
                            action.urgent ? 'bg-gradient-to-r from-red-400 to-red-500 w-4/5' : 'bg-gradient-to-r from-blue-400 to-blue-500 w-3/5'
                          }`}></div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          if (action.url === '/profile') handleSectionChange('profile')
                          else if (action.url === '/documents') handleSectionChange('documents')
                          else navigate(action.url)
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 relative overflow-hidden group/btn"
                      >
                        {/* Effet de brillance sur le bouton */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        
                        <span className="relative z-10">Compléter</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl animate-bounce-in">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold font-gilroy text-slate-900 mb-3 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  Excellent travail ! 🎉
                </h3>
                <p className="text-lg text-slate-600 font-gilroy animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                  Votre dossier est complet et prêt pour l'évaluation.
                </p>
                
                {/* Confettis animés */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-confetti" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
                  <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full animate-confetti" style={{ animationDuration: '3.5s', animationDelay: '1.7s' }}></div>
                  <div className="absolute top-32 left-32 w-2 h-2 bg-green-400 rounded-full animate-confetti" style={{ animationDuration: '4s', animationDelay: '1.9s' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formation sélectionnée */}
        {currentFormation && (
          <Card className="mt-8 border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group animate-fade-in-up relative" style={{ animationDelay: '1.2s' }}>
            {/* Effet de particules flottantes */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-300/60 rounded-full animate-float"></div>
              <div className="absolute top-12 right-12 w-1 h-1 bg-blue-300/60 rounded-full animate-float-delayed"></div>
              <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-emerald-300/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-8 text-white relative overflow-hidden">
                {/* Effet de brillance animée */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <div className="flex items-center gap-6 mb-6 animate-slide-in-left relative z-10" style={{ animationDelay: '1.4s' }}>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl group-hover:bg-white/30">
                    <GraduationCap className="h-10 w-10 text-white group-hover:animate-pulse" />
                    
                    {/* Badge de certification */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="h-3 w-3 text-yellow-800" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-gilroy mb-2 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                      Votre formation
                    </h3>
                    <p className="text-blue-100 text-lg animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
                      Programme sélectionné
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 relative animate-scale-in" style={{ animationDelay: '2s' }}>
                  {/* Effet de pulsation subtile */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <h4 className="text-2xl font-semibold font-gilroy mb-3 relative z-10 animate-fade-in-up" style={{ animationDelay: '2.2s' }}>
                    {currentFormation.label}
                  </h4>
                  <p className="text-blue-100 mb-4 text-lg relative z-10 animate-fade-in-up" style={{ animationDelay: '2.4s' }}>
                    {currentFormation.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6 relative z-10">
                    {[
                      { icon: Clock, text: currentFormation.duration, delay: '2.6s' },
                      { icon: Award, text: currentFormation.credits, delay: '2.8s' },
                      { icon: BookOpen, text: currentFormation.category, delay: '3s' }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-slide-in-right" 
                        style={{ animationDelay: item.delay }}
                      >
                        <item.icon className="h-5 w-5 animate-pulse" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild 
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group/btn animate-bounce-in"
                    style={{ animationDelay: '3.2s' }}
                  >
                    <Link to="/formations">
                      {/* Effet de brillance sur le bouton */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      
                      <span className="relative z-10 font-semibold">Voir les détails</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Profil et raccourcis */}
      <div className="space-y-8">
        {/* Profil candidat */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 group animate-slide-in-right relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
          {/* Effet de brillance en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                <User className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold font-gilroy group-hover:text-blue-700 transition-colors duration-300">Mon profil</h3>
            </div>
            
            {/* Avatar et nom */}
            <div className="text-center mb-6 animate-scale-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-lg hover:shadow-xl relative group/avatar">
                <span className="text-3xl font-bold text-white group-hover/avatar:animate-pulse">
                  {displayName?.[0]?.toUpperCase() || 'C'}
                </span>
                
                {/* Badge de statut */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse">
                  <div className="w-full h-full rounded-full bg-green-400 animate-ping"></div>
                </div>
              </div>
              <h4 className="font-bold font-gilroy text-slate-900 text-lg animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                {candidat?.firstName && candidat?.lastName 
                  ? `${candidat.firstName} ${candidat.lastName}` 
                  : displayName}
              </h4>
              <p className="text-slate-500 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>{displayEmail}</p>
            </div>

            {/* Informations */}
            <div className="space-y-4 mb-6">
              {[
                { icon: Mail, label: "Email", value: displayEmail, color: "text-blue-500" },
                { icon: Phone, label: "Téléphone", value: candidat?.phone || "À renseigner", color: "text-green-500" },
                { icon: MapPin, label: "Adresse", value: candidat?.address || "À renseigner", color: "text-purple-500" },
                { icon: BookOpen, label: "Filière", value: candidat?.studyField || "À choisir", color: "text-orange-500" },
                { icon: Calendar, label: "Inscrit le", value: candidat?.createdAt ? new Date(candidat.createdAt).toLocaleDateString("fr-FR") : "Non défini", color: "text-slate-500" }
              ].map((info, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group/info animate-slide-in-left"
                  style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                >
                  <div className="p-1.5 bg-white rounded-lg group-hover/info:scale-110 transition-transform duration-300">
                    <info.icon className={`h-4 w-4 ${info.color} group-hover/info:animate-pulse`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover/info:text-blue-700 transition-colors duration-300">{info.label}</p>
                    <p className="text-sm text-slate-500 truncate group-hover/info:text-slate-700 transition-colors duration-300">{info.value}</p>
                  </div>
                  
                  {/* Indicateur de completion */}
                  <div className={`w-2 h-2 rounded-full ${
                    info.value.includes("À") ? 'bg-red-400 animate-pulse' : 'bg-green-400'
                  }`}></div>
                </div>
              ))}
            </div>

            {/* Progression */}
            <div className="space-y-3 mb-6 animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-900">Progression du dossier</span>
                <span className="text-sm font-bold text-blue-600 animate-pulse">{completionPercentage}%</span>
              </div>
              <div className="relative">
                <Progress value={completionPercentage} className="h-3 bg-slate-200" />
                {/* Effet de brillance sur la barre de progression */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-3 rounded-full animate-shimmer"></div>
              </div>
              <p className="text-xs text-slate-500">{filledCount} sur {requiredFields.length} étapes complétées</p>
              
              {/* Badges de statut */}
              <div className="flex gap-2 mt-3">
                {completionPercentage === 100 ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 animate-bounce-in">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complet
                  </Badge>
                ) : completionPercentage >= 75 ? (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 animate-pulse">
                    <Target className="h-3 w-3 mr-1" />
                    Presque fini
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 animate-bounce">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    En cours
                  </Badge>
                )}
              </div>
            </div>

            <Button 
              onClick={() => handleSectionChange('profile')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group/btn animate-bounce-in"
              style={{ animationDelay: '2s' }}
            >
              {/* Effet de brillance sur le bouton */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              
              <span className="relative z-10 font-semibold">Modifier mon profil</span>
              <Settings className="h-4 w-4 ml-2 group-hover/btn:rotate-90 transition-transform duration-300 relative z-10" />
            </Button>
          </CardContent>
        </Card>

        {/* Raccourcis */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 group animate-slide-in-right relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
          {/* Effet de brillance en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
                <Sparkles className="h-5 w-5 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-gilroy group-hover:text-purple-700 transition-colors duration-300">Raccourcis</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: "Mes documents", section: "documents", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-100", hoverBg: "hover:bg-blue-50", description: "Gérer vos pièces justificatives" },
                { title: "Formations", url: "/formations", icon: BookOpen, color: "text-emerald-600", bgColor: "bg-emerald-100", hoverBg: "hover:bg-emerald-50", description: "Explorer les programmes" },
                { title: "Aide & FAQ", url: "/faq", icon: HelpCircle, color: "text-orange-600", bgColor: "bg-orange-100", hoverBg: "hover:bg-orange-50", description: "Obtenir de l'aide" }
              ].map((shortcut, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-start h-auto p-4 hover:bg-slate-50 group/shortcut transition-all duration-500 hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] animate-slide-in-left border border-transparent hover:border-slate-200 ${shortcut.hoverBg}`}
                  style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                  onClick={() => {
                    if (shortcut.section) {
                      handleSectionChange(shortcut.section)
                    } else if (shortcut.url) {
                      navigate(shortcut.url)
                    }
                  }}
                >
                  {/* Effet de particules */}
                  <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover/shortcut:opacity-100 animate-ping transition-opacity duration-300"></div>
                  
                  <div className={`p-2 rounded-lg ${shortcut.bgColor} group-hover/shortcut:scale-110 group-hover/shortcut:rotate-6 transition-all duration-300 shadow-sm`}>
                    <shortcut.icon className={`h-4 w-4 ${shortcut.color} group-hover/shortcut:animate-pulse`} />
                  </div>
                  
                  <div className="flex-1 ml-3 text-left">
                    <div className="font-medium font-gilroy text-slate-900 group-hover/shortcut:text-blue-700 transition-colors duration-300">
                      {shortcut.title}
                    </div>
                    <div className="text-xs text-slate-500 opacity-0 group-hover/shortcut:opacity-100 transition-opacity duration-300">
                      {shortcut.description}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Badge nouveau pour certains raccourcis */}
                    {shortcut.title === "Formations" && (
                      <Badge className="bg-green-100 text-green-700 text-xs animate-pulse">
                        Nouveau
                      </Badge>
                    )}
                    
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover/shortcut:translate-x-1 group-hover/shortcut:text-blue-600 transition-all duration-300" />
                  </div>
                  
                  {/* Ligne de progression au survol */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover/shortcut:w-full transition-all duration-500"></div>
                </Button>
              ))}
            </div>
            
            {/* Section bonus - Statistiques rapides */}
            <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300 group/stat">
                  <div className="text-lg font-bold text-blue-600 group-hover/stat:scale-110 transition-transform duration-300">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-xs text-slate-600">Vues profil</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-300 group/stat">
                  <div className="text-lg font-bold text-emerald-600 group-hover/stat:scale-110 transition-transform duration-300">
                    {Math.floor(Math.random() * 10) + 1}
                  </div>
                  <div className="text-xs text-slate-600">Connexions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Affichage d'erreur
  if (hasError) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <Card className="max-w-md mx-auto shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold font-gilroy text-slate-900 mb-3">
                Erreur de chargement
              </h3>
              <p className="text-slate-600 mb-6">
                Impossible de charger vos données. Veuillez réessayer.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Écran de chargement amélioré
  if (isLoading) {
    return (
      <>
        <Header />
        <DashboardSkeleton />
      </>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <Header />

      {/* Menu flottant à gauche */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block">
        <Card className="w-16 hover:w-64 transition-all duration-300 group shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-3">
            <div className="space-y-2">
              {menuItems.map((item) => (
                item.section ? (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.section)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group/item w-full text-left ${
                      isActiveMenuItem(item)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                    title={item.label}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                      <div className="font-medium font-gilroy text-sm whitespace-nowrap">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href!}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group/item ${
                      isActiveMenuItem(item)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                    title={item.label}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                      <div className="font-medium font-gilroy text-sm whitespace-nowrap">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu mobile flottant */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        
        {isMenuOpen && (
          <Card className="absolute bottom-16 right-0 w-64 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
            <CardContent className="p-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  item.section ? (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSectionChange(item.section)
                        setIsMenuOpen(false)
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                        isActiveMenuItem(item)
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium font-gilroy text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.href!}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isActiveMenuItem(item)
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium font-gilroy text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hero Section - Inspiré de FormationsPage */}
      {activeSection === 'overview' && (
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-16 overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-ping"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center text-white xl:ml-24">
              {/* Breadcrumbs */}
              <nav className="mb-8">
                <ol className="flex items-center justify-center gap-2 text-blue-100 text-sm">
                  <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                  <li><ChevronRight className="h-4 w-4" /></li>
                  <li className="text-white font-medium">Tableau de bord</li>
                </ol>
              </nav>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-semibold font-gilroy mb-8 shadow-lg hover:bg-white/25 transition-all duration-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200 font-medium">
                  {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <GraduationCap className="h-4 w-4" />
                Dashboard IUSO-SNE
              </div>

              <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight mb-8 animate-fade-in">
                <span className="block">{greeting}</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mt-2">
                  {displayName} 👋
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12 font-gilroy animate-fade-in-up">
                Voici un aperçu de votre progression et de votre dossier de candidature.
              </p>

              {/* Progression Badge */}
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold font-gilroy text-white mb-1">
                    {completionPercentage}%
                  </div>
                  <div className="text-sm text-blue-100">Dossier complété</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold font-gilroy text-white mb-1">
                    {displayMatricule}
                  </div>
                  <div className="text-sm text-blue-100">Matricule</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section - Animated */}
      <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Titre animé de la section */}
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold font-gilroy text-slate-900 mb-4">
                Votre progression en temps réel
              </h2>
              <p className="text-lg text-slate-600 font-gilroy max-w-2xl mx-auto">
                Suivez l'évolution de votre candidature et les étapes importantes de votre parcours
              </p>
            </div>

            {/* Grille des statistiques avec animations échelonnées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  title: "Statut", 
                  value: statusInfo.text, 
                  icon: StatusIcon, 
                  color: statusInfo.color,
                  bgColor: statusInfo.bgColor,
                  textColor: statusInfo.textColor,
                  description: "État actuel de votre dossier",
                  pulse: candidat?.status === "en_cours"
                },
                { 
                  title: "Progression", 
                  value: `${completionPercentage}%`, 
                  icon: TrendingUp, 
                  color: "blue",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-700",
                  description: "Dossier complété",
                  showProgress: true
                },
                { 
                  title: "Actions restantes", 
                  value: nextActions.length.toString(), 
                  icon: Target, 
                  color: "orange",
                  bgColor: "bg-orange-100",
                  textColor: "text-orange-700",
                  description: "Étapes à finaliser",
                  bounce: nextActions.length > 0
                },
                { 
                  title: "Inscrit le", 
                  value: displayCreatedAt, 
                  icon: Calendar, 
                  color: "blue",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-700",
                  description: "Date d'inscription"
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center p-6 rounded-2xl hover:bg-gradient-to-t hover:from-blue-50 hover:to-transparent transition-all duration-500 group cursor-pointer transform hover:-translate-y-2 hover:shadow-xl animate-fade-in-up border border-transparent hover:border-blue-200/50 ${
                    stat.pulse ? 'animate-pulse' : ''
                  } ${stat.bounce ? 'animate-bounce' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Effet de particules en arrière-plan */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>

                  {/* Icône avec animations avancées */}
                  <div className={`relative flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ${stat.bgColor} w-16 h-16 rounded-2xl mx-auto shadow-lg group-hover:shadow-xl`}>
                    <stat.icon className={`h-7 w-7 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`} />
                    
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Cercle animé pour les actions restantes */}
                    {stat.bounce && nextActions.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-xs font-bold text-white">{nextActions.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Valeur avec effet de compteur */}
                  <div className={`text-3xl font-bold font-gilroy mb-2 group-hover:${stat.textColor} transition-all duration-300 group-hover:scale-110`}>
                    {stat.showProgress ? (
                      <div className="flex flex-col items-center">
                        <span className="animate-pulse">{stat.value}</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${completionPercentage}%`,
                              animationDelay: `${index * 200}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className={hoveredCard === index ? 'animate-pulse' : ''}>{stat.value}</span>
                    )}
                  </div>

                  {/* Titre */}
                  <div className="text-sm font-semibold text-slate-800 font-gilroy mb-1 group-hover:text-blue-700 transition-colors duration-300">
                    {stat.title}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-slate-500 font-gilroy opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {stat.description}
                  </div>

                  {/* Ligne de séparation animée */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-3/4 transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* Indicateur de mise à jour en temps réel */}
            <div className="flex items-center justify-center mt-12 animate-fade-in">
              <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full border border-slate-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 font-gilroy">
                  Données mises à jour en temps réel
                </span>
                <div className="text-xs text-slate-500">
                  {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto xl:ml-24">
            <SectionTransition sectionKey={activeSection}>
              {renderContent()}
            </SectionTransition>
          </div>
        </div>
      </section>

      {/* Pied de page simplifié inspiré de LoginPage */}
      <footer className="bg-white/95 backdrop-blur-md border-t border-slate-200/50 py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-gilroy mb-4">
                Besoin d'aide avec votre candidature ?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-gilroy font-medium"
                >
                  <Link to="/faq" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Questions fréquentes
                  </Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contacter le support
                  </Link>
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-gilroy">
                  © 2024 IUSO-SNE. Tous droits réservés. | 
                  <Link to="/privacy" className="hover:text-blue-600 transition-colors ml-1">Politique de confidentialité</Link> |
                  <Link to="/terms" className="hover:text-blue-600 transition-colors ml-1">Conditions d'utilisation</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage