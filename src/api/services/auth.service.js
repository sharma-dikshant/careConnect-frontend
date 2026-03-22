import api from '@/api/axiosInstance'
import { TOKEN_KEY } from '@/lib/constants'

/**
 * Login as doctor or patient.
 * @param {{ type: 'doctor'|'patient', email: string, password: string }} credentials
 */
export async function loginUser(credentials) {
  const { data } = await api.post('/api/auth/login', credentials)
  return data // { message, data: { token, type } }
}

/**
 * Register a new doctor account.
 * @param {Object} body
 */
export async function signupDoctor(body) {
  const { data } = await api.post('/api/auth/signup/doctor', body)
  return data
}

/**
 * Register a new patient account.
 * @param {{ name: string, email: string, password: string }} body
 */
export async function signupPatient(body) {
  const { data } = await api.post('/api/auth/signup/patient', body)
  return data
}

/**
 * Logout the current user (server-side invalidation).
 * The caller is responsible for clearing the local token.
 */
export async function logoutUser() {
  const { data } = await api.post('/api/auth/logout')
  localStorage.removeItem(TOKEN_KEY)
  return data
}

/**
 * Verify an OTP for a given email + type.
 * @param {{ to: string, type: 'signup-patient'|'signup-doctor', otp: string }} body
 */
export async function verifyOtp(body) {
  const { data } = await api.post('/otp/verify', body)
  return data
}
