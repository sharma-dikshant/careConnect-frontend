import { Link } from 'react-router-dom'
import { HeartPulse, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROLES, ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  const { token, role } = useAuth()

  const homeRoute = token
    ? role === ROLES.DOCTOR
      ? ROUTES.DOCTOR_DASHBOARD
      : ROUTES.PATIENT_DASHBOARD
    : ROUTES.LOGIN

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-slate-50 px-4 text-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <HeartPulse className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <p className="text-xl font-semibold text-foreground">Page not found</p>
        <p className="text-muted-foreground max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Button asChild>
        <Link to={homeRoute}>
          <Home className="h-4 w-4" />
          Go back home
        </Link>
      </Button>
    </div>
  )
}
