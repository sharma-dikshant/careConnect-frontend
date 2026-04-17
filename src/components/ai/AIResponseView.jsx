import { Skeleton } from '@/components/ui/Skeleton'
import { AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { cn } from '@/lib/utils'

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

// ─── Patient guide page styles ───────────────────────────────────────────────
const GUIDE_PAGE_CLASS = cn(
  '[&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-center [&_h1]:pb-3',
  '[&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-1.5',
  '[&_blockquote]:rounded-lg [&_blockquote]:bg-primary/5 [&_blockquote]:py-2 [&_blockquote]:pr-3',
  '[&_li]:marker:text-primary/60',
  '[&_strong]:text-foreground',
)

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Right-panel that shows loading skeleton, error, empty prompt, or the rendered markdown result.
 *
 * The preview div (contentRef) is always mounted when markdown exists so that
 * PDF generation via html2pdf.js can capture it even during edit mode.
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

  const displayMarkdown = editedMarkdown || markdown

  return (
    <div className="flex flex-col h-full gap-3 animate-fade-in">
      {/* Result header */}
      <div className="flex items-center gap-2 rounded-xl bg-accent border border-accent px-3.5 py-2 shrink-0">
        <span className="text-sm font-medium text-accent-foreground">
          ✅ Patient guide generated — review{isEditMode ? ' and edit' : ''} below before saving
        </span>
      </div>

      {/* Edit mode: raw textarea — fills the remaining space */}
      {isEditMode && (
        <textarea
          id="ai-markdown-editor"
          value={editedMarkdown}
          onChange={(e) => onEditChange(e.target.value)}
          className="flex-1 w-full resize-none rounded-xl border border-input bg-background p-4 text-sm font-mono leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Edit patient guide markdown"
          spellCheck={false}
        />
      )}

      {/* PDF-style preview: always mounted for PDF capture, hidden off-screen during edit */}
      <div
        className={cn(
          isEditMode
            ? 'fixed left-[-9999px] top-0 w-[800px]'
            : 'flex-1 min-h-0 overflow-y-auto scrollbar-thin rounded-xl bg-neutral-100 dark:bg-neutral-800/50 p-4 md:p-6',
        )}
      >
        {/* White "page" — this is what html2pdf captures */}
        <div
          ref={contentRef}
          className={cn(
            'bg-white shadow-lg mx-auto py-8 px-8 md:py-10 md:px-10',
            !isEditMode && 'max-w-[680px] rounded-sm border border-neutral-200',
          )}
        >
          <MarkdownRenderer className={GUIDE_PAGE_CLASS}>
            {displayMarkdown}
          </MarkdownRenderer>
        </div>
      </div>
    </div>
  )
}
