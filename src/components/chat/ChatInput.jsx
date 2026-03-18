import { useRef, useState } from 'react'
import { Send, Loader2, Mic } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Chat message input bar — patient only.
 *
 * Props:
 *  - onSend: (text: string) => void
 *  - isSending: boolean
 *  - disabled?: boolean   — true for doctor (read-only)
 */
export function ChatInput({ onSend, isSending, disabled = false }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || isSending) return
    onSend(trimmed)
    setText('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  // Auto-grow textarea (max 5 lines)
  function handleInput(e) {
    setText(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 130)}px`
    }
  }

  // Submit on Enter (Shift+Enter = newline)
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const canSend = text.trim().length > 0 && !isSending && !disabled

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-border bg-white px-3 py-2',
        'shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/40',
      )}
    >
      {/* Auto-grow textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSending}
        placeholder="Describe your symptoms or ask a question…"
        aria-label="Message"
        className={cn(
          'flex-1 resize-none bg-transparent text-sm leading-relaxed',
          'placeholder:text-muted-foreground',
          'focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'max-h-[130px] overflow-y-auto scrollbar-thin',
        )}
      />

      {/* Send button */}
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        className={cn(
          'h-9 w-9 shrink-0 rounded-xl transition-all',
          canSend ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground',
        )}
        aria-label="Send message"
      >
        {isSending
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Send className="h-4 w-4" />}
      </Button>
    </form>
  )
}

/**
 * Doctor read-only input bar — shown instead of ChatInput when role = doctor.
 */
export function ReadOnlyBar() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3">
      <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
      <p className="text-sm text-muted-foreground select-none">
        You are viewing this conversation as a doctor — messaging is disabled.
      </p>
    </div>
  )
}
