import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { 
  ArrowRight, 
  Sparkles,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Star,
  Clock,
  Target,
  FileText,
  Award,
  ChevronRight,
  TrendingUp,
  Globe,
  GraduationCap,
  BookOpen,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { IUSO_INFO, FILIERES } from "@/lib/constants"

const HomePage = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredFormation, setHoveredFormation] = useState<number | null>(null)
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  // Hook pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute('data-animate-id')
            if (elementId) {
              setVisibleElements(prev => new Set([...prev, elementId]))
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observer tous les éléments avec data-animate-id
    const elementsToObserve = document.querySelectorAll('[data-animate-id]')
    elementsToObserve.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence Académique",
      description: "Formations reconnues avec 98% de taux d'insertion professionnelle",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Stages Professionnels",
      description: "De 8 à 16 semaines selon le cycle avec nos 40+ partenaires entreprises",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Accompagnement Personnalisé",
      description: "Suivi individuel et encadrement de qualité avec des enseignants expérimentés",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      hoverBg: "hover:bg-slate-100"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Inscription",
      description: "Créez votre compte et soumettez votre dossier",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-600",
      details: "Processus 100% en ligne et sécurisé"
    },
    {
      number: "02",
      title: "Sélection",
      description: "Concours d'entrée ou traitement de dossier",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-emerald-600",
      details: "Selon le niveau d'études visé"
    },
    {
      number: "03",
      title: "Admission",
      description: "Intégrez votre formation à l'IUSO-SNE",
      icon: <Award className="h-6 w-6" />,
      color: "bg-slate-600",
      details: "Début de votre parcours d'excellence"
    }
  ]

  const stats = [
    { 
      number: IUSO_INFO.stats.graduates, 
      label: "Diplômés", 
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Depuis la création"
    },
    { 
      number: IUSO_INFO.stats.insertionRate, 
      label: "Insertion", 
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Taux d'insertion pro"
    },
    { 
      number: IUSO_INFO.stats.internships, 
      label: "Stages/an", 
      icon: <Briefcase className="h-6 w-6" />,
      description: "Stages réalisés"
    },
    { 
      number: IUSO_INFO.stats.partners, 
      label: "Partenaires", 
      icon: <Building className="h-6 w-6" />,
      description: "Entreprises partenaires"
    }
  ]

  // Grouper les formations par catégorie
  const formationsByCategory = FILIERES.reduce((acc, formation) => {
    const category = formation.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(formation)
    return acc
  }, {} as Record<string, typeof FILIERES[number][]>)

  return (
    <div className="bg-white min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-24 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold font-gilroy mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <Sparkles className="h-4 w-4 animate-spin" />
              {IUSO_INFO.fullName}
            </div>

            {/* Main Title with Gradient Animation */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-gilroy leading-tight mb-8">
              <span className="block text-slate-900 animate-fade-in">Excellence académique</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 bg-clip-text text-transparent mt-2 animate-fade-in delay-300">
                au cœur du Gabon
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12 font-gilroy animate-fade-in delay-500">
              L'Institut Universitaire des Sciences de l'Organisation forme les leaders de demain avec des programmes d'excellence. 
              <span className="text-blue-700 font-semibold"> DUT, Licences, Masters - Votre réussite commence ici.</span>
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in delay-700">
              <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/inscription" className="flex items-center gap-2">
                  Commencer ma candidature
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="group border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl transition-all duration-300 hover:shadow-lg">
                <Link to="/login" className="flex items-center gap-2">
                  Se connecter
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group text-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-500 cursor-pointer hover:scale-110 hover:-translate-y-2 animate-fade-in transform hover:rotate-1"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-4 text-blue-600 group-hover:text-blue-700 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold font-gilroy text-slate-900 mb-2 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 font-medium font-gilroy mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formations Section - Design Accordéon Interactif */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Éléments décoratifs flottants */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-orange-200/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/10 to-blue-200/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header Moderne */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold font-gilroy mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Nos Formations d'Excellence
                <GraduationCap className="h-6 w-6 animate-bounce" />
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold font-gilroy text-slate-900 mb-8 leading-tight">
                Du DUT au Master,
                <span className="block bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent mt-2">
                  votre avenir commence ici
                </span>
              </h2>
              
              <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-gilroy">
                Découvrez notre gamme complète de formations universitaires, 
                <span className="text-blue-700 font-semibold"> conçues pour vous préparer aux défis professionnels de demain</span>
              </p>
            </div>

            {/* Accordéon des formations par niveau */}
            <div className="space-y-8 mb-20">
              {Object.entries(formationsByCategory).map(([category, formations], categoryIndex) => {
                const elementId = `accordion-${categoryIndex}`;
                const isVisible = visibleElements.has(elementId);
                
                // Couleurs par catégorie
                const categoryColors = {
                  'BTS': {
                    gradient: 'from-indigo-500 to-indigo-700',
                    bg: 'bg-indigo-50',
                    border: 'border-indigo-200',
                    text: 'text-indigo-700',
                    accent: 'bg-indigo-500'
                  },
                  'DUT': {
                    gradient: 'from-blue-500 to-blue-700',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-700',
                    accent: 'bg-blue-500'
                  },
                  'Licence Fondamentale': {
                    gradient: 'from-emerald-500 to-emerald-700',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    text: 'text-emerald-700',
                    accent: 'bg-emerald-500'
                  },
                  'Licence Professionnelle': {
                    gradient: 'from-purple-500 to-purple-700',
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    text: 'text-purple-700',
                    accent: 'bg-purple-500'
                  },
                  'Master': {
                    gradient: 'from-orange-500 to-orange-700',
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    text: 'text-orange-700',
                    accent: 'bg-orange-500'
                  }
                };

                const colors = categoryColors[category as keyof typeof categoryColors];

                return (
                  <div
                    key={category}
                    data-animate-id={elementId}
                    className={`group transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${categoryIndex * 150}ms` }}
                  >
                    {/* Header de la catégorie */}
                    <div className={`bg-gradient-to-r ${colors.gradient} rounded-3xl p-8 mb-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                            {category === 'BTS' ? <FileText className="h-10 w-10 text-white" /> :
                             category === 'DUT' ? <BookOpen className="h-10 w-10 text-white" /> :
                             category === 'Licence Fondamentale' ? <GraduationCap className="h-10 w-10 text-white" /> :
                             category === 'Licence Professionnelle' ? <Briefcase className="h-10 w-10 text-white" /> :
                             <Award className="h-10 w-10 text-white" />}
                          </div>
                          
                          <div>
                            <h3 className="text-4xl font-bold font-gilroy mb-2">{category}</h3>
                            <div className="flex items-center gap-8 text-white/90">
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                <span className="text-lg font-medium">
                                  {category === 'BTS' || category === 'DUT' ? '2 ans' :
                                   category === 'Licence Fondamentale' ? '3 ans' :
                                   category === 'Licence Professionnelle' ? '1 an' :
                                   '2 ans'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                <span className="text-lg font-medium">
                                  {category === 'BTS' || category === 'DUT' ? '120 ECTS' :
                                   category === 'Licence Fondamentale' ? '180 ECTS' :
                                   category === 'Licence Professionnelle' ? '60 ECTS' :
                                   '120 ECTS'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-5xl font-bold font-gilroy mb-2 group-hover:scale-110 transition-transform duration-300">
                            {formations.length}
                          </div>
                          <div className="text-white/80 text-lg">
                            formation{formations.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grille des formations */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {formations.map((formation, index) => {
                        const formationId = `formation-${categoryIndex}-${index}`;
                        const isFormationVisible = visibleElements.has(formationId);
                        
                        return (
                          <div
                            key={formation.value}
                            data-animate-id={formationId}
                            className={`group/formation bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-blue-200/50 transform hover:-translate-y-1 hover:scale-[1.02] ${
                              isFormationVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                            }`}
                            style={{ transitionDelay: `${(categoryIndex * 150) + (index * 100)}ms` }}
                          >
                            {/* Badge de catégorie */}
                            <div className="flex items-center justify-between mb-6">
                              <div className={`${colors.accent} w-1 h-12 rounded-full`}></div>
                              <div className={`${colors.bg} ${colors.border} border px-4 py-2 rounded-full`}>
                                <span className={`${colors.text} text-sm font-semibold`}>
                                  {formation.duration} • {formation.credits}
                                </span>
                              </div>
                            </div>
                            
                            {/* Contenu de la formation */}
                            <div className="mb-6">
                              <h4 className="text-2xl font-bold font-gilroy text-slate-900 mb-4 group-hover/formation:text-blue-600 transition-colors duration-300">
                                {formation.label}
                              </h4>
                              
                              <p className="text-slate-600 font-gilroy leading-relaxed text-lg group-hover/formation:text-slate-700 transition-colors duration-300">
                                {formation.description}
                              </p>
                            </div>
                            
                            {/* Action button */}
                            <div className="flex justify-end">
                              {category !== 'Master' ? (
                                <Button
                                  asChild
                                  className={`bg-gradient-to-r ${colors.gradient} hover:shadow-xl text-white px-6 py-3 font-semibold font-gilroy rounded-xl transition-all duration-300 transform hover:scale-105 group-hover/formation:shadow-2xl`}
                                >
                                  <Link to="/inscription" className="flex items-center gap-2">
                                    <span>Candidater</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                  </Link>
                                </Button>
                              ) : (
                                <div className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold border border-slate-200">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Admission sur dossier
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section statistiques modernisée */}
            <div 
              className="text-center mb-16"
              data-animate-id="formations-stats-modern"
            >
              <div className={`bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-2xl transition-all duration-1000 ${
                visibleElements.has('formations-stats-modern') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <h3 className="text-3xl font-bold font-gilroy text-slate-900 mb-10">
                  L'IUSO-SNE en chiffres
                </h3>
                
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {[
                     { 
                       number: Object.values(formationsByCategory).reduce((acc, formations) => acc + formations.length, 0), 
                       label: "Formations", 
                       icon: <BookOpen className="h-8 w-8" />,
                       iconColor: "text-blue-600",
                       bg: "bg-blue-100"
                     },
                     { 
                       number: Object.keys(formationsByCategory).length, 
                       label: "Niveaux", 
                       icon: <Target className="h-8 w-8" />,
                       iconColor: "text-emerald-600",
                       bg: "bg-emerald-100"
                     },
                     { 
                       number: "98%", 
                       label: "Insertion", 
                       icon: <TrendingUp className="h-8 w-8" />,
                       iconColor: "text-purple-600",
                       bg: "bg-purple-100"
                     },
                     { 
                       number: "350+", 
                       label: "Stages/an", 
                       icon: <Briefcase className="h-8 w-8" />,
                       iconColor: "text-orange-600",
                       bg: "bg-orange-100"
                     }
                   ].map((stat, index) => (
                     <div key={index} className="group text-center">
                       <div className={`w-20 h-20 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                         <div className={stat.iconColor}>
                           {stat.icon}
                         </div>
                       </div>
                       <div className="text-4xl font-bold font-gilroy text-slate-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                         {stat.number}
                       </div>
                       <div className="text-slate-600 font-gilroy text-lg">{stat.label}</div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            {/* Call to action épuré */}
            <div 
              className="text-center"
              data-animate-id="formations-cta-modern"
            >
              <div className={`transition-all duration-1000 ${
                visibleElements.has('formations-cta-modern') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
                  {/* Éléments décoratifs */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-4xl font-bold font-gilroy mb-6">
                      Prêt à rejoindre l'excellence ?
                    </h3>
                    
                    <p className="text-xl text-slate-300 font-gilroy mb-10 max-w-3xl mx-auto leading-relaxed">
                      Explorez toutes nos formations en détail et trouvez celle qui correspond parfaitement à vos ambitions professionnelles
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button 
                        asChild
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-lg font-semibold font-gilroy rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Link to="/formations" className="flex items-center gap-3">
                          <Globe className="h-6 w-6" />
                          Explorer toutes les formations
                          <ArrowRight className="h-6 w-6" />
                        </Link>
                      </Button>
                      
                      <Button 
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-2 border-emerald-500 hover:border-emerald-600 px-10 py-4 text-lg font-semibold font-gilroy rounded-2xl transition-all duration-300 hover:shadow-lg"
                      >
                        <Link to="/inscription" className="flex items-center gap-3">
                          <Star className="h-6 w-6" />
                          Candidater maintenant
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section - Nouveau Design Bento Grid */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header avec animation */}
            <div className="text-center mb-20">
              <div 
                className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold font-gilroy mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                data-animate-id="features-badge"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Nos points forts
                <Sparkles className="h-5 w-5 animate-spin-slow" />
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold font-gilroy text-slate-900 mb-8 leading-tight">
                Pourquoi choisir
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                  l'IUSO-SNE ?
                </span>
              </h2>
              
              <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-gilroy">
                Une formation d'excellence qui prépare aux 
                <span className="text-blue-700 font-semibold"> défis professionnels de demain</span>
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              {/* Carte principale - Excellence Académique */}
              <div 
                className="lg:col-span-8 group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
                data-animate-id="feature-main"
              >
                {/* Motifs de fond animés */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24 group-hover:scale-110 transition-transform duration-1000 delay-200"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold font-gilroy mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                      <div className="text-blue-100 text-sm">Taux d'insertion</div>
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold font-gilroy mb-6 group-hover:text-blue-100 transition-colors duration-300">
                    Excellence Académique
                  </h3>
                  
                  <p className="text-xl text-blue-100 leading-relaxed mb-8 font-gilroy">
                    Formations reconnues avec 98% de taux d'insertion professionnelle
                  </p>
                  
                  {/* Indicateurs de performance */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-100">Certifié qualité</span>
                      </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-sm text-blue-100">Reconnu État</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte secondaire - Stages */}
              <div 
                className="lg:col-span-4 group relative bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
                data-animate-id="feature-stages"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                    <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold font-gilroy mb-4 group-hover:text-emerald-100 transition-colors duration-300">
                      Stages Professionnels
                    </h3>
                    
                    <p className="text-emerald-100 leading-relaxed mb-6 font-gilroy">
                      De 8 à 16 semaines selon le cycle avec nos 40+ partenaires entreprises
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="text-3xl font-bold font-gilroy mb-1">40+</div>
                    <div className="text-emerald-100 text-sm">Partenaires</div>
                  </div>
                </div>
              </div>

              {/* Carte accompagnement - Pleine largeur */}
              <div 
                className="lg:col-span-12 group relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:scale-[1.01] cursor-pointer"
                data-animate-id="feature-accompagnement"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full transform -translate-y-48 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full transform translate-y-40 group-hover:scale-110 transition-transform duration-1000 delay-300"></div>
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold font-gilroy mb-2 group-hover:text-slate-200 transition-colors duration-300">
                          Accompagnement Personnalisé
                        </h3>
                        <p className="text-slate-300 font-gilroy">
                          Suivi individuel et encadrement de qualité avec des enseignants expérimentés
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 text-center">
                    <div>
                      <div className="text-4xl font-bold font-gilroy mb-2 text-blue-400">24/7</div>
                      <div className="text-slate-300 text-sm">Support</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold font-gilroy mb-2 text-emerald-400">1:15</div>
                      <div className="text-slate-300 text-sm">Ratio prof/élève</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus d'admission - Design Timeline Moderne */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Fond animé avec particules */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-40 delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-50 delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60 delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold font-gilroy mb-8">
                <Target className="h-5 w-5" />
                Processus d'admission
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold font-gilroy mb-8 leading-tight">
                Comment intégrer
                <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                  l'IUSO-SNE ?
                </span>
              </h2>
              
              <p className="text-2xl text-slate-300 font-gilroy">
                Un processus simple et transparent en 3 étapes
              </p>
            </div>

            {/* Timeline moderne avec cartes flottantes */}
            <div className="relative">
              {/* Ligne de connexion centrale */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-emerald-500 to-purple-500 rounded-full hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-emerald-400 to-purple-400 rounded-full animate-pulse opacity-50"></div>
              </div>

              <div className="space-y-16 lg:space-y-24">
                {steps.map((step, index) => {
                  const isEven = index % 2 === 0;
                  const elementId = `process-step-${index}`;
                  const isVisible = visibleElements.has(elementId);

                  return (
                  <div 
                    key={index} 
                      data-animate-id={elementId}
                      className={`relative flex items-center ${
                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      } transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      {/* Carte de contenu */}
                      <div className={`flex-1 ${isEven ? 'lg:pr-16' : 'lg:pl-16'}`}>
                        <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                          <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                              <span className="text-2xl font-bold text-white font-gilroy">{step.number}</span>
                      </div>
                      
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold font-gilroy mb-3 group-hover:text-blue-400 transition-colors duration-300">
                                {step.title}
                              </h3>
                              
                              <p className="text-slate-300 text-lg leading-relaxed mb-4 font-gilroy group-hover:text-slate-200 transition-colors duration-300">
                                {step.description}
                              </p>
                              
                              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300 transition-all duration-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                {step.details}
                              </div>
                        </div>
                          </div>
                          </div>
                        </div>
                        
                      {/* Point de connexion central */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-slate-800 z-10 hidden lg:block group-hover:scale-125 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full animate-pulse opacity-75"></div>
                      </div>
                      
                      {/* Icône flottante */}
                      <div className={`absolute ${isEven ? 'right-8' : 'left-8'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg hidden lg:flex group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <div className="text-white scale-75">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Contact Section - Design avec Formulaire Intégré */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold font-gilroy mb-8 shadow-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Contactez-nous
                <Mail className="h-6 w-6" />
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold font-gilroy text-white mb-8 leading-tight">
                Notre équipe est là pour vous 
                <span className="block bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent mt-2">
                  accompagner dans votre projet
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-gilroy">
                Vous avez des questions ? Besoin de conseils pour votre orientation ? 
                <span className="text-blue-400 font-semibold"> Écrivez-nous directement !</span>
              </p>
            </div>

            {/* Layout principal : Formulaire + Informations */}
            <div className="grid lg:grid-cols-3 gap-12 mb-20">
              
              {/* Formulaire de contact - 2 colonnes */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-gilroy text-white mb-1">
                        Envoyez-nous un message
                      </h3>
                      <p className="text-slate-300 font-gilroy">
                        Nous vous répondrons dans les 24h
                      </p>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Ligne 1 : Nom + Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 font-gilroy">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 font-gilroy"
                          placeholder="Votre nom et prénom"
                          required
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 font-gilroy">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 font-gilroy"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Ligne 2 : Téléphone + Sujet */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 font-gilroy">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 font-gilroy"
                          placeholder="06X XXX XXX"
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2 font-gilroy">
                          Formation d'intérêt
                        </label>
                        <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 font-gilroy">
                          <option value="" className="bg-slate-800 text-white">Choisir une formation</option>
                          <option value="dut" className="bg-slate-800 text-white">DUT</option>
                          <option value="licence" className="bg-slate-800 text-white">Licence</option>
                          <option value="master" className="bg-slate-800 text-white">Master</option>
                          <option value="autre" className="bg-slate-800 text-white">Autre</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-300 mb-2 font-gilroy">
                        Votre message *
                      </label>
                      <textarea
                        rows={5}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 resize-none font-gilroy"
                        placeholder="Décrivez votre projet, vos questions ou vos besoins d'information..."
                        required
                      ></textarea>
                    </div>

                    {/* Bouton d'envoi */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400 font-gilroy">
                        * Champs obligatoires
                      </p>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 font-semibold font-gilroy rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <span>Envoyer le message</span>
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Informations de contact - 1 colonne */}
              <div className="space-y-6">
                {/* Carte Adresse */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-gilroy text-white mb-2">Adresse</h4>
                      <p className="text-slate-300 font-gilroy leading-relaxed">
                        {IUSO_INFO.contact.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte Téléphones */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-gilroy text-white mb-2">Téléphones</h4>
                      <div className="space-y-1">
                        {IUSO_INFO.contact.phones.map((phone, index) => (
                          <p key={index} className="text-slate-300 font-gilroy">
                            {phone}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte Email */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-gilroy text-white mb-2">E-mail</h4>
                      <p className="text-slate-300 font-gilroy break-all">
                        {IUSO_INFO.contact.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte Horaires */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-gilroy text-white mb-2">Horaires</h4>
                      <div className="space-y-1 text-slate-300 font-gilroy">
                        <p><span className="text-white font-medium">Lun-Ven:</span> {IUSO_INFO.schedule.weekdays}</p>
                        <p><span className="text-white font-medium">Sam:</span> {IUSO_INFO.schedule.saturday}</p>
                        <p><span className="text-white font-medium">Dim:</span> {IUSO_INFO.schedule.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicateur de réponse rapide */}
                <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-400/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold font-gilroy">Équipe disponible</span>
                  </div>
                  <p className="text-slate-300 font-gilroy text-sm leading-relaxed">
                    Notre équipe répond généralement sous 24h. Pour les urgences, n'hésitez pas à nous appeler directement.
                  </p>
                </div>
              </div>
            </div>

            {/* Section statistiques de contact */}
            <div className="text-center">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold font-gilroy text-white mb-8">
                  Pourquoi nous contacter ?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold font-gilroy text-white mb-2">Conseil personnalisé</h4>
                    <p className="text-slate-300 font-gilroy">Orientation adaptée à votre profil</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold font-gilroy text-white mb-2">Réponse rapide</h4>
                    <p className="text-slate-300 font-gilroy">Moins de 24h en moyenne</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold font-gilroy text-white mb-2">Accompagnement gratuit</h4>
                    <p className="text-slate-300 font-gilroy">Support complet jusqu'à l'inscription</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl opacity-5 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-gilroy text-white leading-tight mb-8">
              Rejoignez l'excellence
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mt-2">
                IUSO-SNE vous attend
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed font-gilroy">
              Plus de {IUSO_INFO.stats.graduates} diplômés nous font confiance. Rejoignez cette communauté d'excellence au Gabon.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button asChild size="lg" className="group bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/inscription" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                  Démarrer mon inscription
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="group border-2 border-white/60 bg-white/10 text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                <Link to="/login" className="flex items-center gap-2">
                  J'ai déjà un compte
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
            
            {/* Enhanced Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100">
              {[
                { icon: CheckCircle, text: "Inscription gratuite" },
                { icon: Shield, text: "Données sécurisées" },
                { icon: Award, text: "École reconnue" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 group cursor-pointer">
                  <item.icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-lg font-medium font-gilroy group-hover:text-white transition-colors duration-200">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 