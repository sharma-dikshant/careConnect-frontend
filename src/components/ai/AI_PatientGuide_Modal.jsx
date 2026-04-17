import { useEffect, useRef, useCallback, useState } from "react";
import {
  X,
  Sparkles,
  Paperclip,
  BookMarked,
  RefreshCw,
  Copy,
  Check,
  Edit2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { useAIPatientGuide } from "@/hooks/useAIPatientGuide";
import { PromptInput } from "./PromptInput";
import { AIResponseView } from "./AIResponseView";
import { cn } from "@/lib/utils";

// ─── Focus trap helper ────────────────────────────────────────────────────────
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useFocusTrap(containerRef, isOpen) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Focus the first focusable element
    const el = containerRef.current.querySelector(FOCUSABLE);
    el?.focus();

    function handleKeyDown(e) {
      if (e.key !== "Tab") return;
      const focusable = [...containerRef.current.querySelectorAll(FOCUSABLE)];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, containerRef]);
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

/**
 * Reusable AI Patient Guide Modal.
 *
 * Props:
 *  isOpen                  – boolean
 *  onClose                 – () => void
 *  context                 – "appointment" | "protocol"
 *  onAttachToAppointment   – (blob: Blob, filename: string) => void   [appointment context]
 *  onSaveAsProtocol        – (blob: Blob, filename: string) => void   [protocol context]
 */
export function AI_PatientGuide_Modal({
  isOpen,
  onClose,
  context = "appointment",
  onAttachToAppointment,
  onSaveAsProtocol,
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const {
    prompt,
    setPrompt,
    markdown,
    isEditMode,
    setIsEditMode,
    editedMarkdown,
    setEditedMarkdown,
    isLoading,
    isSaving,
    error,
    generate,
    regenerate,
    reset,
    copyToClipboard,
    downloadPDF,
    saveAsProtocol,
  } = useAIPatientGuide();

  useFocusTrap(containerRef, isOpen);

  // Close on Escape (blocked if loading/saving)
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e) {
      if (e.key === "Escape" && !isLoading && !isSaving) handleClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, isLoading, isSaving]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    reset();
    setCopied(false);
    onClose();
  }, [reset, onClose]);

  const handleCopy = useCallback(async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [copyToClipboard]);

  const handleDownload = useCallback(async () => {
    await downloadPDF(contentRef);
  }, [downloadPDF]);

  const handlePrimaryAction = useCallback(async () => {
    const uploadFn =
      context === "appointment" ? onAttachToAppointment : onSaveAsProtocol;
    if (!uploadFn) return;

    await saveAsProtocol(contentRef, {
      onUpload: async (blob, filename) => {
        await uploadFn(blob, filename);
        handleClose();
      },
    });
  }, [
    context,
    onAttachToAppointment,
    onSaveAsProtocol,
    saveAsProtocol,
    handleClose,
  ]);

  if (!isOpen) return null;

  const isAppointment = context === "appointment";
  const hasMarkdown = !!markdown;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={!isLoading && !isSaving ? handleClose : undefined}
          aria-hidden="true"
        />

        {/* Panel — full-screen on mobile, centered card on sm+ */}
        <div
          ref={containerRef}
          className={cn(
            "relative z-10 w-full bg-background shadow-2xl",
            "flex flex-col animate-fade-in",
            // Mobile: full height, top-rounded sheet
            "h-[100dvh] rounded-t-2xl",
            // sm+: centered card
            "sm:h-[90vh] sm:max-w-[1100px] sm:rounded-2xl",
          )}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-border shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="ai-modal-title" className="text-sm sm:text-base font-bold truncate">
                AI Patient Guide Generator
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isAppointment ? "Appointment context" : "Protocol context"} —
                powered by CareConnect AI
              </p>
            </div>

            {/* Context badge — md+ only */}
            <span
              className={cn(
                "hidden md:inline-flex rounded-full px-3 py-1 text-xs font-medium shrink-0",
                isAppointment
                  ? "bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200"
                  : "bg-accent text-accent-foreground border border-accent",
              )}
            >
              {isAppointment ? "📋 Appointment" : "📚 Protocol"}
            </span>

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || isSaving}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              aria-label="Close AI patient guide modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body: split layout ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Left panel — prompt */}
            <div
              className={cn(
                "flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 border-b md:border-b-0 md:border-r border-border",
                "md:w-[38%] shrink-0",
                "max-h-[35vh] md:max-h-none overflow-y-auto scrollbar-thin",
              )}
            >
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onGenerate={markdown ? regenerate : generate}
                isLoading={isLoading}
                hasResult={hasMarkdown}
              />
            </div>

            {/* Right panel — result */}
            <div className="flex-1 p-4 sm:p-5 md:p-6 overflow-y-auto scrollbar-thin min-h-0">
              <AIResponseView
                isLoading={isLoading}
                error={error}
                markdown={markdown}
                isEditMode={isEditMode}
                editedMarkdown={editedMarkdown}
                onEditChange={setEditedMarkdown}
                onRetry={markdown ? regenerate : generate}
                contentRef={contentRef}
              />
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4 border-t border-border bg-muted/30 sm:rounded-b-2xl shrink-0">
            {/* Left side: regenerate + edit/preview + copy (icon-only on mobile) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={regenerate}
                disabled={isLoading || !prompt.trim() || isSaving}
                className="gap-1.5"
                id="ai-regenerate-btn"
              >
                {isLoading ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? "Generating…" : "Regenerate"}
                </span>
              </Button>

              {hasMarkdown && !isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  disabled={isSaving}
                  className="gap-1.5"
                  id="ai-edit-toggle-btn"
                >
                  {isEditMode ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <Edit2 className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isEditMode ? "Preview" : "Edit"}
                  </span>
                </Button>
              )}

              {hasMarkdown && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={isSaving}
                  className="gap-1.5"
                  id="ai-copy-btn"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {copied ? <span className="text-green-600">Copied!</span> : "Copy"}
                  </span>
                </Button>
              )}
            </div>

            {/* Right side: download + primary CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {hasMarkdown && !isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isSaving}
                  className="gap-1.5"
                  id="ai-download-btn"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}

              <Button
                size="sm"
                onClick={handlePrimaryAction}
                disabled={!hasMarkdown || isLoading || isSaving}
                className="gap-1.5"
                id={
                  isAppointment
                    ? "ai-attach-appointment-btn"
                    : "ai-save-protocol-btn"
                }
              >
                {isSaving ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Saving…</span>
                  </>
                ) : isAppointment ? (
                  <>
                    <Paperclip className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Attach</span>
                  </>
                ) : (
                  <>
                    <BookMarked className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
