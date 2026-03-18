import { CalendarDays, FileText, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

/**
 * Single protocol card — minimal, clean.
 *
 * Props:
 *  - protocol: { id, title, description, created_at }
 *  - onDelete: (id) => void
 *  - isDeleting: boolean
 */
export function ProtocolCard({ protocol, onDelete, isDeleting }) {
  return (
    <Card className="group hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm leading-snug text-foreground truncate">
              {protocol.title}
            </h3>
          </div>

          {/* Delete — appears on hover (desktop) / always visible (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(protocol.id)}
            disabled={isDeleting}
            aria-label={`Delete protocol: ${protocol.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        {protocol.description ? (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {protocol.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/50 italic">No description provided.</p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Added {formatDate(protocol.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
