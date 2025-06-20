import { useMemo } from 'react'
import { useCandidatData } from '@/hooks/useCandidatData'

export interface DocumentStatus {
  id: number
  name: string
  type: string
  required: boolean
  uploaded: boolean
  description: string
}

/**
 * Provides the list of candidate documents with their upload status
 * based on the `inscrits` table columns (photo, bacAttestation, birthCertificate).
 */
export const useDocumentsStatus = () => {
  const { data: candidat } = useCandidatData()

  // Build memoized list so we don't recompute on every render unless candidat changes
  const documents: DocumentStatus[] = useMemo(() => {
    return [
      {
        id: 1,
        name: "Photo d'identité",
        type: 'photo',
        required: true,
        uploaded: Boolean(candidat?.photo),
        description: 'Photo récente en couleur sur fond blanc'
      },
      {
        id: 2,
        name: 'Attestation de Baccalauréat',
        type: 'bacAttestation',
        required: true,
        uploaded: Boolean(candidat?.bacAttestation),
        description: 'Relevé de notes du Baccalauréat ou équivalent'
      },
      {
        id: 3,
        name: 'Acte de naissance',
        type: 'birthCertificate',
        required: false,
        uploaded: Boolean(candidat?.birthCertificate),
        description: 'Copie certifiée conforme de l\'acte de naissance'
      }
    ]
  }, [candidat?.photo, candidat?.bacAttestation, candidat?.birthCertificate])

  return documents
} 