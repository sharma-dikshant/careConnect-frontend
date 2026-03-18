import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { AppointmentCard } from './AppointmentCard'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      {[5, 3, 2, 2, 1].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 w-${w * 8} rounded`} />
        </td>
      ))}
    </tr>
  )
}

function CardSkeleton() {
  return <Skeleton className="h-40 w-full rounded-xl" />
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-foreground">No appointments yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first appointment to get started.
        </p>
      </div>
      <Button size="sm" onClick={onCreateClick}>
        Create Appointment
      </Button>
    </div>
  )
}

// ─── Desktop Table ────────────────────────────────────────────────────────────
function AppointmentTable({ appointments, onEdit, onDelete, isDeletingId }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full text-sm" aria-label="Appointments table">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Patient</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr
              key={apt.id}
              className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
            >
              {/* Title */}
              <td className="px-4 py-3 max-w-[200px]">
                <Link
                  to={ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)}
                  className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                >
                  {apt.title}
                </Link>
              </td>

              {/* Patient */}
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{apt.patient?.name ?? '—'}</p>
                  {apt.patient?.email && (
                    <p className="text-xs text-muted-foreground">{apt.patient.email}</p>
                  )}
                </div>
              </td>

              {/* Description */}
              <td className="px-4 py-3 max-w-[220px]">
                <p className="text-muted-foreground text-xs line-clamp-2">
                  {apt.description || <span className="italic opacity-50">No description</span>}
                </p>
              </td>

              {/* Created */}
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                {formatDateTime(apt.created_at)}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <Badge variant="doctor">Active</Badge>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(apt)}
                    aria-label={`Edit ${apt.title}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(apt.id)}
                    disabled={isDeletingId === apt.id}
                    aria-label={`Delete ${apt.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Mobile Card Grid ─────────────────────────────────────────────────────────
function AppointmentCardGrid({ appointments, onEdit, onDelete, isDeletingId }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {appointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeletingId === apt.id}
        />
      ))}
    </div>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────
/**
 * Responsive appointment list.
 * Shows a table on desktop (md+) and cards on mobile.
 *
 * Props:
 *  - appointments: array
 *  - isLoading: boolean
 *  - error: Error | null
 *  - onEdit: (appointment) => void
 *  - onDelete: (id) => void
 *  - isDeletingId: number | null
 *  - onCreateClick: () => void  — used by empty state CTA
 */
export function AppointmentList({
  appointments = [],
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  isDeletingId = null,
  onCreateClick,
}) {
  // Loading
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Title', 'Patient', 'Description', 'Created', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
        {/* Mobile skeleton */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </>
    )
  }

  // Error
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive font-medium">{error.message}</p>
        <p className="text-xs text-muted-foreground mt-1">Please try refreshing the page.</p>
      </div>
    )
  }

  // Empty
  if (appointments.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />
  }

  const sharedProps = { appointments, onEdit, onDelete, isDeletingId }

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden md:block">
        <AppointmentTable {...sharedProps} />
      </div>
      {/* Mobile: cards */}
      <div className="md:hidden">
        <AppointmentCardGrid {...sharedProps} />
      </div>
    </>
  )
}
