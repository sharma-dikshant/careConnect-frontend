import { useState } from 'react'
import { Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import {
  useAppointmentProtocols,
  useUploadAppointmentProtocol,
  useDeleteCareProtocol,
} from '@/hooks/useCareProtocols'
import { ProtocolCard } from '@/components/protocols/ProtocolCard'
import { ProtocolUploadModal } from '@/components/protocols/ProtocolUploadModal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Separator } from '@/components/ui/Separator'
import { ROLES } from '@/lib/constants'

function ProtocolSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-white p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
          <Skeleton className="h-3 w-28 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Panel embedded in the Appointment Detail page.
 * Shows appointment-scoped + doctor's global (active) protocols.
 * Doctors can upload new appointment PDFs. Patients are read-only.
 *
 * Props:
 *  - appointmentId: number | string
 *  - viewerRole: 'doctor' | 'patient'
 */
export function AppointmentProtocolsPanel({ appointmentId, viewerRole }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const isDoctor = viewerRole === ROLES.DOCTOR

  const { data, isLoading, error } = useAppointmentProtocols(appointmentId)
  const { mutateAsync: upload, isPending: isUploading } = useUploadAppointmentProtocol(appointmentId)
  const { mutateAsync: remove } = useDeleteCareProtocol()

  const aptProtocols = data?.appointment_protocols?.items ?? []
  const globalProtocols = data?.doctor_protocols?.items ?? []
  const totalCount = aptProtocols.length + globalProtocols.length

  async function handleUpload(file) {
    await upload(file)
    setModalOpen(false)
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try { await remove(id) }
    finally { setDeletingId(null) }
  }

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors"
        >
          <FileText className="h-4 w-4 text-primary" />
          Care Protocols
          <span className="text-xs text-muted-foreground font-normal">
            ({isLoading ? '…' : totalCount})
          </span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isDoctor && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs"
            onClick={() => setModalOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" />
            Attach PDF
          </Button>
        )}
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-5">
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}

          {isLoading ? (
            <ProtocolSectionSkeleton />
          ) : totalCount === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-center">
              <FileText className="h-8 w-8 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">No protocols attached yet.</p>
              {isDoctor && (
                <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                  <Upload className="h-4 w-4" />
                  Attach first PDF
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Appointment-scoped protocols */}
              {aptProtocols.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Appointment PDFs
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aptProtocols.map((p) => (
                      <ProtocolCard
                        key={p.id}
                        protocol={p}
                        type="appointment"
                        onDelete={isDoctor ? handleDelete : undefined}
                        isDeleting={deletingId === p.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {aptProtocols.length > 0 && globalProtocols.length > 0 && (
                <Separator />
              )}

              {/* Doctor's global library */}
              {globalProtocols.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Doctor's Library
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {globalProtocols.map((p) => (
                      <ProtocolCard
                        key={p.id}
                        protocol={p}
                        type="global"
                        // Global protocols are not deletable from appointment context
                        onDelete={undefined}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Upload modal */}
      <ProtocolUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpload}
        isSubmitting={isUploading}
        title="Attach Protocol PDF to Appointment"
      />
    </div>
  )
}
