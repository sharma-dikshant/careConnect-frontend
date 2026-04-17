import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMessages, sendMessage } from '@/api/services/message.service'
import { QUERY_KEYS } from '@/lib/constants'

/** Poll interval for new messages (5 seconds while window is focused) */
const POLL_INTERVAL = 5000

/**
 * Fetch paginated messages for an appointment with auto-polling.
 * Re-fetches every 5 s so both doctor and patient see new messages in near real-time.
 *
 * @param {number|string} appointmentId
 * @param {{ page?: number, limit?: number }} params
 */
export function useMessages(appointmentId, params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.messages(appointmentId, params),
    queryFn: async () => {
      const response = await getMessages(appointmentId, params)
      return response?.data ?? { items: [], meta: {} }
    },
    enabled: !!appointmentId,
    refetchInterval: POLL_INTERVAL,          // poll every 5 s
    refetchIntervalInBackground: false,       // pause when tab is hidden
    staleTime: 0,                             // always re-fetch (chat needs freshness)
  })
}

/**
 * Send a patient message (triggers AI bot reply).
 * Optimistically appends the message then invalidates to get the bot reply.
 *
 * @param {number|string} appointmentId
 */
export function useSendMessage(appointmentId) {
  const queryClient = useQueryClient()
  const queryKey = QUERY_KEYS.messages(appointmentId, {})

  return useMutation({
    mutationFn: (body) => sendMessage(appointmentId, body),

    // Optimistic: append the patient message immediately
    onMutate: async ({ message }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old) => {
        const optimistic = {
          id: `opt-${Date.now()}`,
          appointment_id: Number(appointmentId),
          sender: 'patient',
          message,
          created_at: new Date().toISOString(),
          _optimistic: true,
        }
        return {
          ...old,
          items: [optimistic, ...(old?.items ?? [])],
        }
      })

      return { previous }
    },

    // Roll back optimistic on error
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },

    // Always re-fetch so the bot reply appears
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', String(appointmentId)] })
    },
  })
}
