import { useEffect, useState } from 'react'
import { X, Loader2, FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'

/**
 * Reusable modal for adding a protocol (title + description).
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: ({ title, description }) => Promise<void>
 *  - isSubmitting: boolean
 */
export function ProtocolFormModal({ isOpen, onClose, onSubmit, isSubmitting = false }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState(null)

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', description: '' })
      setError(null)
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setError(null)
    try {
      await onSubmit({ title: form.title.trim(), description: form.description.trim() })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="protocol-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Panel */}
      <div className={cn('relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-fade-in')}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FilePlus className="h-4 w-4 text-primary" />
            </div>
            <h2 id="protocol-modal-title" className="text-base font-semibold">
              New Protocol
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="protocol-title">Title</Label>
            <Input
              id="protocol-title"
              name="title"
              placeholder="e.g. Post-Operative Care"
              required
              value={form.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="protocol-description">
              Description{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <textarea
              id="protocol-description"
              name="description"
              rows={4}
              placeholder="Describe the protocol steps, frequency, or patient instructions…"
              value={form.description}
              onChange={handleChange}
              className={cn(
                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'transition-colors',
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Protocol
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
