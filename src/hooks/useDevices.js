import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAppointmentDevices, registerDevice } from '@/api/services/device.service'

const KEYS = {
  appointment: (aptId) => ['devices', 'appointment', String(aptId)],
}

/**
 * Fetch all registered devices for an appointment.
 * @param {number|string} appointmentId
 */
export function useAppointmentDevices(appointmentId) {
  return useQuery({
    queryKey: KEYS.appointment(appointmentId),
    queryFn: async () => {
      const res = await getAppointmentDevices(appointmentId)
      return res?.data?.devices ?? []
    },
    enabled: !!appointmentId,
  })
}

/**
 * Register a new device for an appointment.
 * Invalidates the device list on success.
 * @param {number|string} appointmentId
 */
export function useRegisterDevice(appointmentId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => registerDevice(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.appointment(appointmentId) })
    },
  })
}
