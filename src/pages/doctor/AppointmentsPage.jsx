import { useState, useCallback, memo } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from '@/hooks/useAppointments'
import { AppointmentList } from '@/components/appointments/AppointmentList'
import { AppointmentTabs } from '@/components/appointments/AppointmentTabs'
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal'
import { Button } from '@/components/ui/Button'

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = memo(function DeleteConfirmModal({
  isOpen,
  appointmentTitle,
  onConfirm,
  onCancel,
  isDeleting,
}) {
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
})

// ─── Tab Panel Content ────────────────────────────────────────────────────────
function TabPanel({ id, isVisible, children }) {
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
      className={isVisible ? 'animate-fade-in' : ''}
    >
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function DoctorAppointmentsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('active')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, title }

  // ── Data hooks — separate cache per tab ────────────────────────────────────
  const activeQuery = useAppointments({ active: true, limit: 50 })
  const inactiveQuery = useAppointments({ active: false, limit: 50 })

  const activeAppointments = activeQuery.data?.items ?? []
  const inactiveAppointments = inactiveQuery.data?.items ?? []

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutateAsync: createApt, isPending: isCreating } = useCreateAppointment()
  const { mutateAsync: deleteApt, isPending: isDeleting } = useDeleteAppointment()
  const updateMutation = useUpdateAppointment(editingAppointment?.id)

  // ── Tab switch ────────────────────────────────────────────────────────────
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  // ── Modal handlers ─────────────────────────────────────────────────────────
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

  // ── Delete handlers ────────────────────────────────────────────────────────
  function handleDeleteRequest(id) {
    const apt = activeAppointments.find((a) => a.id === id)
    setDeleteTarget({ id, title: apt?.title ?? `#${id}` })
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteApt(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const isActiveTab = activeTab === 'active'
  const currentQuery = isActiveTab ? activeQuery : inactiveQuery

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {currentQuery.isLoading
              ? 'Loading…'
              : `${isActiveTab ? activeAppointments.length : inactiveAppointments.length} ${isActiveTab ? 'active' : 'past'} appointments`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => currentQuery.refetch()}
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

      {/* Segmented tab control */}
      <AppointmentTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        counts={{
          active: activeQuery.isLoading ? undefined : activeAppointments.length,
          inactive: inactiveQuery.isLoading ? undefined : inactiveAppointments.length,
        }}
      />

      {/* Tab panels */}
      <TabPanel id="active" isVisible={isActiveTab}>
        <AppointmentList
          appointments={activeAppointments}
          isLoading={activeQuery.isLoading}
          error={activeQuery.error}
          role="doctor"
          isActive={true}
          onEdit={openEditModal}
          onDelete={handleDeleteRequest}
          isDeletingId={deleteTarget?.id ?? null}
          onCreateClick={openCreateModal}
        />
      </TabPanel>

      <TabPanel id="inactive" isVisible={!isActiveTab}>
        <AppointmentList
          appointments={inactiveAppointments}
          isLoading={inactiveQuery.isLoading}
          error={inactiveQuery.error}
          role="doctor"
          isActive={false}
          // No onEdit / onDelete — inactive tab is read-only
          isDeletingId={null}
        />
      </TabPanel>

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
