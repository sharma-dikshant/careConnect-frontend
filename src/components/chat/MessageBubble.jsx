import { Bot, User, Stethoscope } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

/**
 * Sender configuration: maps sender key → visual identity
 */
const SENDER_CONFIG = {
  patient: {
    label: 'Patient',
    icon: User,
    /** Right-aligned, blue bubble */
    bubbleClass: 'bg-primary text-white rounded-br-none',
    timeClass: 'text-blue-200',
    avatarClass: 'bg-primary text-white',
    align: 'end',
  },
  bot: {
    label: 'AI Assistant',
    icon: Bot,
    /** Left-aligned, light bubble */
    bubbleClass: 'bg-white text-foreground border border-border rounded-bl-none',
    timeClass: 'text-muted-foreground',
    avatarClass: 'bg-brand-green-100 text-brand-green-700',
    align: 'start',
  },
  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    /** Left-aligned, slate bubble */
    bubbleClass: 'bg-brand-slate-100 text-foreground border border-border rounded-bl-none',
    timeClass: 'text-muted-foreground',
    avatarClass: 'bg-brand-blue-100 text-brand-blue-700',
    align: 'start',
  },
}

/**
 * Single chat message bubble — WhatsApp style.
 *
 * Props:
 *  - message: { id, sender, message, created_at, _optimistic? }
 *  - viewerRole: 'doctor' | 'patient'  — determines which side "you" is on
 */
export function MessageBubble({ message, viewerRole }) {
  const sender = message.sender ?? 'bot'
  const config = SENDER_CONFIG[sender] ?? SENDER_CONFIG.bot
  const Icon = config.icon

  const isOwn =
    (viewerRole === 'patient' && sender === 'patient') ||
    (viewerRole === 'doctor' && sender === 'doctor')

  return (
    <div
      className={cn(
        'flex items-end gap-2 animate-fade-in',
        isOwn ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Sender avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          config.avatarClass,
          // Slightly faded for optimistic messages
          message._optimistic && 'opacity-60',
        )}
        aria-hidden="true"
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col gap-0.5 max-w-[72%]', isOwn ? 'items-end' : 'items-start')}>
        {/* Sender label (shown on non-own messages) */}
        {!isOwn && (
          <span className="text-[11px] font-semibold text-muted-foreground px-1">
            {config.label}
          </span>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
            config.bubbleClass,
            message._optimistic && 'opacity-75',
          )}
        >
          {sender === 'bot' || sender === 'doctor' ? (
            <MarkdownRenderer>{message.message}</MarkdownRenderer>
          ) : (
            message.message
          )}
        </div>

        {/* Timestamp + status */}
        <div className={cn('flex items-center gap-1 px-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
          <span className={cn('text-[10px]', config.timeClass)}>
            {formatDateTime(message.created_at)}
          </span>
          {message._optimistic && (
            <span className="text-[10px] text-muted-foreground italic">sending…</span>
          )}
        </div>
      </div>
    </div>
  )
}
