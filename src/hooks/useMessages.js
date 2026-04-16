import { useState, useEffect, useCallback } from 'react'
import { getMessages, sendMessage } from '@/api/services/message.service'

/** Poll interval for new messages (5 seconds while window is focused) */
const POLL_INTERVAL = 5000

/**
 * Fetch paginated messages for an appointment with auto-polling.
 * Maintains state internally without using React Query caching,
 * to allow specific appending and prepending of messages.
 *
 * @param {number|string} appointmentId
 * @param {{ page?: number, limit?: number }} params
 */
export function useMessages(appointmentId, params = {}) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  
  const limit = params.limit || 20

  const fetchNewest = useCallback(async () => {
    if (!appointmentId) return
    try {
      const response = await getMessages(appointmentId, { page: 1, limit })
      const newItems = response?.data?.items || []
      
      setMessages(prev => {
        if (!prev.length) {
            return [...newItems].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        }
        
        const existingIds = new Set(prev.map(m => m.id))
        const toAdd = newItems.filter(m => !existingIds.has(m.id))
        
        if (toAdd.length === 0) return prev
        
        return [...prev, ...toAdd].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      })
      
      // Evaluate hasMore on first fetch if we don't have existing pagination ongoing
      if (page === 1) {
        setHasMore(newItems.length === limit)
      }
    } catch (error) {
      console.error('Failed to fetch newest messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [appointmentId, limit, page])

  // Initial load and polling
  useEffect(() => {
    if (!appointmentId) return
    setIsLoading(true)
    fetchNewest()
    
    const interval = setInterval(fetchNewest, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchNewest, appointmentId])

  // Load older messages for infinite scroll
  const fetchNextPage = useCallback(async () => {
    if (!hasMore || isFetchingMore || !appointmentId) return
    
    setIsFetchingMore(true)
    try {
      const nextPage = page + 1
      const response = await getMessages(appointmentId, { page: nextPage, limit })
      const olderItems = response?.data?.items || []
      
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const toAdd = olderItems.filter(m => !existingIds.has(m.id))
        return [...toAdd, ...prev].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      })
      
      setPage(nextPage)
      setHasMore(olderItems.length === limit)
    } catch (error) {
      console.error('Failed to fetch older messages:', error)
    } finally {
      setIsFetchingMore(false)
    }
  }, [appointmentId, page, limit, hasMore, isFetchingMore])

  const addOptimisticMessage = useCallback((messageText) => {
    const optimistic = {
      id: `opt-${Date.now()}`,
      appointment_id: Number(appointmentId),
      sender: 'patient',
      message: messageText,
      created_at: new Date().toISOString(),
      _optimistic: true,
    }
    setMessages(prev => [...prev, optimistic])
    return optimistic.id
  }, [appointmentId])

  const removeOptimisticMessage = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  return {
    data: { items: messages },
    isLoading,
    refetch: fetchNewest,
    fetchNextPage,
    hasMore,
    isFetchingMore,
    addOptimisticMessage,
    removeOptimisticMessage
  }
}

/**
 * Send a patient message (triggers AI bot reply).
 *
 * @param {number|string} appointmentId
 * @param {Object} callbacks - callbacks for optimistic updates
 */
export function useSendMessage(appointmentId, callbacks = {}) {
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables) => {
    const messageText = variables.message
    setIsPending(true)
    
    let optId
    if (callbacks.onMutate) {
      optId = callbacks.onMutate({ message: messageText })
    }

    try {
      await sendMessage(appointmentId, { message: messageText })
      if (callbacks.onSuccess) {
        callbacks.onSuccess()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      if (callbacks.onError && optId) {
        callbacks.onError(optId)
      }
    } finally {
      setIsPending(false)
      if (callbacks.onSettled) {
        callbacks.onSettled(optId)
      }
    }
  }

  return { mutate, isPending }
}
