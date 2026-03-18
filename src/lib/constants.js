// ─── API ──────────────────────────────────────────────────────────────────────
/** @type {string} */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'cc_token'

/** User roles */
export const ROLES = Object.freeze({
  DOCTOR: 'doctor',
  PATIENT: 'patient',
})

// ─── Query Keys ───────────────────────────────────────────────────────────────
/** React Query key factory — keeps keys consistent across hooks */
export const QUERY_KEYS = Object.freeze({
  // Auth / user
  currentUser: ['currentUser'],
  user: (id) => ['user', id],
  searchUsers: (params) => ['users', 'search', params],
  doctor: (id) => ['doctor', id],
  patient: (id) => ['patient', id],

  // Appointments
  appointments: (params) => ['appointments', params],
  appointment: (id) => ['appointment', id],

  // Messages
  messages: (appointmentId, params) => ['messages', appointmentId, params],
})

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = Object.freeze({
  LOGIN: '/login',
  SIGNUP_DOCTOR: '/signup/doctor',
  SIGNUP_PATIENT: '/signup/patient',

  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_APPOINTMENT_DETAIL: (id = ':id') => `/doctor/appointments/${id}`,
  DOCTOR_PROFILE: '/doctor/profile',

  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_APPOINTMENT_DETAIL: (id = ':id') => `/patient/appointments/${id}`,
  PATIENT_PROFILE: '/patient/profile',
})
