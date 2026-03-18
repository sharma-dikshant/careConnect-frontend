import { useCallback, useState } from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import { useProtocols, useCreateProtocol, useDeleteProtocol } from '@/hooks/useProtocols'
import { ProtocolCard } from '@/components/protocols/ProtocolCard'
import { ProtocolFormModal } from '@/components/protocols/ProtocolFormModal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

// ─── Skeleton grid ─────────────────────────────────────────────────────────────
function ProtocolSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-3">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <div className="pt-1 border-t border-border/60">
        <Skeleton className="h-3 w-28 rounded" />
      </div>
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No protocols yet</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
          Add your first protocol to share standard care instructions with patients.
        </p>
      </div>
      <Button size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add Protocol
      </Button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function DoctorProtocolsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const { data, isLoading, error } = useProtocols()
  const { mutateAsync: create, isPending: isCreating } = useCreateProtocol()
  const { mutateAsync: remove } = useDeleteProtocol()

  const protocols = data?.items ?? []
  const total = data?.meta?.total ?? 0

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  async function handleCreate(formData) {
    await create(formData)
    closeModal()
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await remove(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Protocols</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${total} protocol${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button size="sm" onClick={openModal} id="add-protocol-btn">
          <Plus className="h-4 w-4" />
          Add Protocol
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <ProtocolSkeleton key={i} />)
        ) : protocols.length === 0 ? (
          <EmptyState onAdd={openModal} />
        ) : (
          protocols.map((protocol) => (
            <ProtocolCard
              key={protocol.id}
              protocol={protocol}
              onDelete={handleDelete}
              isDeleting={deletingId === protocol.id}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <ProtocolFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />
    </div>
  )
}
