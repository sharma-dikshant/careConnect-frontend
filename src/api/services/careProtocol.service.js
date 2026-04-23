import api from '@/api/axiosInstance'

/**
 * Care Protocol API service.
 *
 * Global protocols  → care_protocols table (doctor's PDF library)
 * Appointment protocols → appointment_protocols table (attached to a specific appointment)
 */

// ─── Global protocols ──────────────────────────────────────────────────────────

/**
 * Upload a global care protocol PDF.
 * Doctor only. Sends multipart/form-data with `file` field.
 * @param {File} file
 */
export async function uploadGlobalProtocol(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/api/care-protocols', formData)
  return data
}

/**
 * Get all global care protocols for the current doctor (paginated).
 * @param {{ page?: number, limit?: number }} params
 */
export async function getGlobalProtocols(params = {}) {
  const { data } = await api.get('/api/care-protocols', { params })
  return data
}

/**
 * Get a presigned download URL for a global protocol.
 * @param {number} id  - protocol id
 */
export async function downloadGlobalProtocol(id) {
  const { data } = await api.get(`/api/care-protocols/${id}/download`, {
    params: { type: 'global' },
  })
  return data // { data: { url } }
}

/**
 * Soft-delete a care protocol (global or appointment-scoped).
 * @param {number} contextId
 */
export async function deleteCareProtocol(contextId) {
  const { data } = await api.delete(`/api/care-protocols/appointments/${contextId}`)
  return data
}

// ─── Appointment protocols ─────────────────────────────────────────────────────

/**
 * Upload a care protocol PDF scoped to a specific appointment.
 * Doctor only (must own the appointment).
 * @param {number|string} appointmentId
 * @param {File} file
 */
export async function uploadAppointmentProtocol(appointmentId, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post(
    `/api/care-protocols/locals/${appointmentId}`,
    formData,
  )
  return data
}

/**
 * Get all protocols for an appointment.
 * Returns both appointment-scoped and doctor's global (active) protocols.
 * Accessible by the appointment's doctor or patient.
 * @param {number|string} appointmentId
 * @param {{ page?: number, limit?: number }} params
 */
export async function getAppointmentProtocols(appointmentId, params = {}) {
  const { data } = await api.get(
    `/api/care-protocols/appointments/${appointmentId}`,
    { params },
  )
  return data
}

/**
 * Get a presigned download URL for an appointment-scoped protocol.
 * @param {number} id  - protocol id
 */
export async function downloadAppointmentProtocol(id) {
  const { data } = await api.get(`/api/care-protocols/${id}/download`, {
    params: { type: 'appointment' },
  })
  return data // { data: { url } }
}
