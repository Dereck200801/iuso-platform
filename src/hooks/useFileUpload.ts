import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../lib/constants'

interface UseFileUploadOptions {
  bucket: string
  folder?: string
  maxSize?: number
  allowedTypes?: readonly string[]
}

interface UploadResult {
  url: string | null
  path: string | null
  error: string | null
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const {
    bucket,
    folder = '',
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_FILE_TYPES
  } = options

  const validateFile = (file: File): string | null => {
    // Vérifier que le fichier existe
    if (!file) {
      return 'Aucun fichier sélectionné'
    }

    // Vérifier la taille
    if (file.size > maxSize) {
      return `Le fichier est trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    // Vérifier le type MIME
    console.log('🔍 Validation file:', { name: file.name, type: file.type, size: file.size })
    
    if (!file.type || file.type === 'application/json') {
      return 'Type de fichier invalide. Veuillez sélectionner un fichier image (JPEG, PNG) ou PDF selon le champ.'
    }

    if (!allowedTypes.includes(file.type as any)) {
      return `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
    }

    return null
  }

  const uploadFile = async (file: File, fileName?: string): Promise<UploadResult> => {
    const validationError = validateFile(file)
    if (validationError) {
      return { url: null, path: null, error: validationError }
    }

    setUploading(true)
    setProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const finalFileName = fileName || `${Date.now()}.${fileExt}`
      const filePath = folder ? `${folder}/${finalFileName}` : finalFileName

      // Upload du fichier
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setProgress(100)
      // Toast supprimé car géré par le composant parent

      return {
        url: publicUrl,
        path: filePath,
        error: null
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error.message || 'Erreur lors de l\'upload'
      // Toast supprimé car géré par le composant parent
      
      return {
        url: null,
        path: null,
        error: errorMessage
      }
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        throw error
      }

      // Toast supprimé car géré par le composant parent
      return true
    } catch (error: any) {
      console.error('Delete error:', error)
      // Toast supprimé car géré par le composant parent
      return false
    }
  }

  const getSignedUrl = async (filePath: string, expiresIn = 3600): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        throw error
      }

      return data.signedUrl
    } catch (error: any) {
      console.error('Signed URL error:', error)
      return null
    }
  }

  return {
    uploadFile,
    deleteFile,
    getSignedUrl,
    uploading,
    progress,
    validateFile
  }
} 