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
 * Register a new doctor account (step 1 – sends OTP).
 * @param {Object} body
 * @returns {{ message: string, data: { otpExpiry: number, entityId: string } }}
 */
export async function signupDoctor(body) {
  const { data } = await api.post('/api/auth/signup/doctor', body)
  return data
}

/**
 * Register a new patient account (step 1 – sends OTP).
 * @param {{ name: string, email: string, password: string }} body
 * @returns {{ message: string, data: { otpExpiry: number, entityId: string } }}
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
 * Verify an OTP for a given email + type + entityId.
 * @param {{ to: string, type: string, entityId: string, otp: string }} body
 * @returns {{ message: string, data: { verifyToken: string } }}
 */
export async function verifyOtp(body) {
  const { data } = await api.post('/otp/verify', body)
  return data
}

/**
 * Resend OTP without re-submitting the full signup form.
 * @param {{ to: string, type: string, entityId: string }} body
 */
export async function resendOtp(body) {
  const { data } = await api.post('/otp/send', body)
  return data
}

/**
 * Confirm signup after successful OTP verification.
 * @param {string} verifyToken – returned from verifyOtp
 */
export async function signupConfirm(verifyToken) {
  const { data } = await api.post(
    '/api/auth/signup/confirm',
    {},
    { headers: { 'x-verify-token': verifyToken } },
  )
  return data
}
