import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ROLES, ROUTES } from '@/lib/constants'

/**
 * Guards public-only routes (login, signup).
 * Authenticated users are redirected to their role's dashboard.
 */
export function PublicRoute() {
  const { token, role, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (token) {
    const dashboard =
      role === ROLES.DOCTOR ? ROUTES.DOCTOR_DASHBOARD : ROUTES.PATIENT_DASHBOARD
    return <Navigate to={dashboard} replace />
  }

  return <Outlet />
}
