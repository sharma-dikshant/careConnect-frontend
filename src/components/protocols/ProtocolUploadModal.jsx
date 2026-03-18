import { useEffect, useRef, useState } from 'react'
import { X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['application/pdf']
const MAX_SIZE_MB = 20

/**
 * Modal for uploading a PDF care protocol.
 * Supports drag-and-drop + click-to-browse.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: (file: File) => Promise<void>
 *  - isSubmitting: boolean
 *  - title?: string          — modal heading
 */
export function ProtocolUploadModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  title = 'Upload Protocol PDF',
}) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setFile(null)
      setError(null)
    }
  }, [isOpen])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  function validateFile(f) {
    if (!f) return 'No file selected.'
    if (!ACCEPTED_TYPES.includes(f.type)) return `Only PDF files are accepted.`
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File size must be under ${MAX_SIZE_MB} MB.`
    return null
  }

  function pickFile(f) {
    const err = validateFile(f)
    if (err) { setError(err); setFile(null) }
    else { setError(null); setFile(f) }
  }

  function handleInputChange(e) {
    pickFile(e.target.files?.[0] ?? null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files?.[0] ?? null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) { setError('Please select a PDF file.'); return }
    setError(null)
    try {
      await onSubmit(file)
    } catch (err) {
      setError(err.message ?? 'Upload failed. Please try again.')
    }
  }

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="upload-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <h2 id="upload-modal-title" className="text-base font-semibold">{title}</h2>
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Drop zone */}
          <div
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer',
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
              file && 'border-brand-green-400 bg-brand-green-50',
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop PDF here or click to browse"
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleInputChange}
            />

            {file ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-100 mb-3">
                  <FileText className="h-6 w-6 text-brand-green-600" />
                </div>
                <p className="font-medium text-sm text-foreground truncate max-w-[260px]">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{fileSizeMB} MB · PDF</p>
                <p className="text-xs text-brand-green-600 font-medium mt-2">✓ Ready to upload</p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drop your PDF here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  or <span className="text-primary font-medium">browse files</span>
                </p>
                <p className="text-xs text-muted-foreground mt-3">PDF only · Max {MAX_SIZE_MB} MB</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !file}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Upload PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
