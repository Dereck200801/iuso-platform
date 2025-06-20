// Cycles d'études disponibles
export const STUDY_CYCLES = [
  { value: 'bts1', label: 'BTS 1ère année' },
  { value: 'bts2', label: 'BTS 2ème année' },
  { value: 'dut1', label: 'DUT 1ère année' },
  { value: 'dut2', label: 'DUT 2ème année' },
  { value: 'licence1', label: 'Licence 1' },
  { value: 'licence2', label: 'Licence 2' },
  { value: 'licence3', label: 'Licence 3' },
  { value: 'licence_pro', label: 'Licence Professionnelle' },
  { value: 'master1', label: 'Master 1' },
  { value: 'master2', label: 'Master 2' }
] as const

// Filières disponibles - FORMATIONS COMPLÈTES IUSO-SNE
export const FILIERES = [
  // BTS - 2 ans (120 crédits ECTS)
  { 
    value: 'bts-comptabilite-gestion', 
    label: 'Comptabilité et Gestion', 
    category: 'BTS',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Comptabilité générale, Gestion financière, Fiscalité des entreprises'
  },
  { 
    value: 'bts-assistant-manager', 
    label: 'Assistant de Manager', 
    category: 'BTS',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Gestion administrative, Communication professionnelle, Management d\'équipe'
  },
  { 
    value: 'bts-commerce-international', 
    label: 'Commerce International', 
    category: 'BTS',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Négociation commerciale, Import-export, Marketing international'
  },
  { 
    value: 'bts-banque-assurance', 
    label: 'Banque et Assurance', 
    category: 'BTS',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Produits bancaires, Gestion de clientèle, Techniques d\'assurance'
  },

  // DUT - 2 ans (120 crédits ECTS)
  { 
    value: 'dut-carrieres-juridiques', 
    label: 'Carrières Juridiques et Judiciaires', 
    category: 'DUT',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Droit civil et commercial, Droit administratif, Comptabilité et fiscalité'
  },
  { 
    value: 'dut-gestion-information', 
    label: 'Gestion de l\'Information et de la Documentation', 
    category: 'DUT',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Management et gestion de projet, Marketing et techniques commerciales'
  },
  
  // Licences Fondamentales - 3 ans (180 crédits ECTS)
  { 
    value: 'licence-management-organisations', 
    label: 'Management des Organisations (MDO)', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Stratégie d\'entreprise, GRH, Management de projet, Finance et contrôle'
  },
  { 
    value: 'licence-communication-organisations', 
    label: 'Communication des Organisations (CO)', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Stratégies de communication, Relations publiques, Communication digitale'
  },
  { 
    value: 'licence-grh', 
    label: 'Gestion des Ressources Humaines', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Management RH, Recrutement, Formation, Droit du travail'
  },
  { 
    value: 'licence-economie-finance', 
    label: 'Économie et Finance', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Analyse économique, Finance d\'entreprise, Marchés financiers'
  },
  { 
    value: 'licence-analyse-economique', 
    label: 'Analyse Économique', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Économétrie, Politique économique, Développement économique'
  },
  { 
    value: 'licence-droit-affaires', 
    label: 'Droit des Affaires', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Droit commercial, Droit des sociétés, Fiscalité des entreprises'
  },
  { 
    value: 'licence-droit-public', 
    label: 'Droit Public', 
    category: 'Licence Fondamentale',
    duration: '3 ans',
    credits: '180 ECTS',
    description: 'Droit administratif, Droit constitutionnel, Droit international'
  },
  
  // Licence Professionnelle - 1 an (60 crédits ECTS)
  { 
    value: 'licence-pro-management-operationnel', 
    label: 'Management Opérationnel', 
    category: 'Licence Professionnelle',
    duration: '1 an',
    credits: '60 ECTS',
    description: 'Management d\'équipe, Gestion de production, Qualité et performance'
  },
  
  // Masters - 2 ans
  { 
    value: 'master-strategie-entreprise', 
    label: 'Stratégie d\'Entreprise', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Stratégie corporate, Innovation, Développement international'
  },
  { 
    value: 'master-audit-controle', 
    label: 'Audit et Contrôle de Gestion', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Audit financier, Contrôle interne, Gouvernance d\'entreprise'
  },
  { 
    value: 'master-banque-finance', 
    label: 'Banque et Finance Internationale', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Finance internationale, Gestion de portefeuille, Risk management'
  },
  { 
    value: 'master-ingenierie-financiere', 
    label: 'Ingénierie Financière', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Produits dérivés, Évaluation d\'entreprise, Finance de marché'
  },
  { 
    value: 'master-droit-affaires-fiscalite', 
    label: 'Droit des Affaires et Fiscalité', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Droit fiscal, Contentieux fiscal, Optimisation fiscale'
  },
  { 
    value: 'master-droit-public-international', 
    label: 'Droit Public et International', 
    category: 'Master',
    duration: '2 ans',
    credits: '120 ECTS',
    description: 'Droit international public, Relations internationales, Diplomatie'
  }
] as const

// Statuts des dossiers
export const DOSSIER_STATUS = [
  { value: 'en_cours', label: 'En cours', color: 'orange' },
  { value: 'valide', label: 'Validé', color: 'green' },
  { value: 'refuse', label: 'Refusé', color: 'red' }
] as const

// Types de documents requis
export const REQUIRED_DOCUMENTS = [
  { key: 'photo', label: 'Photo d\'identité', accept: 'image/*' },
  { key: 'birthCertificate', label: 'Acte de naissance', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'bacAttestation', label: 'Attestation de baccalauréat', accept: '.pdf,.jpg,.jpeg,.png' }
] as const

// Taille maximale des fichiers (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// Extensions de fichiers autorisées
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf'
] as const

// Messages de validation
export const VALIDATION_MESSAGES = {
  required: 'Ce champ est requis',
  email: 'Veuillez saisir une adresse email valide',
  phone: 'Veuillez saisir un numéro de téléphone valide',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  fileSize: 'La taille du fichier ne doit pas dépasser 5MB',
  fileType: 'Type de fichier non autorisé'
} as const

// Informations complètes sur l'IUSO-SNE - GABON
export const IUSO_INFO = {
  name: 'IUSO-SNE',
  fullName: 'Institut Universitaire des Sciences de l\'Organisation Sophie NTOUTOUME EMANE',
  country: 'Gabon',
  city: 'Libreville',
  stats: {
    graduates: '1200+',
    insertionRate: '98%',
    internships: '350+',
    partners: '40+'
  },
  contact: {
    email: 'contact@iuso-sne.com',
    adminEmail: 'admin@ecole.com',
    phones: ['062.301.380', '074.226.930'],
    address: 'BP : 17014, Libreville, Gabon',
    facebook: 'https://www.facebook.com/IusoOfficiel',
    website: 'https://iuso-sne.com'
  },
  schedule: {
    weekdays: '08:00 - 17:00',
    saturday: '09:00 - 12:00',
    sunday: 'Fermé'
  },
  features: [
    'Encadrement de qualité avec enseignants expérimentés',
    'Stages professionnels de 8 à 16 semaines selon le cycle',
    'Partenariats avec plus de 40 entreprises',
    'Campus moderne avec infrastructures récentes',
    'Taux d\'insertion professionnelle de 98%',
    'Suivi personnalisé et accompagnement individuel'
  ],
  admissionProcess: {
    bts: 'Concours d\'entrée pour les 1ères années',
    dut: 'Concours d\'entrée pour les 1ères années',
    licence: 'Traitement de dossier pour les titulaires de BTS/DUT ou équivalent',
    master: 'Traitement de dossier pour les titulaires de licence ou équivalent'
  }
} as const

// Villes du Gabon acceptées pour l'inscription
export const GABON_CITIES = [
  'Libreville', 'Port-Gentil', 'Franceville', 'Owendo', 'Oyem', 
  'Moanda', 'Ntoum', 'Lambaréné', 'Mouila', 'Akanda', 
  'Tchibanga', 'Bitam', 'Koulamoutou', 'Makokou', 'Lastoursville'
] as const

// Nationalités acceptées (liste complète disponible)
export const ACCEPTED_NATIONALITIES = [
  'Gabonaise', 'Française', 'Camerounaise', 'Congolaise', 'Tchadienne',
  'Centrafricaine', 'Équato-guinéenne', 'Sao-toméenne', 'Béninoise',
  'Togolaise', 'Ghanéenne', 'Nigériane', 'Ivoirienne', 'Burkinabé',
  'Malienne', 'Sénégalaise', 'Guinéenne', 'Sierra-léonaise', 'Libérienne',
  'Mauritanienne', 'Marocaine', 'Algérienne', 'Tunisienne', 'Libyenne',
  'Égyptienne', 'Soudanaise', 'Éthiopienne', 'Kényane', 'Tanzanienne',
  'Ougandaise', 'Rwandaise', 'Burundaise', 'Congolaise (RDC)',
  'Angolaise', 'Zambienne', 'Zimbabwéenne', 'Botswanaise', 'Namibienne',
  'Sud-africaine', 'Mozambicaine', 'Malgache', 'Mauricienne', 'Comorienne',
  'Seychelloise', 'Djiboutienne', 'Somalienne', 'Érythréenne',
  // Autres continents
  'Américaine', 'Canadienne', 'Brésilienne', 'Argentine', 'Chilienne',
  'Péruvienne', 'Colombienne', 'Vénézuélienne', 'Équatorienne',
  'Britannique', 'Allemande', 'Italienne', 'Espagnole', 'Portugaise',
  'Belge', 'Néerlandaise', 'Suisse', 'Autrichienne', 'Danoise',
  'Suédoise', 'Norvégienne', 'Finlandaise', 'Polonaise', 'Tchèque',
  'Slovaque', 'Hongroise', 'Roumaine', 'Bulgare', 'Grecque',
  'Turque', 'Russe', 'Ukrainienne', 'Biélorusse', 'Lituanienne',
  'Lettonne', 'Estonienne', 'Chinoise', 'Japonaise', 'Coréenne',
  'Indienne', 'Pakistanaise', 'Bangladaise', 'Sri-lankaise',
  'Thaïlandaise', 'Vietnamienne', 'Philippine', 'Indonésienne',
  'Malaisienne', 'Singapourienne', 'Australienne', 'Néo-zélandaise',
  'Autre'
] as const

// Configuration de pagination
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100]
} as const 