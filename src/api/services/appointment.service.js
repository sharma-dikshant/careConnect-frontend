import api from '@/api/axiosInstance'

/**
 * Get all appointments for the current user.
 * Role is determined server-side from the JWT.
 * @param {{ page?: number, limit?: number, active?: boolean }} params
 */
export async function getAppointments(params = {}) {
  const { data } = await api.get('/api/appointments', { params })
  return data // { message, data: { items, meta } }
}

/**
 * Create a new appointment. Doctor only.
 * @param {{ patientEmail: string, title: string, description?: string }} body
 */
export async function createAppointment(body) {
  const { data } = await api.post('/api/appointments', body)
  return data
}

/**
 * Update an appointment's title / description. Doctor only.
 * @param {number} appointmentId
 * @param {{ title?: string, description?: string }} body
 */
export async function updateAppointment(appointmentId, body) {
  const { data } = await api.patch(`/api/appointments/${appointmentId}`, body)
  return data
}

/**
 * Soft-delete an appointment (sets active = false). Doctor only.
 * @param {number} appointmentId
 */
export async function deleteAppointment(appointmentId) {
  const { data } = await api.delete(`/api/appointments/${appointmentId}`)
  return data
}
