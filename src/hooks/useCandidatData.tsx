import { useEffect, useState, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { supabase, mapFieldsToCamelCase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export interface CandidatData {
  id: string
  matricule?: string | null
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  address?: string | null
  studyCycle: string
  studyField: string
  photo?: string | null
  birthCertificate?: string | null
  bacAttestation?: string | null
  status: 'en_cours' | 'valide' | 'refuse'
  createdAt: string
  [key: string]: any
}

interface CandidatContextType {
  data: CandidatData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const CandidatContext = createContext<CandidatContextType | undefined>(undefined)

// Provider Component
export function CandidatDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<CandidatData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user?.email) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data: row, error: supaError } = await supabase
        .from('inscrits')
        .select('*')
        .eq('email', user.email)
        .single()

      if (supaError) {
        // Si pas de données trouvées, c'est normal pour un nouvel utilisateur
        if (supaError.code === 'PGRST116') {
          setData(null)
          setError(null)
        } else {
          throw supaError
        }
      } else if (row) {
        setData(mapFieldsToCamelCase(row))
      } else {
        setData(null)
      }
    } catch (err: any) {
      console.error('Erreur fetch candidat:', err)
      setError(err.message || 'Erreur inconnue')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and refetch on email change
  useEffect(() => {
    fetchData()
  }, [user?.email])

  // Subscribe to realtime updates for the candidate row - SINGLE SUBSCRIPTION
  useEffect(() => {
    if (!user?.email) return

    let channel: any = null
    
    try {
      const channelName = `candidat_updates_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`
      
      channel = supabase.channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'inscrits',
            filter: `email=eq.${user.email}`
          },
          (payload) => {
            console.log('Candidat data updated:', payload)
            fetchData()
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
        })

    } catch (error) {
      console.error('Erreur lors de la souscription:', error)
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe()
          supabase.removeChannel(channel)
        } catch (error) {
          console.error('Erreur lors du nettoyage du canal:', error)
        }
      }
    }
  }, [user?.email])

  const contextValue: CandidatContextType = {
    data,
    loading,
    error,
    refresh: fetchData
  }

  return (
    <CandidatContext.Provider value={contextValue}>
      {children}
    </CandidatContext.Provider>
  )
}

// Hook to use the context
export function useCandidatData(): CandidatContextType {
  const context = useContext(CandidatContext)
  
  if (context === undefined) {
    throw new Error('useCandidatData must be used within a CandidatDataProvider')
  }
  
  return context
} 