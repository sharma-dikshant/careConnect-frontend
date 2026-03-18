import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMessages, sendMessage } from '@/api/services/message.service'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Fetch paginated messages for an appointment.
 * @param {number} appointmentId
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
  })
}

/**
 * Send a patient message in an appointment (triggers AI bot reply).
 * Invalidates the messages cache so the new messages appear.
 * @param {number} appointmentId
 */
export function useSendMessage(appointmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body) => sendMessage(appointmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', appointmentId],
      })
    },
  })
}
