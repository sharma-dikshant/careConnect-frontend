import { memo } from 'react'
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
function EmptyState({ isActive, onCreateClick }) {
  const isDoctor = typeof onCreateClick === 'function'
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
        <p className="font-semibold text-foreground">
          {isActive ? 'No active appointments' : 'No past appointments'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isActive
            ? isDoctor
              ? 'Create your first appointment to get started.'
              : 'Your doctor will add you to an appointment.'
            : 'Past or closed appointments will appear here.'}
        </p>
      </div>
      {isActive && isDoctor && (
        <Button size="sm" onClick={onCreateClick}>
          Create Appointment
        </Button>
      )}
    </div>
  )
}

// ─── Desktop Table (Doctor) ───────────────────────────────────────────────────
/**
 * Desktop table for doctor's appointment list.
 * Pass onEdit/onDelete as undefined to render in read-only (inactive) mode.
 */
export const AppointmentTable = memo(function AppointmentTable({
  appointments,
  isActive = true,
  onEdit,
  onDelete,
  isDeletingId,
}) {
  const showActions = isActive && (onEdit || onDelete)

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
            {showActions && (
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
            )}
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
                <Badge variant={isActive ? 'doctor' : 'inactive'}>
                  {isActive ? 'Active' : 'Past'}
                </Badge>
              </td>

              {/* Actions — only for active tab, doctor only */}
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(apt)}
                        aria-label={`Edit ${apt.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {onDelete && (
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
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

// ─── Mobile Card Grid ─────────────────────────────────────────────────────────
const AppointmentCardGrid = memo(function AppointmentCardGrid({
  appointments,
  role,
  isActive,
  onEdit,
  onDelete,
  isDeletingId,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {appointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          role={role}
          isActive={isActive}
          onEdit={isActive ? onEdit : undefined}
          onDelete={isActive ? onDelete : undefined}
          isDeleting={isDeletingId === apt.id}
        />
      ))}
    </div>
  )
})

// ─── Main exported component ──────────────────────────────────────────────────
/**
 * Responsive appointment list.
 * - Doctor: table on desktop, cards on mobile. Edit/delete only for active tab.
 * - Patient: cards always (no table). Read-only.
 *
 * Props:
 *  - appointments: array
 *  - isLoading: boolean
 *  - error: Error | null
 *  - role: 'doctor' | 'patient'
 *  - isActive: boolean              — which tab is being rendered
 *  - onEdit: (apt) => void          — doctor + active only
 *  - onDelete: (id) => void         — doctor + active only
 *  - isDeletingId: number | null
 *  - onCreateClick: () => void      — used by doctor empty state CTA
 */
export const AppointmentList = memo(function AppointmentList({
  appointments = [],
  isLoading = false,
  error = null,
  role = 'patient',
  isActive = true,
  onEdit,
  onDelete,
  isDeletingId = null,
  onCreateClick,
}) {
  const isDoctor = role === 'doctor'

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton (doctor only) */}
        {isDoctor && (
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
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Mobile / patient card skeleton */}
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isDoctor ? 'md:hidden' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive font-medium">{error.message}</p>
        <p className="text-xs text-muted-foreground mt-1">Please try refreshing the page.</p>
      </div>
    )
  }

  // Empty state
  if (appointments.length === 0) {
    return (
      <EmptyState
        isActive={isActive}
        onCreateClick={isDoctor ? onCreateClick : undefined}
      />
    )
  }

  const sharedCardProps = { appointments, role, isActive, onEdit, onDelete, isDeletingId }

  // Doctor: table on desktop, cards on mobile
  if (isDoctor) {
    return (
      <>
        <div className="hidden md:block">
          <AppointmentTable
            appointments={appointments}
            isActive={isActive}
            onEdit={isActive ? onEdit : undefined}
            onDelete={isActive ? onDelete : undefined}
            isDeletingId={isDeletingId}
          />
        </div>
        <div className="md:hidden">
          <AppointmentCardGrid {...sharedCardProps} />
        </div>
      </>
    )
  }

  // Patient: cards always
  return <AppointmentCardGrid {...sharedCardProps} />
})
