import { useState, useMemo, useCallback, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  ChevronRight,
  Calendar,
  Briefcase,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Globe,
  Zap,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  MapPin,
  BookMarked
} from "lucide-react"
import { FILIERES, IUSO_INFO } from "@/lib/constants"
import { Link } from 'react-router-dom'

type SortOption = 'name' | 'duration' | 'category'
type SortDirection = 'asc' | 'desc'

const FormationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredFormation, setHoveredFormation] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // Grouper les formations par catégorie avec useMemo pour optimiser les performances
  const formationsByCategory = useMemo(() => {
    return FILIERES.reduce((acc, formation) => {
      const category = formation.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(formation)
      return acc
    }, {} as Record<string, typeof FILIERES[number][]>)
  }, [])

  const categories = useMemo(() => ['all', ...Object.keys(formationsByCategory)], [formationsByCategory])
  
  // Filtrer et trier les formations de manière optimisée
  const filteredAndSortedFormations = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? FILIERES 
      : FILIERES.filter(f => f.category === selectedCategory)
    
    // Filtrage par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(formation => 
        formation.label.toLowerCase().includes(query) ||
        formation.description.toLowerCase().includes(query) ||
        formation.category.toLowerCase().includes(query)
      )
    }

    // Tri
    const sortedFiltered = [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.label.localeCompare(b.label)
          break
        case 'duration':
          const getDurationValue = (duration: string) => {
            const match = duration.match(/\d+/)
            return match ? parseInt(match[0]) : 0
          }
          comparison = getDurationValue(a.duration) - getDurationValue(b.duration)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sortedFiltered
  }, [selectedCategory, searchQuery, sortBy, sortDirection])

  // Handlers optimisés avec useCallback
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setAnimationKey(prev => prev + 1)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setAnimationKey(prev => prev + 1)
  }, [])

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('asc')
    }
    setAnimationKey(prev => prev + 1)
  }, [sortBy])

  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case 'DUT': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      case 'Licence Fondamentale': return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
      case 'Licence Professionnelle': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
      case 'Master': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
    }
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'DUT': return <BookOpen className="h-4 w-4" />
      case 'Licence Fondamentale': return <GraduationCap className="h-4 w-4" />
      case 'Licence Professionnelle': return <Briefcase className="h-4 w-4" />
      case 'Master': return <Award className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }, [])

  // Animations d'entrée staggerées
  useEffect(() => {
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.formation-card')
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in-up')
        }, index * 100)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [animationKey])

  const admissionInfo = {
    'DUT': {
      title: 'Admission en DUT',
      process: 'Concours d\'entrée',
      requirements: ['Baccalauréat ou équivalent', 'Dossier de candidature complet', 'Réussir le concours d\'entrée'],
      duration: '2 ans',
      credits: '120 ECTS',
      color: 'blue'
    },
    'Licence Fondamentale': {
      title: 'Admission en Licence',
      process: 'Traitement de dossier',
      requirements: ['DUT ou équivalent (Bac+2)', 'Dossier académique', 'Entretien de motivation'],
      duration: '3 ans',
      credits: '180 ECTS',
      color: 'emerald'
    },
    'Licence Professionnelle': {
      title: 'Admission en Licence Pro',
      process: 'Traitement de dossier',
      requirements: ['DUT ou L2 validé', 'Expérience professionnelle souhaitée', 'Projet professionnel défini'],
      duration: '1 an',
      credits: '60 ECTS',
      color: 'purple'
    },
    'Master': {
      title: 'Admission en Master',
      process: 'Traitement de dossier',
      requirements: ['Licence ou équivalent (Bac+3)', 'Excellent dossier académique', 'Entretien de sélection'],
      duration: '2 ans',
      credits: '120 ECTS',
      color: 'orange'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-24 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center text-white">
            {/* Breadcrumbs */}
            <nav className="mb-8">
              <ol className="flex items-center justify-center gap-2 text-blue-100 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><ChevronRight className="h-4 w-4" /></li>
                <li className="text-white font-medium">Formations</li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-semibold font-gilroy mb-8 shadow-lg hover:bg-white/25 transition-all duration-300">
              <GraduationCap className="h-4 w-4" />
              Formations IUSO-SNE
              <Badge className="bg-yellow-400 text-yellow-900 ml-2">
                {FILIERES.length} formations
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight mb-8 animate-fade-in">
              <span className="block">Découvrez nos</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mt-2">
                formations d'excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12 font-gilroy animate-fade-in-up">
              Du DUT au Master, choisissez la formation qui correspond à vos ambitions professionnelles dans les sciences de l'organisation.
            </p>

            {/* Enhanced Search and Filter Section - Moved to Hero */}
            <div className="max-w-5xl mx-auto mb-12 animate-fade-in-up">
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher une formation (nom, description, catégorie)..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 pr-4 py-4 text-lg font-gilroy rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl text-slate-900 placeholder:text-slate-500 focus:ring-4 focus:ring-white/30 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category)}
                    className={`font-gilroy transition-all duration-300 transform hover:scale-105 border-2 ${
                      selectedCategory === category 
                        ? 'bg-white text-blue-600 shadow-lg border-white' 
                        : 'border-white/60 bg-white/10 text-white hover:bg-white/20 hover:border-white hover:shadow-md backdrop-blur-sm'
                    }`}
                  >
                    {category === 'all' ? (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Toutes ({FILIERES.length})
                      </>
                    ) : (
                      <>
                        {getCategoryIcon(category)}
                        <span className="ml-2">
                          {category} ({formationsByCategory[category]?.length || 0})
                        </span>
                      </>
                    )}
                  </Button>
                ))}
              </div>

              {/* Sort Options and Results Counter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-100 font-gilroy">Trier par:</span>
                  <div className="flex gap-1">
                    {[
                      { value: 'name', label: 'Nom' },
                      { value: 'duration', label: 'Durée' },
                      { value: 'category', label: 'Type' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleSortChange(option.value as SortOption)}
                        className={`font-gilroy text-xs transition-all duration-300 ${
                          sortBy === option.value 
                            ? 'bg-white text-blue-600' 
                            : 'text-blue-100 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Results Counter */}
                <div className="text-center">
                  <p className="text-blue-100 font-gilroy">
                    <span className="font-semibold text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      {filteredAndSortedFormations.length}
                    </span>
                    <span className="ml-2">
                      {filteredAndSortedFormations.length === 1 ? 'formation trouvée' : 'formations trouvées'}
                    </span>
                    {searchQuery && (
                      <span className="block text-sm mt-1">
                        pour "<span className="font-semibold text-yellow-300">{searchQuery}</span>"
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <Link to="/inscription" className="flex items-center gap-2">
                  <Star className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Candidater maintenant
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: Object.keys(formationsByCategory).length, label: 'Types de formation', icon: <BookOpen className="h-6 w-6" /> },
              { number: FILIERES.length, label: 'Spécialisations', icon: <Target className="h-6 w-6" /> },
              { number: IUSO_INFO.stats.graduates, label: 'Diplômés', icon: <Users className="h-6 w-6" /> },
              { number: IUSO_INFO.stats.insertionRate, label: 'Insertion pro', icon: <TrendingUp className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gradient-to-t hover:from-blue-50 hover:to-transparent transition-all duration-300 group cursor-pointer">
                <div className="flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-gilroy text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {typeof stat.number === 'string' && stat.number.includes('%') ? stat.number : `${stat.number}+`}
                </div>
                <div className="text-sm text-slate-600 font-gilroy">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Formations Grid */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {filteredAndSortedFormations.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-gilroy text-slate-600 mb-2">
                    Aucune formation trouvée
                  </h3>
                  <p className="text-slate-500 font-gilroy mb-6">
                    Essayez de modifier vos critères de recherche ou explorez toutes nos formations.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="font-gilroy"
                  >
                    Voir toutes les formations
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Section Title */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-gilroy text-slate-900 mb-4">
                    {selectedCategory === 'all' ? 'Nos formations' : `Formations ${selectedCategory}`}
                  </h2>
                  <p className="text-slate-600 font-gilroy max-w-2xl mx-auto">
                    Explorez nos programmes d'excellence conçus pour votre réussite professionnelle
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAndSortedFormations.map((formation, index) => (
                    <Card 
                      key={`${formation.value}-${animationKey}`}
                      className="formation-card group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full cursor-pointer overflow-hidden transform hover:-translate-y-2 opacity-0"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onMouseEnter={() => setHoveredFormation(index)}
                      onMouseLeave={() => setHoveredFormation(null)}
                    >
                      <CardContent className="p-8 h-full flex flex-col relative">
                        {/* Enhanced Background Animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Header with Enhanced Interactions */}
                        <div className="flex items-center justify-between mb-6 relative z-10">
                          <Badge 
                            className={`${getCategoryColor(formation.category)} font-gilroy border transition-all duration-300 cursor-pointer`}
                            onClick={() => handleCategoryChange(formation.category)}
                          >
                            {getCategoryIcon(formation.category)}
                            <span className="ml-1">{formation.category}</span>
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className="text-slate-500 text-sm font-medium font-gilroy">
                              {formation.duration}
                            </div>
                            {/* Quick Action Buttons */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                                <Heart className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold font-gilroy text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {formation.label}
                          </h3>
                          
                          <p className="text-slate-600 leading-relaxed font-gilroy mb-6 flex-grow">
                            {formation.description}
                          </p>
                          
                          {/* Enhanced Formation Details */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Award className="h-4 w-4 text-blue-500" />
                              <span className="font-gilroy font-medium">{formation.credits}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Clock className="h-4 w-4 text-emerald-500" />
                              <span className="font-gilroy">Durée: {formation.duration}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <MapPin className="h-4 w-4 text-purple-500" />
                              <span className="font-gilroy">Campus principal</span>
                            </div>
                          </div>
                          
                          {/* Enhanced CTA Button */}
                          <div className="mt-auto space-y-3">
                            <Button 
                              asChild
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-gilroy transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                            >
                              <Link to="/inscription" className="flex items-center justify-center gap-2">
                                <BookMarked className="h-4 w-4" />
                                Candidater
                                {hoveredFormation === index && (
                                  <ArrowRight className="h-4 w-4 animate-bounce" />
                                )}
                              </Link>
                            </Button>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 font-gilroy text-xs hover:bg-blue-50"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Détails
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 font-gilroy text-xs hover:bg-emerald-50"
                              >
                                <Building className="h-3 w-3 mr-1" />
                                Programme
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Hover Indicators */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Admission Process Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-gilroy text-slate-900 mb-6">
                Processus d'admission
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-gilroy">
                Découvrez les modalités d'admission pour chaque niveau de formation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {Object.entries(admissionInfo).map(([category, info], index) => (
                <Card key={category} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${info.color}-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-gilroy text-slate-900 group-hover:text-blue-600 transition-colors">
                          {info.title}
                        </h3>
                        <p className="text-slate-600 font-gilroy flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          {info.process}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-gilroy">Durée</p>
                          <p className="font-semibold font-gilroy text-slate-700">{info.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                        <Award className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-gilroy">Crédits</p>
                          <p className="font-semibold font-gilroy text-slate-700">{info.credits}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold font-gilroy text-slate-900 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Prérequis
                      </h4>
                      <ul className="space-y-3">
                        {info.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-slate-600 font-gilroy text-sm leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold font-gilroy leading-tight mb-8">
              Prêt à rejoindre l'IUSO-SNE ?
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed font-gilroy">
              Choisissez votre formation et commencez votre parcours vers l'excellence académique et professionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <Link to="/inscription" className="flex items-center gap-3">
                  <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Candidater maintenant
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-white/60 bg-white/10 text-white hover:bg-white hover:text-blue-600 px-12 py-5 text-lg font-semibold font-gilroy rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm group">
                <Link to="/contact" className="flex items-center gap-3">
                  Nous contacter
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FormationsPage 