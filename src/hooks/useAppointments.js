import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from '@/api/services/appointment.service'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Fetch paginated appointments for the current user (role-aware on server).
 * @param {{ page?: number, limit?: number }} params
 */
export function useAppointments(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments(params),
    queryFn: async () => {
      const response = await getAppointments(params)
      return response?.data ?? { items: [], meta: {} }
    },
  })
}

/**
 * Create a new appointment (Doctor only).
 * Invalidates the appointments list on success.
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

/**
 * Update appointment title/description (Doctor only).
 * @param {number} appointmentId
 */
export function useUpdateAppointment(appointmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body) => updateAppointment(appointmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.appointment(appointmentId),
      })
    },
  })
}

/**
 * Soft-delete an appointment (Doctor only).
 * Invalidates the appointments list on success.
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
