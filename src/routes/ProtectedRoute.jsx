import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ROUTES } from '@/lib/constants'

/**
 * Guards a route subtree requiring authentication.
 * Optionally restricts to specific roles.
 *
 * @param {{ allowedRoles?: ('doctor'|'patient')[] }} props
 */
export function ProtectedRoute({ allowedRoles }) {
  const { token, role, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to their appropriate dashboard if wrong role
    const fallback =
      role === 'doctor' ? ROUTES.DOCTOR_DASHBOARD : ROUTES.PATIENT_DASHBOARD
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
