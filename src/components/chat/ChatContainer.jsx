import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { Skeleton } from '@/components/ui/Skeleton'

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function MessageSkeleton({ align }) {
  return (
    <div className={`flex items-end gap-2 ${align === 'end' ? 'flex-row-reverse' : 'flex-row'}`}>
      <Skeleton className="h-7 w-7 rounded-full shrink-0" />
      <Skeleton
        className={`h-14 rounded-2xl ${
          align === 'end' ? 'rounded-br-none w-2/3' : 'rounded-bl-none w-3/5'
        }`}
      />
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyChat({ viewerRole }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Bot className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-sm text-foreground">No messages yet</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
          {viewerRole === 'patient'
            ? 'Send a message to get AI-assisted guidance from our bot.'
            : 'The patient has not sent any messages yet.'}
        </p>
      </div>
    </div>
  )
}

// ─── Date divider between message groups ──────────────────────────────────────
function DateDivider({ date }) {
  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border shrink-0">
        {date}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

/**
 * Formats a date string to a readable day label.
 * "Today", "Yesterday", or "Mar 17, 2026"
 */
function getDayLabel(isoString) {
  const d = new Date(isoString)
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now - 86400000).toDateString()
  if (d.toDateString() === today) return 'Today'
  if (d.toDateString() === yesterday) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Main chat scrollable area.
 *
 * Props:
 *  - messages: array
 *  - isLoading: boolean
 *  - viewerRole: 'doctor' | 'patient'
 */
export function ChatContainer({ messages = [], isLoading, viewerRole }) {
  const bottomRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[
          { align: 'end' },
          { align: 'start' },
          { align: 'start' },
          { align: 'end' },
          { align: 'start' },
        ].map((s, i) => (
          <MessageSkeleton key={i} align={s.align} />
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyChat viewerRole={viewerRole} />
      </div>
    )
  }

  // Group messages by day and insert date dividers
  const grouped = []
  let lastDay = null

  // Reverse to render oldest at top and newest at bottom
  const displayMessages = [...messages].reverse()

  for (const msg of displayMessages) {
    const day = getDayLabel(msg.created_at)
    if (day !== lastDay) {
      grouped.push({ type: 'divider', day })
      lastDay = day
    }
    grouped.push({ type: 'message', msg })
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-2">
      {grouped.map((item, idx) =>
        item.type === 'divider' ? (
          <DateDivider key={`d-${idx}`} date={item.day} />
        ) : (
          <MessageBubble key={item.msg.id} message={item.msg} viewerRole={viewerRole} />
        ),
      )}
      <div ref={bottomRef} />
    </div>
  )
}
