import { useState } from 'react'
import { FileText, Download, Trash2, ExternalLink, CalendarDays, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useDownloadProtocol } from '@/hooks/useCareProtocols'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * PDF-based protocol card.
 *
 * Props:
 *  - protocol: { id, file, s3_key, active, created_at }
 *  - type: 'global' | 'appointment'
 *  - onDelete?: (id) => void   — undefined means no delete (patient view)
 *  - isDeleting?: boolean
 *  - showBadge?: boolean       — show "Global" / "Appointment" badge
 */
export function ProtocolCard({
  protocol,
  type = 'global',
  onDelete,
  isDeleting = false,
  showBadge = false,
}) {
  const { mutate: download, isPending: isDownloading } = useDownloadProtocol(type)

  // Extract filename from S3 key or URL
  const rawKey = protocol.s3_key ?? protocol.file ?? ''
  const filename = rawKey.split('/').pop() || 'protocol.pdf'
  // Strip UUID prefix (format: uuid_filename.pdf)
  const displayName = filename.replace(/^[0-9a-f-]{36}_/, '')

  return (
    <Card
      className={cn(
        'group hover:shadow-md hover:border-primary/30 transition-all duration-200',
        !protocol.active && 'opacity-50',
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-sm text-foreground leading-snug truncate"
              title={displayName}
            >
              {displayName}
            </p>
            {showBadge && (
              <Badge
                variant={type === 'global' ? 'secondary' : 'doctor'}
                className="text-[10px] px-1.5 py-0 mt-1"
              >
                {type === 'global' ? 'Global' : 'Appointment'}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {protocol.description ? (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {protocol.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/50 italic">No description provided.</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{formatDate(protocol.created_at)}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Download */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => download(protocol.id)}
              disabled={isDownloading}
              aria-label={`Download ${displayName}`}
              title="Download PDF"
            >
              {isDownloading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
            </Button>

            {/* Open in new tab (direct link if available) */}
            {protocol.file && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => window.open(protocol.file, '_blank', 'noopener,noreferrer')}
                aria-label="Open in new tab"
                title="Open PDF in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Delete — doctor only */}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(protocol.id)}
                disabled={isDeleting}
                aria-label={`Delete ${displayName}`}
                title="Delete protocol"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
