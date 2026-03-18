import api from '@/api/axiosInstance'

/**
 * Get the currently logged-in user's profile.
 * Returns doctor or patient data depending on the JWT.
 */
export async function getCurrentUser() {
  const { data } = await api.get('/api/users')
  return data // { message, data: { ...profile } }
}

/**
 * Update the current user's profile.
 * Accepted fields differ by role (doctor vs patient).
 * @param {Object} body
 */
export async function updateProfile(body) {
  const { data } = await api.patch('/api/users/me', body)
  return data
}

/**
 * Search users by role and/or email with pagination.
 * @param {{ role?: 'doctor'|'patient', email?: string, page?: number, limit?: number }} params
 */
export async function searchUsers(params = {}) {
  const { data } = await api.get('/api/users/search', { params })
  return data
}

/**
 * Get a doctor's public profile by ID.
 * @param {number} doctorId
 */
export async function getDoctorById(doctorId) {
  const { data } = await api.get(`/api/users/doctors/${doctorId}`)
  return data
}

/**
 * Get a patient's profile by ID.
 * @param {number} patientId
 */
export async function getPatientById(patientId) {
  const { data } = await api.get(`/api/users/patients/${patientId}`)
  return data
}
