import { cn } from '@/lib/utils'

/**
 * Full-page centered spinner for route-level loading states.
 */
export function Spinner({ className, size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizes[size],
        className,
      )}
    />
  )
}

/**
 * Full-viewport centered loading overlay.
 */
export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground font-medium">Loading…</p>
      </div>
    </div>
  )
}
