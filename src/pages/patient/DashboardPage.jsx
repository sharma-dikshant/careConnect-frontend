import { useAuth } from '@/hooks/useAuth'
import { useAppointments } from '@/hooks/useAppointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { CalendarDays, HeartPulse, Info } from 'lucide-react'

export function PatientDashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useAppointments({ page: 1, limit: 5 })
  const appointments = data?.items ?? []
  const total = data?.meta?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-brand-blue-700 text-white p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-blue-100 text-sm">
            You have <strong>{total}</strong> appointment{total !== 1 ? 's' : ''} on record.
          </p>
        </div>
        <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
          <HeartPulse className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-3 rounded-lg bg-accent p-4 text-sm text-accent-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          To start a conversation with your doctor, visit an appointment and type your message. 
          Our AI assistant will respond while your doctor reviews the thread.
        </p>
      </div>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Your Appointments
          </CardTitle>
          <Link
            to={ROUTES.PATIENT_APPOINTMENTS}
            className="text-sm text-primary hover:underline font-medium"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No appointments yet. Your doctor will create one for you.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {appointments.map((apt) => (
                <Link
                  key={apt.id}
                  to={ROUTES.PATIENT_APPOINTMENT_DETAIL(apt.id)}
                  className="flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {apt.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dr. {apt.doctor?.name} · {apt.doctor?.specialization} · {formatDateTime(apt.created_at)}
                    </p>
                  </div>
                  <Badge variant="patient">Active</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
