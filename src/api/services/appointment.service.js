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
 * Initiate appointment creation (step 1 – sends OTP to patient). Doctor only.
 * @param {{ patientEmail: string, title: string, description?: string }} body
 * @returns {{ message: string, data: { otpExpiry: number, entityId: string } }}
 */
export async function initiateCreateAppointment(body) {
  const { data } = await api.post('/api/appointments/initialize', body)
  return data
}

/**
 * Initiate appointment close/delete (step 1 – sends OTP to patient). Doctor only.
 * @param {number} appointmentId
 * @returns {{ message: string, data: { otpExpiry: number, entityId: string } }}
 */
export async function initiateDeleteAppointment(appointmentId) {
  const { data } = await api.delete(`/api/appointments/${appointmentId}/initialize`)
  return data
}

/**
 * Confirm an appointment action (create or close) after OTP verification.
 * @param {string} verifyToken – returned from POST /otp/verify
 * @returns {{ message: string, data?: object }}
 */
export async function confirmAppointment(verifyToken) {
  const { data } = await api.post(
    '/api/appointments/confirm',
    {},
    { headers: { 'x-verify-token': verifyToken } },
  )
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
