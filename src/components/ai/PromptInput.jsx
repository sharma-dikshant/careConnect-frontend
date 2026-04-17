import { useRef, useEffect } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const MAX_CHARS = 600

/**
 * Left-panel prompt input area for the AI patient guide modal.
 *
 * Props:
 *  value        – string
 *  onChange     – (val: string) => void
 *  onGenerate   – () => void
 *  isLoading    – boolean
 *  hasResult    – boolean  (used to label button "Regenerate")
 */
export function PromptInput({ value, onChange, onGenerate, isLoading, hasResult }) {
  const textareaRef = useRef(null)

  // Auto-focus when mounted
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleKey(e) {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isLoading && value.trim()) onGenerate()
    }
  }

  const remaining = MAX_CHARS - value.length
  const isOverLimit = remaining < 0

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Describe Symptoms</p>
          <p className="text-xs text-muted-foreground">AI will generate a patient guide</p>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          id="ai-prompt-textarea"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS + 50))}
          onKeyDown={handleKey}
          placeholder={`e.g. "Patient has fever, headache, mild cough for 2 days. No known allergies."`}
          aria-label="Patient symptom description"
          aria-describedby="ai-prompt-hint"
          disabled={isLoading}
          rows={8}
          className={cn(
            'flex-1 w-full resize-none rounded-xl border bg-background p-3.5 text-sm leading-relaxed',
            'placeholder:text-muted-foreground/60 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isOverLimit ? 'border-destructive' : 'border-input',
            isLoading && 'opacity-60 cursor-not-allowed',
          )}
        />
        {/* Char counter */}
        <div className="flex items-center justify-between mt-1.5 px-0.5">
          <p id="ai-prompt-hint" className="text-xs text-muted-foreground">
            Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">⌘ Enter</kbd> to generate
          </p>
          <span className={cn('text-xs', isOverLimit ? 'text-destructive' : 'text-muted-foreground')}>
            {remaining} chars left
          </span>
        </div>
      </div>

      {/* Generate button */}
      <Button
        id="ai-generate-btn"
        onClick={onGenerate}
        disabled={isLoading || !value.trim() || isOverLimit}
        className="w-full gap-2"
        size="lg"
        aria-label={hasResult ? 'Regenerate patient guide' : 'Generate patient guide'}
      >
        <Send className="h-4 w-4" />
        {hasResult ? 'Regenerate' : 'Generate Patient Guide'}
      </Button>
    </div>
  )
}

