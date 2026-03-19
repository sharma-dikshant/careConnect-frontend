import { useState, useCallback } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from '@/hooks/useAppointments'
import { AppointmentList } from '@/components/appointments/AppointmentList'
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal'
import { Button } from '@/components/ui/Button'
import { useQueryClient } from '@tanstack/react-query'

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function DeleteConfirmModal({ isOpen, appointmentTitle, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal role="dialog">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isDeleting ? onCancel : undefined} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 space-y-4 animate-fade-in">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Delete Appointment</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">"{appointmentTitle}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function DoctorAppointmentsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null) // null = create mode

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, title }

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useAppointments({ page, limit: 20 })
  const { mutateAsync: createApt, isPending: isCreating } = useCreateAppointment()
  const { mutateAsync: deleteApt, isPending: isDeleting } = useDeleteAppointment()

  // useUpdateAppointment needs the id — handle dynamically when editing
  const updateMutation = useUpdateAppointment(editingAppointment?.id)

  const appointments = data?.items ?? []
  const meta = data?.meta ?? {}

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreateModal = useCallback(() => {
    setEditingAppointment(null)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((apt) => {
    setEditingAppointment(apt)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingAppointment(null)
  }, [])

  async function handleFormSubmit(formData) {
    if (editingAppointment) {
      await updateMutation.mutateAsync(formData)
    } else {
      await createApt(formData)
    }
    closeModal()
  }

  function handleDeleteRequest(id) {
    const apt = appointments.find((a) => a.id === id)
    setDeleteTarget({ id, title: apt?.title ?? `#${id}` })
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteApt(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${meta.total ?? 0} total appointments`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            aria-label="Refresh appointments"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" onClick={openCreateModal} id="create-appointment-btn">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Appointment list (table on desktop / cards on mobile) */}
      <AppointmentList
        appointments={appointments}
        isLoading={isLoading}
        error={error}
        onEdit={openEditModal}
        onDelete={handleDeleteRequest}
        isDeletingId={deleteTarget?.id ?? null}
        onCreateClick={openCreateModal}
      />

      {/* Pagination */}
      {!isLoading && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {meta.page} of {meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.total_pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AppointmentFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        appointment={editingAppointment}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        appointmentTitle={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}
