import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Zap
} from "lucide-react"
import { FILIERES, IUSO_INFO } from "@/lib/constants"
import { Link } from 'react-router-dom'

const FormationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredFormation, setHoveredFormation] = useState<number | null>(null)

  // Grouper les formations par catégorie
  const formationsByCategory = FILIERES.reduce((acc, formation) => {
    const category = formation.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(formation)
    return acc
  }, {} as Record<string, typeof FILIERES[number][]>)

  const categories = ['all', ...Object.keys(formationsByCategory)]
  
  const filteredFormations = selectedCategory === 'all' 
    ? FILIERES 
    : FILIERES.filter(f => f.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DUT': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Licence Fondamentale': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Licence Professionnelle': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Master': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DUT': return <BookOpen className="h-4 w-4" />
      case 'Licence Fondamentale': return <GraduationCap className="h-4 w-4" />
      case 'Licence Professionnelle': return <Briefcase className="h-4 w-4" />
      case 'Master': return <Award className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const admissionInfo = {
    'DUT': {
      title: 'Admission en DUT',
      process: 'Concours d\'entrée',
      requirements: ['Baccalauréat ou équivalent', 'Dossier de candidature complet', 'Réussir le concours d\'entrée'],
      duration: '2 ans',
      credits: '120 ECTS'
    },
    'Licence Fondamentale': {
      title: 'Admission en Licence',
      process: 'Traitement de dossier',
      requirements: ['DUT ou équivalent (Bac+2)', 'Dossier académique', 'Entretien de motivation'],
      duration: '3 ans',
      credits: '180 ECTS'
    },
    'Licence Professionnelle': {
      title: 'Admission en Licence Pro',
      process: 'Traitement de dossier',
      requirements: ['DUT ou L2 validé', 'Expérience professionnelle souhaitée', 'Projet professionnel défini'],
      duration: '1 an',
      credits: '60 ECTS'
    },
    'Master': {
      title: 'Admission en Master',
      process: 'Traitement de dossier',
      requirements: ['Licence ou équivalent (Bac+3)', 'Excellent dossier académique', 'Entretien de sélection'],
      duration: '2 ans',
      credits: '120 ECTS'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-24 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-semibold font-gilroy mb-8 shadow-lg">
              <GraduationCap className="h-4 w-4" />
              Formations IUSO-SNE
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight mb-8">
              <span className="block">Découvrez nos</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mt-2">
                formations d'excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12 font-gilroy">
              Du DUT au Master, choisissez la formation qui correspond à vos ambitions professionnelles dans les sciences de l'organisation.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link to="/inscription" className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Candidater maintenant
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: Object.keys(formationsByCategory).length, label: 'Types de formation', icon: <BookOpen className="h-6 w-6" /> },
              { number: FILIERES.length, label: 'Spécialisations', icon: <Target className="h-6 w-6" /> },
              { number: IUSO_INFO.stats.graduates, label: 'Diplômés', icon: <Users className="h-6 w-6" /> },
              { number: IUSO_INFO.stats.insertionRate, label: 'Insertion pro', icon: <Briefcase className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300 group">
                <div className="flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-gilroy text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-gilroy">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-gilroy text-slate-900 text-center mb-12">
              Explorez nos formations par niveau
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-gilroy transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white shadow-lg scale-105' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {category === 'all' ? (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Toutes les formations
                    </>
                  ) : (
                    <>
                      {getCategoryIcon(category)}
                      <span className="ml-2">{category}</span>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFormations.map((formation, index) => (
                <Card 
                  key={formation.value}
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full cursor-pointer overflow-hidden animate-fade-in transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredFormation(index)}
                  onMouseLeave={() => setHoveredFormation(null)}
                >
                  <CardContent className="p-8 h-full flex flex-col relative">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <Badge className={`${getCategoryColor(formation.category)} font-gilroy border`}>
                        {getCategoryIcon(formation.category)}
                        <span className="ml-1">{formation.category}</span>
                      </Badge>
                      <div className="text-slate-500 text-sm font-medium font-gilroy">
                        {formation.duration}
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold font-gilroy text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {formation.label}
                      </h3>
                      
                      <p className="text-slate-600 leading-relaxed font-gilroy mb-6 flex-grow">
                        {formation.description}
                      </p>
                      
                      {/* Formation Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="font-gilroy">{formation.credits}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <span className="font-gilroy">Durée: {formation.duration}</span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-auto">
                        <Button 
                          asChild
                          variant="outline" 
                          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 font-gilroy"
                        >
                          <Link to="/inscription" className="flex items-center justify-center gap-2">
                            Candidater
                            {hoveredFormation === index && (
                              <ArrowRight className="h-4 w-4 animate-bounce" />
                            )}
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process Section */}
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

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(admissionInfo).map(([category, info], index) => (
                <Card key={category} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(category).replace('text-', 'text-white bg-').replace('bg-', 'bg-').split(' ')[0]}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-gilroy text-slate-900">
                          {info.title}
                        </h3>
                        <p className="text-slate-600 font-gilroy">
                          {info.process}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-gilroy text-slate-700">Durée: {info.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-emerald-500" />
                        <span className="font-gilroy text-slate-700">Crédits: {info.credits}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold font-gilroy text-slate-900">Prérequis :</h4>
                      <ul className="space-y-2">
                        {info.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-slate-600 font-gilroy text-sm">{req}</span>
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
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
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link to="/inscription" className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Candidater maintenant
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-white/60 bg-white/10 text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold font-gilroy rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                <Link to="/contact" className="flex items-center gap-2">
                  Nous contacter
                  <ChevronRight className="h-5 w-5" />
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