import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppointments } from '@/hooks/useAppointments'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { MessageSquare } from 'lucide-react'

export function PatientAppointmentsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useAppointments({ page, limit: 20 })

  const appointments = data?.items ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {meta.total ?? 0} total appointments
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : error ? (
            <p className="p-6 text-destructive text-sm">{error.message}</p>
          ) : appointments.length === 0 ? (
            <p className="p-10 text-center text-muted-foreground text-sm">
              No appointments yet. Your doctor will add you to an appointment.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {appointments.map((apt) => (
                <Link
                  key={apt.id}
                  to={ROUTES.PATIENT_APPOINTMENT_DETAIL(apt.id)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                      {apt.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dr. {apt.doctor?.name}
                      {apt.doctor?.specialization && ` · ${apt.doctor.specialization}`}
                       · {formatDateTime(apt.created_at)}
                    </p>
                  </div>
                  <Badge variant="patient">Active</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.total_pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.total_pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
