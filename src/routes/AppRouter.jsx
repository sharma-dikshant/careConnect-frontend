import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ROLES, ROUTES } from '@/lib/constants'

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupDoctorPage } from '@/pages/auth/SignupDoctorPage'
import { SignupPatientPage } from '@/pages/auth/SignupPatientPage'

// Doctor pages
import { DoctorDashboardPage } from '@/pages/doctor/DashboardPage'
import { DoctorAppointmentsPage } from '@/pages/doctor/AppointmentsPage'
import { DoctorProtocolsPage } from '@/pages/doctor/ProtocolsPage'

// Patient pages
import { PatientDashboardPage } from '@/pages/patient/DashboardPage'
import { PatientAppointmentsPage } from '@/pages/patient/AppointmentsPage'

// Shared pages
import { HomePage } from '@/pages/shared/HomePage'
import { AppointmentDetailPage } from '@/pages/shared/AppointmentDetailPage'
import { ProfilePage } from '@/pages/shared/ProfilePage'
import { NotFoundPage } from '@/pages/shared/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      {/* ── Homepage (public) ─────────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />

      {/* ── Public routes (auth) ───────────────────────────────────────────── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/doctor" element={<SignupDoctorPage />} />
          <Route path="/signup/patient" element={<SignupPatientPage />} />
        </Route>
      </Route>

      {/* ── Doctor routes ──────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route element={<AppShell />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
          <Route path="/doctor/appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="/doctor/protocols" element={<DoctorProtocolsPage />} />
          <Route path="/doctor/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Patient routes ─────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
        <Route element={<AppShell />}>
          <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
          <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
          <Route path="/patient/appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="/patient/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
