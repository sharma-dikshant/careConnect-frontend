import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteCareProtocol,
  downloadAppointmentProtocol,
  downloadGlobalProtocol,
  getAppointmentProtocols,
  getGlobalProtocols,
  uploadAppointmentProtocol,
  uploadGlobalProtocol,
} from '@/api/services/careProtocol.service'

// Query key factory
const KEYS = {
  global: (params = {}) => ['care-protocols', 'global', params],
  appointment: (aptId, params = {}) => ['care-protocols', 'appointment', String(aptId), params],
}

// ─── Global protocols ──────────────────────────────────────────────────────────

/**
 * Fetch the doctor's global protocol library.
 */
export function useGlobalProtocols(params = {}) {
  return useQuery({
    queryKey: KEYS.global(params),
    queryFn: async () => {
      const res = await getGlobalProtocols(params)
      return res?.data ?? { items: [], meta: {} }
    },
  })
}

/**
 * Upload a global protocol PDF. Invalidates global list on success.
 */
export function useUploadGlobalProtocol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file) => uploadGlobalProtocol(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-protocols', 'global'] })
    },
  })
}

/**
 * Soft-delete a care protocol (global or appointment-scoped).
 * Invalidates both cache keys to keep UI consistent.
 */
export function useDeleteCareProtocol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contextId) => deleteCareProtocol(contextId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-protocols'] })
    },
  })
}

/**
 * Get a presigned download URL and open it in a new tab.
 * Returns a mutation so the caller can track loading state per-protocol.
 * @param {'global' | 'appointment'} type
 */
export function useDownloadProtocol(type = 'global') {
  return useMutation({
    mutationFn: async (id) => {
      const res =
        type === 'global'
          ? await downloadGlobalProtocol(id)
          : await downloadAppointmentProtocol(id)
      const url = res?.data?.url
      if (!url) throw new Error('Failed to get download URL')
      window.open(url, '_blank', 'noopener,noreferrer')
      return url
    },
  })
}

// ─── Appointment protocols ─────────────────────────────────────────────────────

/**
 * Fetch protocols for a specific appointment.
 * Returns { appointment_protocols, doctor_protocols } — both paginated.
 * Accessible by the appointment's doctor or patient.
 */
export function useAppointmentProtocols(appointmentId, params = {}) {
  return useQuery({
    queryKey: KEYS.appointment(appointmentId, params),
    queryFn: async () => {
      const res = await getAppointmentProtocols(appointmentId, params)
      return res?.data ?? { appointment_protocols: { items: [] }, doctor_protocols: { items: [] } }
    },
    enabled: !!appointmentId,
  })
}

/**
 * Upload a PDF scoped to an appointment. Doctor only.
 */
export function useUploadAppointmentProtocol(appointmentId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file) => uploadAppointmentProtocol(appointmentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['care-protocols', 'appointment', String(appointmentId)],
      })
    },
  })
}
