import { useEffect, useState } from 'react'
import { X, Loader2, CalendarPlus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { PatientSearchInput } from '@/components/appointments/PatientSearchInput'
import { ModalPortal } from '@/components/ui/ModalPortal'
import { cn } from '@/lib/utils'

/**
 * Modal dialog for creating or editing an appointment.
 *
 * Props:
 *  - isOpen: boolean         — whether the modal is visible
 *  - onClose: () => void     — close callback
 *  - appointment?: object    — if provided, runs in "edit" mode
 *  - onSubmit: (data) => Promise<void>  — called with form data
 *  - isSubmitting: boolean
 */
export function AppointmentFormModal({
  isOpen,
  onClose,
  appointment = null,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = !!appointment

  const [form, setForm] = useState({
    patientEmail: '',
    title: '',
    description: '',
  })
  const [error, setError] = useState(null)

  // Sync form when appointment changes (edit mode)
  useEffect(() => {
    if (isEdit) {
      setForm({
        patientEmail: appointment.patient?.email ?? '',
        title: appointment.title ?? '',
        description: appointment.description ?? '',
      })
    } else {
      setForm({ patientEmail: '', title: '', description: '' })
    }
    setError(null)
  }, [appointment, isOpen])

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      // In edit mode, only send title + description (patientEmail not allowed by API)
      const payload = isEdit
        ? { title: form.title, description: form.description }
        : form
      await onSubmit(payload)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Dim backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={!isSubmitting ? onClose : undefined}
        />

      {/* Modal panel */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl',
          'animate-fade-in',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              {isEdit
                ? <Pencil className="h-4 w-4 text-primary" />
                : <CalendarPlus className="h-4 w-4 text-primary" />}
            </div>
            <h2 id="modal-title" className="text-base font-semibold">
              {isEdit ? 'Edit Appointment' : 'New Appointment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Patient email — create mode only (autocomplete search) */}
          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="modal-patientEmail">Patient</Label>
              <PatientSearchInput
                id="modal-patientEmail"
                required
                value={form.patientEmail}
                onChange={(email) =>
                  setForm((prev) => ({ ...prev, patientEmail: email }))
                }
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-title">Title</Label>
            <Input
              id="modal-title"
              name="title"
              type="text"
              placeholder="e.g. Initial Consultation"
              required
              value={form.title}
              onChange={handleChange}
              autoFocus={isEdit}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-description">
              Description{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <textarea
              id="modal-description"
              name="description"
              rows={3}
              placeholder="Brief notes about this appointment…"
              value={form.description}
              onChange={handleChange}
              className={cn(
                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground resize-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'transition-colors',
              )}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </ModalPortal>
  )
}
