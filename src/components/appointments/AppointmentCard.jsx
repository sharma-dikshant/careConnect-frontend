import { Link } from 'react-router-dom'
import { Pencil, Trash2, CalendarDays, User, AlignLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

/**
 * Mobile-friendly card representation of a single appointment.
 *
 * Props:
 *  - appointment: object
 *  - onEdit: (appointment) => void
 *  - onDelete: (id) => void
 *  - isDeleting: boolean
 */
export function AppointmentCard({ appointment, onEdit, onDelete, isDeleting }) {
  const apt = appointment

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)}
            className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug"
          >
            {apt.title}
          </Link>
          <Badge variant="doctor" className="shrink-0">Active</Badge>
        </div>

        {/* Meta rows */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {apt.patient?.name ?? '—'}
              {apt.patient?.email && (
                <span className="opacity-70"> · {apt.patient.email}</span>
              )}
            </span>
          </div>

          {apt.description && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlignLeft className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{apt.description}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateTime(apt.created_at)}</span>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <Link
            to={ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)}
            className="text-xs text-primary font-medium hover:underline"
          >
            View messages →
          </Link>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(apt)}
              aria-label={`Edit appointment: ${apt.title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(apt.id)}
              disabled={isDeleting}
              aria-label={`Delete appointment: ${apt.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
