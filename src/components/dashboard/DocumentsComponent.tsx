import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Camera,
  GraduationCap,
  Trash2,
  RotateCcw,
  Clock,
  Shield,
  FileCheck,
  FileX,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  User,
  Star,
  Archive,
  FolderOpen,
  Paperclip,
  FileImage,
  FileType,
  Dot,
  Info,
  Settings,
  ChevronDown,
  X,
  RefreshCw
} from "lucide-react"
import { useDocumentsStatus } from "@/hooks/useDocumentsStatus"

const typeToIcon = {
  photo: Camera,
  bacAttestation: GraduationCap,
  birthCertificate: FileText,
  idCard: FileImage,
  transcript: FileText,
  diploma: FileType
} as const

const DocumentsComponent = () => {
  const documents = useDocumentsStatus()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterStatus, setFilterStatus] = useState<'all' | 'uploaded' | 'pending' | 'required'>('all')
  const [hoveredDoc, setHoveredDoc] = useState<number | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = (() => {
      switch (filterStatus) {
        case 'uploaded': return doc.uploaded
        case 'pending': return !doc.uploaded
        case 'required': return doc.required
        default: return true
      }
    })()
    
    return matchesSearch && matchesFilter
  })

  const uploadedCount = documents.filter(d => d.uploaded).length
  const requiredCount = documents.filter(d => d.required).length
  const completionRate = Math.round((uploadedCount / documents.length) * 100)

  const getStatusStyle = (doc: any) => {
    if (doc.uploaded) return 'border-l-emerald-400 bg-gradient-to-r from-emerald-50/40 to-transparent'
    if (doc.required) return 'border-l-amber-400 bg-gradient-to-r from-amber-50/40 to-transparent'
    return 'border-l-slate-300 bg-white'
  }

  const getStatusBadge = (doc: any) => {
    if (doc.uploaded) return { 
      text: 'Validé', 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      icon: CheckCircle 
    }
    if (doc.required) return { 
      text: 'Requis', 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      icon: AlertCircle 
    }
    return { 
      text: 'Optionnel', 
      color: 'bg-slate-50 text-slate-600 border-slate-200', 
      icon: Clock 
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    console.log('Files dropped:', files)
    // Ici on pourrait traiter les fichiers
  }

  const filters = [
    { id: 'all', label: 'Tous', count: documents.length, icon: FolderOpen },
    { id: 'uploaded', label: 'Validés', count: uploadedCount, icon: CheckCircle },
    { id: 'pending', label: 'En attente', count: documents.length - uploadedCount, icon: Clock },
    { id: 'required', label: 'Requis', count: requiredCount, icon: AlertCircle }
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header avec statistiques intégrées */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="animate-slide-in-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-gilroy text-slate-900">Documents</h1>
              <p className="text-sm text-slate-500">
                Gérez vos pièces justificatives
              </p>
            </div>
          </div>
          
          {/* Mini statistiques */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-slate-600">{uploadedCount} validés</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-slate-600">{documents.length - uploadedCount} en attente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span className="text-slate-600">{completionRate}% complété</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-in-right">
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-600 hover:bg-slate-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Options
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Barre de progression élégante */}
      <Card className="border-slate-200/60 shadow-sm animate-fade-in-up overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-0">
          <div className="relative">
            <Progress value={completionRate} className="h-3 bg-slate-100 rounded-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-700 mix-blend-difference">
                {completionRate}% complété
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles avancés */}
      {showFilters && (
        <Card className="border-slate-200/60 shadow-sm animate-fade-in-up bg-slate-50/30" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 space-y-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Filtres */}
              <div className="flex gap-1 overflow-x-auto">
                {filters.map((filter, index) => {
                  const FilterIcon = filter.icon
                  return (
                    <Button
                      key={filter.id}
                      variant={filterStatus === filter.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterStatus(filter.id as any)}
                      className={`flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                        filterStatus === filter.id 
                          ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      } animate-slide-in-left`}
                      style={{ animationDelay: `${0.05 + index * 0.02}s` }}
                    >
                      <FilterIcon className="h-3.5 w-3.5" />
                      <span className="text-sm">{filter.label}</span>
                      {filter.count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          filterStatus === filter.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {filter.count}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>

              {/* Toggle vue */}
              <div className="flex items-center gap-1 bg-white/60 rounded-lg p-1 border border-slate-200">
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 px-3 ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-white/80 text-slate-600'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-white/80 text-slate-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zone de dépôt interactive */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 animate-fade-in-up cursor-pointer group ${
          dragActive 
            ? 'border-blue-400 bg-blue-50/60 shadow-md scale-[1.02]' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-sm'
        }`}
        style={{ animationDelay: '0.3s' }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {/* Ouvrir sélecteur de fichiers */}}
      >
        <CardContent className="p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            dragActive ? 'bg-blue-100 scale-110' : 'bg-slate-100 group-hover:bg-slate-200'
          }`}>
            <Upload className={`h-6 w-6 transition-all duration-300 ${
              dragActive ? 'text-blue-600 scale-110' : 'text-slate-500 group-hover:text-slate-600'
            }`} />
          </div>
          <h3 className="text-base font-medium text-slate-900 mb-2">
            {dragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos documents'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            ou cliquez pour parcourir vos fichiers
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            <span className="bg-slate-100 px-2 py-1 rounded">PDF</span>
            <span className="bg-slate-100 px-2 py-1 rounded">JPG</span>
            <span className="bg-slate-100 px-2 py-1 rounded">PNG</span>
            <span className="bg-slate-100 px-2 py-1 rounded">Max 5MB</span>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      {filteredDocuments.length > 0 ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}`}>
          {filteredDocuments.map((document, index) => {
            const statusBadge = getStatusBadge(document)
            const StatusIcon = statusBadge.icon
            const DocIcon = typeToIcon[document.type as keyof typeof typeToIcon] || FileText

            return viewMode === 'grid' ? (
              // Vue grille améliorée
              <Card 
                key={document.id} 
                className={`border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-l-4 ${getStatusStyle(document)} animate-fade-in-up group overflow-hidden`}
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                onMouseEnter={() => setHoveredDoc(document.id)}
                onMouseLeave={() => setHoveredDoc(null)}
              >
                <CardContent className="p-5">
                  <div className="text-center mb-5">
                    <div className="relative w-14 h-14 mx-auto mb-4">
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                        <DocIcon className="h-7 w-7 text-slate-600 group-hover:text-slate-700 transition-colors duration-300" />
                      </div>
                      {document.uploaded && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <Badge variant="secondary" className={`${statusBadge.color} text-xs mb-3 border`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </Badge>
                    
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300 line-clamp-1">
                      {document.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {document.description}
                    </p>
                  </div>

                  <div className={`space-y-2 transition-all duration-300 ${
                    hoveredDoc === document.id ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-1'
                  }`}>
                    {document.uploaded ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium">
                        <Upload className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Vue liste améliorée
              <Card 
                key={document.id} 
                className={`border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 border-l-4 ${getStatusStyle(document)} animate-fade-in-up group`}
                style={{ animationDelay: `${0.4 + index * 0.03}s` }}
                onMouseEnter={() => setHoveredDoc(document.id)}
                onMouseLeave={() => setHoveredDoc(null)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                        <DocIcon className="h-5 w-5 text-slate-600 group-hover:text-slate-700 transition-colors duration-300" />
                      </div>
                      {document.uploaded && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors duration-300 truncate">
                          {document.name}
                        </h3>
                        <Badge variant="secondary" className={`${statusBadge.color} text-xs border flex-shrink-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {document.description}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-1 transition-all duration-300 ${
                      hoveredDoc === document.id ? 'opacity-100 translate-x-0' : 'opacity-60 translate-x-2'
                    }`}>
                      {document.uploaded ? (
                        <>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 font-medium">
                          <Upload className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        // État vide avec recherche
        <Card className="border-slate-200/60 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? 'Aucun document trouvé' : 'Aucun document'}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `Aucun document ne correspond à "${searchTerm}". Essayez un autre terme de recherche.`
                : 'Commencez par télécharger vos premiers documents.'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer la recherche
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Guide d'aide contextuel */}
      {documents.length > 0 && (
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-r from-slate-50/50 to-white animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Conseils pour vos documents
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Formats acceptés</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <Dot className="h-3 w-3 text-slate-400" />
                        <span>PDF (recommandé pour les documents officiels)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Dot className="h-3 w-3 text-slate-400" />
                        <span>JPG, PNG (pour les photos et documents scannés)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Bonnes pratiques</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <Dot className="h-3 w-3 text-slate-400" />
                        <span>Documents nets et bien cadrés</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Dot className="h-3 w-3 text-slate-400" />
                        <span>Taille maximale : 5 MB par fichier</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DocumentsComponent 