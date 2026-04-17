import { useCallback, useState } from "react";
import { Upload, ClipboardList, RefreshCw, Sparkles } from "lucide-react";
import {
  useGlobalProtocols,
  useUploadGlobalProtocol,
  useDeleteCareProtocol,
} from "@/hooks/useCareProtocols";
import { ProtocolCard } from "@/components/protocols/ProtocolCard";
import { ProtocolUploadModal } from "@/components/protocols/ProtocolUploadModal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AI_PatientGuide_Modal } from "@/components/ai/AI_PatientGuide_Modal";

function ProtocolSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <Skeleton className="h-4 flex-1 rounded" />
      </div>
      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
        <Skeleton className="h-3 w-28 rounded" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No protocols yet</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
          Upload PDF documents to build your personal care protocol library.
        </p>
      </div>
      <Button size="sm" onClick={onAdd}>
        <Upload className="h-4 w-4" />
        Upload PDF
      </Button>
    </div>
  );
}

export function DoctorProtocolsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page] = useState(1);

  // AI Patient Guide modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const openAiModal = useCallback(() => setAiModalOpen(true), []);
  const closeAiModal = useCallback(() => setAiModalOpen(false), []);
  const handleSavePatientGuideAsProtocol = useCallback(
    (patientGuide) => {
      // TODO: wire to backend PDF/protocol save endpoint when ready
      console.info(
        "[CareConnect] Patient guide saved as protocol:",
        patientGuide,
      );
      closeAiModal();
    },
    [closeAiModal],
  );

  const { data, isLoading, error, refetch } = useGlobalProtocols({
    page,
    limit: 20,
  });
  const { mutateAsync: upload, isPending: isUploading } =
    useUploadGlobalProtocol();
  const { mutateAsync: remove } = useDeleteCareProtocol();

  const protocols = data?.items ?? [];
  const total = data?.meta?.total ?? 0;

  const openModal = useCallback(() => setModalOpen(true), []);

  async function handleUpload(file) {
    await upload(file);
    setModalOpen(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Care Protocols</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading
              ? "Loading…"
              : `${total} global protocol${total !== 1 ? "s" : ""} in your library`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openAiModal}
            id="ai-patient-guide-btn-protocol"
            className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Patient Guide</span>
            <span className="sm:hidden">AI Guide</span>
          </Button>
          <Button size="sm" onClick={openModal} id="upload-protocol-btn">
            <Upload className="h-4 w-4" />
            Upload PDF
          </Button>
        </div>
      </div>

      {/* Info callout */}
      <div className="rounded-xl bg-brand-blue-50 border border-brand-blue-200 px-4 py-3 text-sm text-brand-blue-800">
        <strong>Global protocols</strong> are your personal PDF library. They
        are automatically visible to patients in every appointment you create.
        Upload appointment-specific PDFs from within an appointment's detail
        page.
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
          protocols.map((p) => (
            <ProtocolCard
              key={p.id}
              protocol={p}
              type="global"
              onDelete={handleDelete}
              isDeleting={deletingId === p.id}
            />
          ))
        )}
      </div>

      {/* Upload modal */}
      <ProtocolUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpload}
        isSubmitting={isUploading}
        title="Upload Global Protocol PDF"
      />

      {/* AI Patient Guide Modal */}
      <AI_PatientGuide_Modal
        isOpen={aiModalOpen}
        onClose={closeAiModal}
        context="protocol"
        onSaveAsProtocol={handleSavePatientGuideAsProtocol}
      />
    </div>
  );
}
