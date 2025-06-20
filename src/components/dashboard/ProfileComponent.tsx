import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useCandidatData } from "@/hooks/useCandidatData"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Save,
  Edit3,
  Check,
  X,
  Camera,
  Upload,
  Star,
  Award,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Download,
  Share,
  Settings,
  Lock,
  Unlock,
  UserCheck,
  GraduationCap,
  Building,
  Globe,
  Heart,
  Zap
} from "lucide-react"

const ProfileComponent = () => {
  const { data: candidat, loading } = useCandidatData()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    if (candidat) {
      setFormData({
        firstName: candidat.firstName || '',
        lastName: candidat.lastName || '',
        phone: candidat.phone || '',
        address: candidat.address || '',
        bio: candidat.bio || ''
      })
    }
  }, [candidat])

  const handleFieldEdit = (field: string) => {
    setEditingField(field)
  }

  const handleFieldSave = (field: string) => {
    // Save logic here
    setEditingField(null)
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    // Reset form data
    if (candidat) {
      setFormData({
        firstName: candidat.firstName || '',
        lastName: candidat.lastName || '',
        phone: candidat.phone || '',
        address: candidat.address || '',
        bio: candidat.bio || ''
      })
    }
  }

  const getCompletionScore = () => {
    const fields = ['firstName', 'lastName', 'phone', 'address', 'studyField']
    const filledFields = fields.filter(field => candidat?.[field])
    return Math.round((filledFields.length / fields.length) * 100)
  }

  const getProfileStrength = () => {
    const score = getCompletionScore()
    if (score >= 90) return { level: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
    if (score >= 70) return { level: 'Bon', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 50) return { level: 'Moyen', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: 'Faible', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  type FieldType = {
    key: string;
    label: string;
    icon: any;
    type: string;
    required?: boolean;
    readonly?: boolean;
  }

  const profileSections = [
    {
      id: 'personal',
      title: 'Informations personnelles',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      fields: [
        { key: 'firstName', label: 'Prénom', icon: User, type: 'text', required: true },
        { key: 'lastName', label: 'Nom', icon: User, type: 'text', required: true },
        { key: 'phone', label: 'Téléphone', icon: Phone, type: 'tel', required: true },
        { key: 'address', label: 'Adresse', icon: MapPin, type: 'text', required: true }
      ] as FieldType[]
    },
    {
      id: 'academic',
      title: 'Parcours académique',
      icon: GraduationCap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      fields: [
        { key: 'studyField', label: 'Filière d\'études', icon: BookOpen, type: 'text', readonly: true },
        { key: 'studyCycle', label: 'Cycle d\'études', icon: Award, type: 'text', readonly: true }
      ] as FieldType[]
    },
    {
      id: 'account',
      title: 'Compte et sécurité',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      fields: [
        { key: 'email', label: 'Email', icon: Mail, type: 'email', readonly: true },
        { key: 'matricule', label: 'Matricule', icon: UserCheck, type: 'text', readonly: true },
        { key: 'createdAt', label: 'Membre depuis', icon: Calendar, type: 'date', readonly: true }
      ] as FieldType[]
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-white rounded-3xl shadow-lg"></div>
        <div className="h-96 bg-white rounded-3xl shadow-lg"></div>
      </div>
    )
  }

  const completionScore = getCompletionScore()
  const profileStrength = getProfileStrength()

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header minimaliste */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold font-gilroy text-slate-900 mb-1">
            {candidat?.firstName && candidat?.lastName 
              ? `${candidat.firstName} ${candidat.lastName}` 
              : 'Mon Profil'}
          </h1>
          <p className="text-slate-500 text-sm">
            Profil {profileStrength.level.toLowerCase()} • {completionScore}% complété
          </p>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-in-right">
          <Button 
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showSensitiveData ? 'Masquer' : 'Afficher'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Avatar et progression */}
      <Card className="border-slate-200/60 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors duration-200">
                <span className="text-xl font-bold text-slate-700">
                  {candidat?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0 border-slate-200 bg-white hover:bg-slate-50"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Progression du profil</span>
                <span className="text-sm font-semibold text-slate-900">{completionScore}%</span>
              </div>
              <Progress value={completionScore} className="h-2 bg-slate-100" />
              <p className="text-xs text-slate-500 mt-2">
                {getCompletionScore() >= 90 ? 'Profil excellent' : 
                 getCompletionScore() >= 70 ? 'Profil bien complété' : 
                 'Complétez votre profil pour améliorer votre candidature'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="grid gap-8">
        {profileSections.map((section, sectionIndex) => (
          <Card 
            key={section.id} 
            className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up"
            style={{ animationDelay: `${0.2 + sectionIndex * 0.1}s` }}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-200`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold font-gilroy text-slate-900 group-hover:text-slate-700 transition-colors duration-200">
                      {section.title}
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      {section.fields.filter(f => candidat?.[f.key] || (f.key === 'email' && user?.email)).length}/{section.fields.length} champs complétés
                    </p>
                  </div>
                </div>
                
                {section.id === 'personal' && (
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    size="sm"
                    className={`transition-all duration-200 ${
                      isEditing 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modifier
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {section.fields.map((field, fieldIndex) => {
                  const value = field.key === 'email' ? (candidat?.email || user?.email) :
                               field.key === 'matricule' ? (candidat?.matricule || 'Non attribué') :
                               field.key === 'createdAt' ? (candidat?.createdAt ? new Date(candidat.createdAt).toLocaleDateString('fr-FR') : 'Non défini') :
                               candidat?.[field.key] || ''
                  
                  const isEditable = !field.readonly && section.id === 'personal' && isEditing
                  const isCurrentlyEditing = editingField === field.key
                  const hasValue = value && value !== 'Non attribué' && value !== 'Non défini'

                  return (
                    <div 
                      key={field.key} 
                      className={`space-y-2 p-3 rounded-lg transition-all duration-200 hover:bg-slate-50/50 animate-slide-in-up ${
                        isCurrentlyEditing ? 'bg-blue-50/50 border border-blue-200' : 'border border-transparent'
                      }`}
                      style={{ animationDelay: `${0.3 + fieldIndex * 0.03}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-slate-700 font-gilroy flex items-center gap-2">
                          <field.icon className="h-4 w-4 text-slate-500" />
                          {field.label}
                          {field.required && <span className="text-red-500 text-xs">*</span>}
                        </Label>
                        
                        <div className="flex items-center gap-1">
                          {hasValue && (
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          )}
                          
                          {isEditable && !isCurrentlyEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFieldEdit(field.key)}
                              className="h-6 w-6 p-0 hover:bg-blue-100 text-slate-400 hover:text-blue-600"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {isCurrentlyEditing && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleFieldSave(field.key)}
                                className="h-6 w-6 p-0 hover:bg-green-100 text-green-600"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleFieldCancel}
                                className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isCurrentlyEditing ? (
                        <Input
                          type={field.type}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                          className="h-9 text-sm font-gilroy focus:border-blue-300 focus:ring-blue-100"
                          placeholder={`Entrez votre ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div className={`${field.readonly ? 'bg-slate-50/50' : ''} rounded-md p-2 text-sm group/field`}>
                          <div className="flex items-center justify-between">
                            <span className={`font-gilroy ${hasValue ? 'text-slate-900' : 'text-slate-500'}`}>
                              {showSensitiveData || !['phone', 'address'].includes(field.key) 
                                ? value || `Non renseigné${field.required ? ' (requis)' : ''}`
                                : '••••••••••'
                              }
                            </span>
                            
                            {hasValue && ['phone', 'email'].includes(field.key) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                                onClick={() => navigator.clipboard.writeText(value)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          {field.readonly && field.key === 'studyField' && (
                            <p className="text-xs text-slate-500 mt-1">
                              Modifiez depuis{' '}
                              <Link to="/formations" className="text-blue-600 hover:underline font-medium">
                                Formations
                              </Link>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card className="border-slate-200/60 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-slate-500" />
            Actions rapides
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Télécharger CV', icon: Download },
              { label: 'Partager profil', icon: Share },
              { label: 'Modifier photo', icon: Camera },
              { label: 'Paramètres', icon: Settings }
            ].map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="h-16 flex-col gap-2 hover:bg-slate-50 transition-all duration-200 border-slate-200 text-slate-600 hover:text-slate-900"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileComponent 