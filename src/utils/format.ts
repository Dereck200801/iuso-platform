// Formatage des dates
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('fr-FR', defaultOptions)
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatage des noms
export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} ${lastName.toUpperCase()}`
}

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}

// Formatage des numéros de téléphone
export const formatPhone = (phone: string): string => {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '')
  
  // Format sénégalais: +221 XX XXX XX XX
  if (cleaned.startsWith('221') && cleaned.length === 12) {
    return `+221 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  
  // Format local: XX XXX XX XX
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`
  }
  
  return phone
}

// Formatage des matricules
export const generateMatricule = (studyCycle: string, year: number = new Date().getFullYear()): string => {
  const cycleCode = studyCycle.toUpperCase().substring(0, 3)
  const yearCode = year.toString().slice(-2)
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  return `${cycleCode}${yearCode}${randomNum}`
}

// Formatage des tailles de fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Formatage des statuts
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'en_cours':
      return 'orange'
    case 'valide':
      return 'green'
    case 'refuse':
      return 'red'
    default:
      return 'gray'
  }
}

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'en_cours':
      return 'En cours'
    case 'valide':
      return 'Validé'
    case 'refuse':
      return 'Refusé'
    default:
      return 'Inconnu'
  }
}

// Formatage des textes
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Validation des emails
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validation des numéros de téléphone sénégalais
export const isValidSenegalPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Format international: 22177xxxxxxx ou 22178xxxxxxx ou 22170xxxxxxx
  if (cleaned.startsWith('221') && cleaned.length === 12) {
    const operator = cleaned.substring(3, 5)
    return ['77', '78', '70', '76', '75'].includes(operator)
  }
  
  // Format local: 77xxxxxxx ou 78xxxxxxx ou 70xxxxxxx
  if (cleaned.length === 9) {
    const operator = cleaned.substring(0, 2)
    return ['77', '78', '70', '76', '75'].includes(operator)
  }
  
  return false
} 