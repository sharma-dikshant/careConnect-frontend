import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, CalendarDays, User, AlignLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

/**
 * Responsive card for a single appointment.
 * Edit/delete actions are only rendered when onEdit/onDelete are provided (doctor + active tab).
 *
 * Props:
 *  - appointment: object
 *  - role: 'doctor' | 'patient'
 *  - isActive: boolean          — whether this is the active-tab card
 *  - onEdit: (apt) => void      — omit/undefined to hide edit button
 *  - onDelete: (id) => void     — omit/undefined to hide delete button
 *  - isDeleting: boolean
 */
export const AppointmentCard = memo(function AppointmentCard({
  appointment,
  role = 'patient',
  isActive = true,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const apt = appointment
  const detailRoute =
    role === 'doctor'
      ? ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)
      : ROUTES.PATIENT_APPOINTMENT_DETAIL(apt.id)

  const canEdit = typeof onEdit === 'function'
  const canDelete = typeof onDelete === 'function'
  const showActions = isActive && (canEdit || canDelete)

  return (
    <Card className="group flex flex-col transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={detailRoute}
            className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
          >
            {apt.title}
          </Link>
          <Badge
            variant={isActive ? (role === 'doctor' ? 'doctor' : 'patient') : 'inactive'}
            className="shrink-0"
          >
            {isActive ? 'Active' : 'Past'}
          </Badge>
        </div>

        {/* Meta rows */}
        <div className="flex-1 space-y-1.5">
          {/* Patient info (doctor view) */}
          {role === 'doctor' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {apt.patient?.name ?? '—'}
                {apt.patient?.email && (
                  <span className="opacity-70"> · {apt.patient.email}</span>
                )}
              </span>
            </div>
          )}

          {/* Doctor info (patient view) */}
          {role === 'patient' && apt.doctor && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Dr. {apt.doctor?.name ?? '—'}
                {apt.doctor?.specialization && (
                  <span className="opacity-70"> · {apt.doctor.specialization}</span>
                )}
              </span>
            </div>
          )}

          {apt.description && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlignLeft className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-2 leading-relaxed">{apt.description}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateTime(apt.created_at)}</span>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <Link
            to={detailRoute}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View messages
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>

          {showActions && (
            <div className="flex gap-1">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => onEdit(apt)}
                  aria-label={`Edit appointment: ${apt.title}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(apt.id)}
                  disabled={isDeleting}
                  aria-label={`Delete appointment: ${apt.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
