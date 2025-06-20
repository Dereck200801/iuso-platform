import { useEffect, useState, useCallback } from 'react'
import { supabase, mapFieldsToCamelCase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export interface MessageData {
  id: string
  fromEmail: string
  toEmail: string
  fromRole: 'candidat' | 'admin'
  toRole: 'candidat' | 'admin'
  subject: string
  content: string
  date: string
  read: boolean
  attachments?: any | null
}

/**
 * Hook to fetch messages for the currently authenticated user.
 * It subscribes to Supabase realtime updates so the UI stays in sync automatically.
 */
export function useMessagesData() {
  const { user } = useAuth()

  const [messages, setMessages] = useState<MessageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!user?.email) {
      setMessages([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error: supaError } = await supabase
        .from('messages')
        .select('*')
        .or(`from_email.eq.${user.email},to_email.eq.${user.email}`)
        .order('date', { ascending: false })

      if (supaError) throw supaError

      setMessages(data.map(mapFieldsToCamelCase))
    } catch (err: any) {
      console.error('Erreur fetch messages:', err)
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  // Initial fetch
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Realtime subscription
  useEffect(() => {
    if (!user?.email) return

    const channelName = `messages_changes:${user.email}:${Date.now()}`
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // We're only interested in rows where user is sender or receiver
          const msg = mapFieldsToCamelCase(payload.new ?? payload.old)
          if (msg.fromEmail === user.email || msg.toEmail === user.email) {
            fetchMessages()
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [user?.email, fetchMessages])

  return { messages, loading, error, refresh: fetchMessages }
} 