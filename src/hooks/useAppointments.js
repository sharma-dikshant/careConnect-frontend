import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  initiateCreateAppointment,
  initiateDeleteAppointment,
  confirmAppointment,
  getAppointments,
  updateAppointment,
} from '@/api/services/appointment.service'
import { verifyOtp } from '@/api/services/auth.service'

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
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  })
}

/**
 * Initiate appointment creation (step 1 – sends OTP to patient). Doctor only.
 * Returns { entityId, otpExpiry } on success so the caller can open an OTP modal.
 */
export function useInitiateCreateAppointment() {
  return useMutation({
    mutationFn: initiateCreateAppointment,
    // No cache invalidation here – the appointment isn't created yet
  })
}

/**
 * Initiate appointment deletion (step 1 – sends OTP to patient). Doctor only.
 * Returns { entityId, otpExpiry } on success so the caller can open an OTP modal.
 */
export function useInitiateDeleteAppointment() {
  return useMutation({
    mutationFn: initiateDeleteAppointment,
  })
}

/**
 * Verify OTP + confirm an appointment action (create or close).
 * Combines the /otp/verify call and /api/appointments/confirm call.
 * Invalidates all appointment queries on success.
 *
 * @example
 *   const { mutateAsync: completeAppointmentAction } = useConfirmAppointmentOtp()
 *   await completeAppointmentAction({ to: patientEmail, type: 'appointment-create', entityId, otp })
 */
export function useConfirmAppointmentOtp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ to, type, entityId, otp }) => {
      // Step 1: verify OTP → get verifyToken
      const verifyRes = await verifyOtp({ to, type, entityId, otp })
      const verifyToken = verifyRes.data.verifyToken

      // Step 2: confirm action
      const result = await confirmAppointment(verifyToken)
      return result
    },
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
