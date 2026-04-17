import { useAuth } from '@/hooks/useAuth'
import { useAppointments } from '@/hooks/useAppointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { CalendarDays, HeartPulse, Info, ArrowRight } from 'lucide-react'

export function PatientDashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useAppointments({ page: 1, limit: 5 })
  const appointments = data?.items ?? []
  const total = data?.meta?.total ?? 0
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-brand-blue-700 to-brand-blue-900 p-6 text-white shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-brand-green-400/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-sm text-blue-100 sm:text-base">
              You have <strong className="font-semibold text-white">{total}</strong> appointment
              {total !== 1 ? 's' : ''} on record.
            </p>
          </div>
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20 sm:flex">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-3 rounded-xl border border-accent/60 bg-accent/70 p-4 text-sm text-accent-foreground">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/70">
          <Info className="h-3.5 w-3.5" />
        </div>
        <p className="leading-relaxed">
          To start a conversation with your doctor, open an appointment and type your message.
          Our AI assistant will respond while your doctor reviews the thread.
        </p>
      </div>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Your Appointments
          </CardTitle>
          <Link
            to={ROUTES.PATIENT_APPOINTMENTS}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-10 text-center">
              <p className="text-sm font-medium text-foreground">No appointments yet</p>
              <p className="text-xs text-muted-foreground">
                Your doctor will create one for you.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {appointments.map((apt) => (
                <li key={apt.id}>
                  <Link
                    to={ROUTES.PATIENT_APPOINTMENT_DETAIL(apt.id)}
                    className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {apt.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Dr. {apt.doctor?.name}
                        {apt.doctor?.specialization && ` · ${apt.doctor.specialization}`}
                        {' · '}
                        {formatDateTime(apt.created_at)}
                      </p>
                    </div>
                    <Badge variant="patient" className="shrink-0">Active</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
