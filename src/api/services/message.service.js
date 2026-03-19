import api from '@/api/axiosInstance'

/**
 * Get all messages for an appointment with pagination.
 * Accessible by both the doctor and patient in the appointment.
 * @param {number} appointmentId
 * @param {{ page?: number, limit?: number }} params
 */
export async function getMessages(appointmentId, params = {}) {
  const { data } = await api.get(
    `/api/messages/appointments/${appointmentId}`,
    { params },
  )
  return data // { message, data: { items, meta } }
}

/**
 * Send a message in an appointment. Patient only.
 * Triggers an AI bot reply which is returned in the response.
 * @param {number} appointmentId
 * @param {{ message: string }} body
 */
export async function sendMessage(appointmentId, body) {
  const { data } = await api.post(
    `/api/messages/appointments/${appointmentId}`,
    body,
  )
  return data // { message: 'success', data: { message: '<bot reply>' } }
}
