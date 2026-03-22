import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from '@/api/services/appointment.service'

/**
 * Fetch appointments for the current user, filtered by active status.
 * Query key: ["appointments", { active: true|false }]
 *
 * @param {{ active: boolean, page?: number, limit?: number }} params
 */
export function useAppointments({ active, page = 1, limit = 20 } = {}) {
  const queryKey = ['appointments', { active }]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getAppointments({ active, page, limit })
      return response?.data ?? { items: [], meta: {} }
    },
    // Keep previous data while fetching new page / tab switch
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30, // 30 s — avoid refetch on tab switch if data is fresh
  })
}

/**
 * Create a new appointment (Doctor only).
 * Invalidates both active and inactive appointment lists on success.
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
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] })
    },
  })
}

/**
 * Soft-delete an appointment (Doctor only).
 * Invalidates both active and inactive appointment lists on success.
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      // Invalidate both tabs — a deleted appointment moves from active → inactive
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
