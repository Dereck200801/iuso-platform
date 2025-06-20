import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useFileUpload } from '../hooks/useFileUpload'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle, Sparkles, GraduationCap, Upload, FileText, Image, Eye, EyeOff } from "lucide-react"

// Listes de données
const VILLES_GABON = [
  'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Mouila', 'Lambaréné', 
  'Tchibanga', 'Koulamoutou', 'Makokou', 'Gamba', 'Ndendé', 'Mitzic',
  'Bitam', 'Okondja', 'Booué', 'Fougamou', 'Lastoursville', 'Omboué',
  'Mayumba', 'Mekambo', 'Minvoul', 'Cocobeach', 'Kango', 'Autre'
]

const PAYS = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola', 'Antigua-et-Barbuda', 'Arabie saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan',
  'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize', 'Bénin', 'Bhoutan', 'Biélorussie', 'Birmanie', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi',
  'Cambodge', 'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chine', 'Chypre', 'Colombie', 'Comores', 'Congo', 'Congo (RDC)', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', 'Côte d\'Ivoire', 'Croatie', 'Cuba',
  'Danemark', 'Djibouti', 'Dominique',
  'Égypte', 'Émirats arabes unis', 'Équateur', 'Érythrée', 'Espagne', 'Estonie', 'États-Unis', 'Éthiopie',
  'Fidji', 'Finlande', 'France',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana',
  'Haïti', 'Honduras', 'Hongrie',
  'Îles Marshall', 'Îles Salomon', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie',
  'Jamaïque', 'Japon', 'Jordanie',
  'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Koweït',
  'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Liberia', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 'Maroc', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Mozambique',
  'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège', 'Nouvelle-Zélande',
  'Oman', 'Ouganda', 'Ouzbékistan',
  'Pakistan', 'Palaos', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 'Pologne', 'Portugal',
  'Qatar',
  'République centrafricaine', 'République dominicaine', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
  'Saint-Kitts-et-Nevis', 'Saint-Marin', 'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Salvador', 'Samoa', 'São Tomé-et-Principe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède', 'Suisse', 'Suriname', 'Syrie',
  'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan', 'Turquie', 'Tuvalu',
  'Ukraine', 'Uruguay',
  'Vanuatu', 'Vatican', 'Venezuela', 'Viêt Nam',
  'Yémen',
  'Zambie', 'Zimbabwe'
]

const FILIERES_LICENCE = [
  'Management des Organisations',
  'Gestion des Ressources Humaines',
  'Économie et Finance',
  'Analyse Économique',
  'Droit des Affaires',
  'Droit Public',
  'Communication des Organisations'
]

const FILIERES_BTS = [
  'Carrières Juridiques et Judiciaires',
  'Gestion de l\'Information et de la Documentation'
]

// Schema de validation avec critères de mot de passe sécurisé
const inscriptionSchema = z.object({
  // Informations personnelles
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  genre: z.enum(['masculin', 'feminin', 'autre'], { 
    errorMap: () => ({ message: 'Le genre est requis' }) 
  }),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(1, 'Le lieu de naissance est requis'),
  nationalite: z.string().min(1, 'La nationalité est requise'),
  
  // Coordonnées
  email: z.string().email('L\'adresse email est invalide'),
  telephone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères'),
  adresse: z.string().min(5, 'L\'adresse complète est requise'),
  
  // Accès au compte
  mot_de_passe: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  confirmation_mot_de_passe: z.string(),
  
  // Formation
  cycle_etude: z.enum(['licence', 'bts'], {
    errorMap: () => ({ message: 'Le cycle d\'étude est requis' })
  }),
  filiere: z.string().min(1, 'La filière est requise'),
  
  // Documents
  photo_identite: z.any()
    .refine((files) => files?.length > 0, 'La photo d\'identité est requise')
    .refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, 'La photo ne doit pas dépasser 2 MB')
    .refine((files) => ['image/jpeg', 'image/png'].includes(files?.[0]?.type), 'Format accepté: JPEG, PNG'),
  
  attestation_bac: z.any()
    .refine((files) => files?.length > 0, 'L\'attestation du Baccalauréat est requise')
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, 'Le document ne doit pas dépasser 5 MB')
    .refine((files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type), 'Format accepté: PDF, JPEG, PNG'),
  
  // Acceptation
  acceptation_conditions: z.boolean().refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation')
}).refine((data) => data.mot_de_passe === data.confirmation_mot_de_passe, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmation_mot_de_passe"],
})

type InscriptionForm = z.infer<typeof inscriptionSchema>

const InscriptionPage = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState<'licence' | 'bts' | ''>('')
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Hook pour l'upload des fichiers
  const photoUpload = useFileUpload({
    bucket: 'pieces-candidats',
    folder: 'photos',
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png'] as const
  })
  
  const bacUpload = useFileUpload({
    bucket: 'pieces-candidats', 
    folder: 'attestations-bac',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'] as const
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch
  } = useForm<InscriptionForm>({
    resolver: zodResolver(inscriptionSchema),
  })

  // Effet pour gérer le countdown du rate limiting
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(rateLimitCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [rateLimitCountdown])

  const totalSteps = 5
  const stepTitles = [
    'Informations personnelles',
    'Coordonnées',
    'Accès au compte',
    'Choix de formation',
    'Documents et finalisation'
  ]

  const nextStep = async () => {
    let fieldsToValidate: (keyof InscriptionForm)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ['prenom', 'nom', 'genre', 'date_naissance', 'lieu_naissance', 'nationalite']
        break
      case 2:
        fieldsToValidate = ['email', 'telephone', 'adresse']
        break
      case 3:
        fieldsToValidate = ['mot_de_passe', 'confirmation_mot_de_passe']
        break
      case 4:
        fieldsToValidate = ['cycle_etude', 'filiere']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && step < totalSteps) {
      const newStep = step + 1
      console.log('Changing step from', step, 'to', newStep)
      setStep(newStep)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const onSubmit = async (data: InscriptionForm) => {
    setLoading(true)
    console.log('🔥 DEBUT FONCTION onSubmit - MODE DIRECT')
    console.log('🔥 Email soumis:', data.email)
    console.log('🔥 Aucun appel à auth.signUp() ne sera fait')
    console.log('🔥 Aucune insertion dans inscrits_temp ne sera faite')
    
    try {
      // 🚀 INSCRIPTION DIRECTE : Sans confirmation email
      console.log('🚀 Inscription directe activée')
      
      // 1. Vérifier si l'email existe déjà dans la table inscrits
      const { data: existingCandidate, error: checkError } = await supabase
        .from('inscrits')
        .select('email')
        .eq('email', data.email)
        .single()

      if (existingCandidate && !checkError) {
        throw new Error('Cette adresse email est déjà enregistrée pour une inscription. Veuillez utiliser une autre adresse.')
      }

      // 2. Générer un numéro de dossier unique
      const numeroDossier = `LIC${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`
      
      // 3. Créer un ID utilisateur temporaire
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 4. Upload de la photo d'identité
      const photoResult = await photoUpload.uploadFile(
        data.photo_identite[0], 
        `photo_${tempUserId}_${Date.now()}`
      )
      
      if (photoResult.error) {
        throw new Error(`Erreur upload photo: ${photoResult.error}`)
      }

      // 5. Upload de l'attestation du bac
      const bacResult = await bacUpload.uploadFile(
        data.attestation_bac[0], 
        `bac_${tempUserId}_${Date.now()}`
      )
      
      if (bacResult.error) {
        throw new Error(`Erreur upload attestation: ${bacResult.error}`)
      }

      // 6. Préparer les données pour insertion directe dans inscrits
      const inscriptionData = {
        numero_dossier: numeroDossier,
        email: data.email,
        prenom: data.prenom,
        nom: data.nom,
        genre: data.genre,
        date_naissance: data.date_naissance,
        lieu_naissance: data.lieu_naissance,
        nationalite: data.nationalite,
        telephone: data.telephone,
        adresse: data.adresse,
        cycle: data.cycle_etude === 'licence' ? 'licence1' : 'dut',
        filiere: data.filiere,
        mot_de_passe: data.mot_de_passe,
        photo_identite_url: photoResult.path,
        attestation_bac_url: bacResult.path,
        statut: 'en_attente_validation',
        email_verified_at: new Date().toISOString(),
        date_inscription: new Date().toISOString(),
        date_modification: new Date().toISOString()
      }

      // 7. Insérer directement dans la table inscrits
      console.log('🔥 INSERTION DIRECTE DANS INSCRITS - PAS DE AUTH.SIGNUP')
      console.log('🔥 Données à insérer:', { email: inscriptionData.email, numero_dossier: inscriptionData.numero_dossier })
      
      const { data: insertResult, error: insertError } = await supabase
        .from('inscrits')
        .insert(inscriptionData)
        .select()

      if (insertError) {
        console.error('Erreur insertion dans inscrits:', insertError)
        throw new Error(`Erreur lors de l'enregistrement: ${insertError.message}`)
      }

console.log('🔥 SUCCÈS INSERTION DIRECTE dans INSCRITS !')
      console.log('✅ Inscription enregistrée directement:', insertResult)
      console.log('🔥 AUCUN COMPTE AUTH CRÉÉ - AUCUNE DONNÉE dans INSCRITS_TEMP')

      // 8. Nettoyer les données temporaires (au cas où)
      try {
        await supabase
          .from('inscrits_temp')
          .delete()
          .eq('data->email', data.email)
      } catch (cleanupError) {
        console.log('Info: Nettoyage données temporaires')
      }

      // 9. Message de succès
      toast({
        title: '🎉 Inscription réussie !',
        description: `✅ Votre inscription a été enregistrée avec succès !
        
📋 Numéro de dossier : ${numeroDossier}
        
🚀 Redirection vers votre espace candidat...`,
        variant: 'success',
      })

      // 10. Redirection vers la page de confirmation
      navigate('/confirmation', { 
        state: { 
          message: `Inscription finalisée avec succès ! Votre candidature est maintenant enregistrée.`,
          email: data.email,
          numeroDossier: numeroDossier,
          needsEmailVerification: false,
          inscriptionComplete: true
        }
      })
      
    } catch (error: any) {
      console.error('🔥 ERREUR DANS onSubmit DIRECT:', error)
      console.error('🔥 Cette erreur vient du nouveau code DIRECT (pas de auth.signUp)')
      toast({
        title: '❌ Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    console.log('Rendering step:', step, 'Title:', stepTitles[step - 1])
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-slate-900 font-gilroy font-semibold">Concours d'entrée L1 & BTS</AlertTitle>
              <AlertDescription className="text-slate-600 font-gilroy">
                Ce formulaire concerne l'inscription au concours d'entrée pour :
                <br />• <strong>Licence L1</strong> (1ère année de Licence)
                <br />• <strong>BTS 1ère année</strong>
                <br /><br />L'admission se fait par concours écrit. Les candidats retenus seront convoqués pour les épreuves.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="prenom" className="text-slate-700 font-gilroy font-medium">Prénom *</Label>
                <Input 
                  id="prenom" 
                  {...register('prenom')} 
                  className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                />
                {errors.prenom && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.prenom.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="nom" className="text-slate-700 font-gilroy font-medium">Nom *</Label>
                <Input 
                  id="nom" 
                  {...register('nom')} 
                  className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                />
                {errors.nom && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.nom.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="genre" className="text-slate-700 font-gilroy font-medium">Genre *</Label>
                <select
                  id="genre"
                  {...register('genre')}
                  className="h-12 w-full bg-white/50 border border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 px-3 text-slate-900"
                >
                  <option value="">Sélectionner</option>
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                  <option value="autre">Autre</option>
                </select>
                {errors.genre && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.genre.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="date_naissance" className="text-slate-700 font-gilroy font-medium">Date de naissance *</Label>
                <Input 
                  id="date_naissance" 
                  type="date" 
                  {...register('date_naissance')} 
                  className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                />
                {errors.date_naissance && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.date_naissance.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="lieu_naissance" className="text-slate-700 font-gilroy font-medium">Lieu de naissance *</Label>
                <select
                  id="lieu_naissance"
                  {...register('lieu_naissance')}
                  className="h-12 w-full bg-white/50 border border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 px-3 text-slate-900"
                >
                  <option value="">Sélectionner une ville</option>
                  {VILLES_GABON.map((ville) => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
                {errors.lieu_naissance && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.lieu_naissance.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="nationalite" className="text-slate-700 font-gilroy font-medium">Nationalité *</Label>
                <select
                  id="nationalite"
                  {...register('nationalite')}
                  className="h-12 w-full bg-white/50 border border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 px-3 text-slate-900"
                >
                  <option value="">Sélectionner un pays</option>
                  {PAYS.map((pays) => (
                    <option key={pays} value={pays}>{pays}</option>
                  ))}
                </select>
                {errors.nationalite && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.nationalite.message}</p>
                )}
              </div>
            </div>

            <Alert className="border-amber-200 bg-amber-50/50 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-slate-900 font-gilroy font-semibold">Prérequis</AlertTitle>
              <AlertDescription className="text-slate-600 font-gilroy">
                <strong>Pour Licence L1 :</strong> Être titulaire du Baccalauréat ou équivalent
                <br /><strong>Pour BTS :</strong> Être titulaire du Baccalauréat ou équivalent
              </AlertDescription>
            </Alert>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 font-gilroy font-medium">Email * <span className="text-sm text-slate-500">(servira d'identifiant)</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email')} 
                  className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                  placeholder="votre.email@exemple.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="telephone" className="text-slate-700 font-gilroy font-medium">Téléphone *</Label>
                <Input 
                  id="telephone" 
                  type="tel" 
                  {...register('telephone')} 
                  className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                  placeholder="+241 XX XX XX XX"
                />
                {errors.telephone && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.telephone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="adresse" className="text-slate-700 font-gilroy font-medium">Adresse complète *</Label>
              <Input 
                id="adresse" 
                {...register('adresse')} 
                className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20" 
                placeholder="Numéro, rue, quartier, ville..."
              />
              {errors.adresse && (
                <p className="text-sm text-red-600 font-gilroy">{errors.adresse.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-slate-900 font-gilroy font-semibold">Sécurité du compte</AlertTitle>
              <AlertDescription className="text-slate-600 font-gilroy">
                Votre mot de passe doit contenir au moins 8 caractères avec :
                <br />• Une lettre minuscule • Une lettre majuscule • Un chiffre • Un caractère spécial (@$!%*?&)
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <Label htmlFor="mot_de_passe" className="text-slate-700 font-gilroy font-medium">Mot de passe *</Label>
                <div className="relative">
                  <Input 
                    id="mot_de_passe" 
                    type={showPassword ? "text" : "password"}
                    {...register('mot_de_passe')} 
                    className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.mot_de_passe && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.mot_de_passe.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmation_mot_de_passe" className="text-slate-700 font-gilroy font-medium">Confirmation du mot de passe *</Label>
                <div className="relative">
                  <Input 
                    id="confirmation_mot_de_passe" 
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmation_mot_de_passe')} 
                    className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmation_mot_de_passe && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.confirmation_mot_de_passe.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="cycle_etude" className="text-slate-700 font-gilroy font-medium">Cycle d'études *</Label>
              <select
                id="cycle_etude"
                {...register('cycle_etude')}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('cycle_etude', value as any);
                  setSelectedCycle(value as 'licence' | 'bts');
                  setValue('filiere', ''); // Reset filière when cycle changes
                }}
                className="h-12 w-full bg-white/50 border border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 px-3 text-slate-900"
              >
                <option value="">Sélectionner un cycle</option>
                <option value="licence">Licence (L1 - Première année)</option>
                <option value="bts">BTS (1ère année)</option>
              </select>
              {errors.cycle_etude && (
                <p className="text-sm text-red-600 font-gilroy">{errors.cycle_etude.message}</p>
              )}
            </div>

            {selectedCycle && (
              <div className="space-y-3">
                <Label htmlFor="filiere" className="text-slate-700 font-gilroy font-medium">
                  Filière {selectedCycle === 'licence' ? 'Licence' : 'BTS'} *
                </Label>
                <select
                  id="filiere"
                  {...register('filiere')}
                  className="h-12 w-full bg-white/50 border border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 px-3 text-slate-900"
                >
                  <option value="">Sélectionner une filière</option>
                  {(selectedCycle === 'licence' ? FILIERES_LICENCE : FILIERES_BTS).map((filiere) => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </select>
                {errors.filiere && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.filiere.message}</p>
                )}
              </div>
            )}

            {selectedCycle === 'licence' && (
              <div className="p-4 bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-200">
                <h4 className="font-semibold text-slate-900 font-gilroy mb-2">Filières Licence L1 disponibles :</h4>
                <ul className="text-sm text-slate-600 font-gilroy space-y-1">
                  {FILIERES_LICENCE.map((filiere) => (
                    <li key={filiere}>• {filiere}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCycle === 'bts' && (
              <div className="p-4 bg-emerald-50/50 backdrop-blur-sm rounded-xl border border-emerald-200">
                <h4 className="font-semibold text-slate-900 font-gilroy mb-2">Filières BTS 1ère année disponibles :</h4>
                <ul className="text-sm text-slate-600 font-gilroy space-y-1">
                  {FILIERES_BTS.map((filiere) => (
                    <li key={filiere}>• {filiere}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50/50 backdrop-blur-sm">
              <FileText className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-slate-900 font-gilroy font-semibold">Documents obligatoires</AlertTitle>
              <AlertDescription className="text-slate-600 font-gilroy">
                Veuillez télécharger les documents suivants pour finaliser votre inscription.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="photo_identite" className="text-slate-700 font-gilroy font-medium">
                  Photo d'identité * <span className="text-sm text-slate-500">(JPEG, PNG - Max 2MB)</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="photo_identite" 
                    type="file" 
                    accept="image/jpeg,image/png"
                    {...register('photo_identite')}
                    className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  />
                  <Image className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 font-gilroy">Photo récente, fond clair</p>
                {errors.photo_identite && (
                  <p className="text-sm text-red-600 font-gilroy">{String(errors.photo_identite.message)}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="attestation_bac" className="text-slate-700 font-gilroy font-medium">
                  Attestation du Baccalauréat * <span className="text-sm text-slate-500">(PDF, JPEG, PNG - Max 5MB)</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="attestation_bac" 
                    type="file" 
                    accept="application/pdf,image/jpeg,image/png"
                    {...register('attestation_bac')}
                    className="h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 font-gilroy">Document officiel obligatoire</p>
                {errors.attestation_bac && (
                  <p className="text-sm text-red-600 font-gilroy">{String(errors.attestation_bac.message)}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 font-gilroy mb-6">Récapitulatif de votre inscription :</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-slate-500 font-gilroy uppercase tracking-wide">Identité</p>
                  <p className="text-slate-900 font-gilroy">{getValues('prenom')} {getValues('nom')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('genre')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('date_naissance')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('lieu_naissance')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('nationalite')}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-slate-500 font-gilroy uppercase tracking-wide">Contact</p>
                  <p className="text-slate-900 font-gilroy">{getValues('email')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('telephone')}</p>
                  <p className="text-slate-600 font-gilroy">{getValues('adresse')}</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <p className="font-semibold text-sm text-slate-500 font-gilroy uppercase tracking-wide">Formation choisie</p>
                  <p className="text-slate-900 font-gilroy font-semibold">
                    {getValues('cycle_etude') === 'licence' ? 'Licence L1' : 'BTS 1ère année'}
                  </p>
                  <p className="text-slate-600 font-gilroy">{getValues('filiere')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptation_conditions"
                  {...register('acceptation_conditions')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <Label htmlFor="acceptation_conditions" className="text-sm text-slate-700 font-gilroy leading-relaxed">
                  J'accepte les conditions d'utilisation et la politique de confidentialité *
                </Label>
              </div>
              {errors.acceptation_conditions && (
                <p className="text-sm text-red-600 font-gilroy">{errors.acceptation_conditions.message}</p>
              )}
            </div>

            <Alert className="border-emerald-200 bg-emerald-50/50 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-slate-700 font-gilroy">
                En soumettant cette inscription, vous confirmez que toutes les informations 
                fournies sont exactes et complètes. Votre candidature sera étudiée et vous 
                recevrez une notification par email concernant la suite du processus.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold font-gilroy mb-4 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            Concours L1 & BTS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy">
            Inscription au
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              {' '}Concours
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-gilroy" key={`step-title-${step}`}>
            Étape {step} sur {totalSteps}: {stepTitles[step - 1]}
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full max-w-3xl mx-auto" key={`progress-${step}`}>
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-gilroy transition-all duration-500 shadow-lg
                  ${index + 1 < step 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white scale-110' 
                    : index + 1 === step 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-125 animate-pulse shadow-blue-300' 
                    : 'bg-white/80 text-slate-400 border-2 border-slate-200'
                  }
                `}>
                  {index + 1 < step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className={`
                  text-xs font-gilroy mt-2 text-center transition-all duration-300 hidden sm:block
                  ${index + 1 === step ? 'text-blue-600 font-semibold' : 'text-slate-500'}
                `}>
                  {title.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full transform -translate-y-1/2 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg animate-bounce"></div>
              </div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-center mt-4">
            <span className="text-lg font-bold text-slate-700 font-gilroy">
              {Math.round((step / totalSteps) * 100)}% complété
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index < step 
                      ? 'bg-emerald-500 scale-125' 
                      : 'bg-slate-300'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in delay-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900 font-gilroy" key={`card-title-${step}`}>
              {stepTitles[step - 1]}
            </CardTitle>
          </CardHeader>
          <Separator className="bg-slate-200" />
          <CardContent className="pt-8 px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {rateLimitCountdown > 0 && (
                <Alert className="border-amber-200 bg-amber-50/50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-900 font-gilroy font-semibold">
                    Limite de tentatives atteinte
                  </AlertTitle>
                  <AlertDescription className="text-amber-800 font-gilroy">
                    Pour des raisons de sécurité, vous devez attendre {rateLimitCountdown} secondes avant de pouvoir soumettre à nouveau le formulaire.
                  </AlertDescription>
                </Alert>
              )}
              
              <div key={`step-${step}`}>
                {renderStep()}
              </div>

              <div className="flex justify-between pt-8 border-t border-slate-200">
                {step > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="px-8 py-3 border-slate-200 text-slate-600 hover:bg-slate-50 font-gilroy font-medium rounded-xl"
                  >
                    Précédent
                  </Button>
                )}
                
                {step < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={loading || rateLimitCountdown > 0}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-gilroy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Soumission en cours...' : 
                     rateLimitCountdown > 0 ? `Veuillez attendre ${rateLimitCountdown}s` : 
                     'Soumettre ma candidature'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InscriptionPage 