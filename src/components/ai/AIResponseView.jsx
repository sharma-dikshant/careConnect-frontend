import { useRef } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

// ─── Loading skeleton with typing dots ────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-full gap-5 animate-fade-in" aria-live="polite" aria-label="AI is generating">
      {/* Typing indicator */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
        <div className="flex gap-1 items-center">
          <span className="h-2 w-2 rounded-full bg-primary animate-typing-dot [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-typing-dot [animation-delay:200ms]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-typing-dot [animation-delay:400ms]" />
        </div>
        <span className="text-sm font-medium text-primary">AI is generating your patient guide…</span>
      </div>

      {/* Section skeletons */}
      {[70, 50, 90, 80, 60].map((w, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className={`h-16 w-[${w}%] rounded-xl`} style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  )
}

// ─── Empty / prompt state ─────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-muted-foreground py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No patient guide yet</p>
        <p className="text-sm mt-1 max-w-[220px]">
          Describe the patient's symptoms on the left and click <strong>Generate</strong>.
        </p>
      </div>
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 text-center py-12"
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <p className="font-semibold text-destructive">Generation Failed</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Right-panel that shows loading skeleton, error, empty prompt, or the rendered markdown result.
 *
 * Props:
 *  isLoading       – boolean
 *  error           – string | null
 *  markdown        – string | null
 *  isEditMode      – boolean
 *  editedMarkdown  – string
 *  onEditChange    – (val: string) => void
 *  onRetry         – () => void
 *  contentRef      – React.RefObject  (attached to the preview div for PDF targeting)
 */
export function AIResponseView({
  isLoading,
  error,
  markdown,
  isEditMode,
  editedMarkdown,
  onEditChange,
  onRetry,
  contentRef,
}) {
  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!markdown) return <EmptyState />

  return (
    <div className="flex flex-col h-full gap-3 animate-fade-in">
      {/* Result header */}
      <div className="flex items-center gap-2 rounded-xl bg-accent border border-accent px-3.5 py-2">
        <span className="text-sm font-medium text-accent-foreground">
          ✅ Patient guide generated — review{isEditMode ? ' and edit' : ''} below before saving
        </span>
      </div>

      {isEditMode ? (
        /* Edit mode: raw textarea */
        <textarea
          id="ai-markdown-editor"
          value={editedMarkdown}
          onChange={(e) => onEditChange(e.target.value)}
          className="flex-1 w-full resize-none rounded-xl border border-input bg-background p-4 text-sm font-mono leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[320px]"
          aria-label="Edit patient guide markdown"
          spellCheck={false}
        />
      ) : (
        /* Preview mode: rendered markdown */
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto scrollbar-thin rounded-xl border border-border bg-white/60 p-4 min-h-[320px]"
        >
          <MarkdownRenderer>{isEditMode ? editedMarkdown : markdown}</MarkdownRenderer>
        </div>
      )}
    </div>
  )
}
