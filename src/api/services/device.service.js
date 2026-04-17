import api from '@/api/axiosInstance'

/**
 * Register a new device for an appointment.
 * @param {number|string} appointmentId
 * @returns {{ message: string, data: { token: string } }}
 */
export async function registerDevice(appointmentId) {
  const { data } = await api.post('/devices/register', { appointmentId: Number(appointmentId) })
  return data
}

/**
 * Get all registered devices for an appointment.
 * @param {number|string} appointmentId
 * @returns {{ message: string, data: { devices: Array } }}
 */
export async function getAppointmentDevices(appointmentId) {
  const { data } = await api.get(`/devices/appointments/${appointmentId}`)
  return data
}
