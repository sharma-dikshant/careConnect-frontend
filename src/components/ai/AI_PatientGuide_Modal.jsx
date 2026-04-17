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
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
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

        {/* Panel */}
        <div
          ref={containerRef}
          className={cn(
            "relative z-10 w-full max-w-[1100px] rounded-2xl bg-background shadow-2xl",
            "flex flex-col animate-fade-in",
            "max-h-[90vh]",
          )}
          style={{ width: "min(95vw, 1100px)" }}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand-blue-700 shadow-sm">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h2 id="ai-modal-title" className="text-base font-bold">
                  ✨ AI Patient Guide Generator
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isAppointment ? "Appointment context" : "Protocol context"} —
                  powered by CareConnect AI
                </p>
              </div>
            </div>

            {/* Context badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  isAppointment
                    ? "bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200"
                    : "bg-accent text-accent-foreground border border-accent",
                )}
              >
                {isAppointment ? "📋 Appointment" : "📚 Protocol"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || isSaving}
              className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
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
                "flex flex-col gap-4 p-5 md:p-6 border-b md:border-b-0 md:border-r border-border",
                "md:w-[38%] shrink-0",
                "max-h-[40vh] md:max-h-none overflow-y-auto scrollbar-thin",
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
            <div className="flex-1 p-5 md:p-6 overflow-y-auto scrollbar-thin min-h-[260px] md:min-h-0">
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
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
            {/* Left side: regenerate + edit/preview toggle + copy */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={regenerate}
                disabled={isLoading || !prompt.trim() || isSaving}
                className="gap-2"
                id="ai-regenerate-btn"
              >
                {isLoading ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" /> Generating…
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </>
                )}
              </Button>

              {/* Edit / Preview toggle */}
              {hasMarkdown && !isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  disabled={isSaving}
                  className="gap-2"
                  id="ai-edit-toggle-btn"
                >
                  {isEditMode ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </>
                  )}
                </Button>
              )}

              {/* Copy to clipboard */}
              {hasMarkdown && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={isSaving}
                  className="gap-2"
                  id="ai-copy-btn"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Right side: cancel + download + primary CTA */}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isLoading || isSaving}
                id="ai-cancel-btn"
              >
                Cancel
              </Button>

              {/* Download PDF */}
              {hasMarkdown && !isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isSaving || isEditMode}
                  className="gap-2"
                  id="ai-download-btn"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              )}

              {/* Primary CTA */}
              <Button
                size="sm"
                onClick={handlePrimaryAction}
                disabled={!hasMarkdown || isLoading || isSaving}
                className="gap-2"
                id={
                  isAppointment
                    ? "ai-attach-appointment-btn"
                    : "ai-save-protocol-btn"
                }
              >
                {isSaving ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" /> Saving…
                  </>
                ) : isAppointment ? (
                  <>
                    <Paperclip className="h-4 w-4" />
                    Attach to Appointment
                  </>
                ) : (
                  <>
                    <BookMarked className="h-4 w-4" />
                    Save as Protocol
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
