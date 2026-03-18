import { useEffect, useRef, useState } from 'react'
import { Loader2, Search, UserCheck, X } from 'lucide-react'
import { searchUsers } from '@/api/services/user.service'
import { Input } from '@/components/ui/Input'
import { cn, getInitials } from '@/lib/utils'

/**
 * Patient email autocomplete input.
 *
 * Debounces the user's input, calls GET /api/users/search?role=patient&email=<query>,
 * and renders a dropdown with matching patient name + email suggestions.
 *
 * Props:
 *  - value: string               — controlled email value
 *  - onChange: (email) => void   — called with the selected / typed email
 *  - id?: string
 *  - required?: boolean
 */
export function PatientSearchInput({ value, onChange, id = 'patientEmail', required = false }) {
  const [query, setQuery] = useState(value ?? '')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current)

    const trimmed = query.trim()

    // If user cleared the field, also clear selection
    if (!trimmed) {
      setResults([])
      setIsOpen(false)
      onChange('')
      setSelectedPatient(null)
      return
    }

    // Don't search if we just selected a suggestion
    if (selectedPatient && selectedPatient.email === trimmed) return

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await searchUsers({ role: 'patient', email: trimmed, limit: 8 })
        const patients = res?.data?.data ?? []
        setResults(patients)
        setIsOpen(patients.length > 0)
      } catch {
        setResults([])
        setIsOpen(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)
    setSelectedPatient(null)
    onChange(val) // keep parent form value in sync while typing
  }

  function handleSelect(patient) {
    setQuery(patient.email)
    setSelectedPatient(patient)
    onChange(patient.email)
    setIsOpen(false)
    setResults([])
  }

  function handleClear() {
    setQuery('')
    setSelectedPatient(null)
    onChange('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          name="patientEmail"
          type="email"
          placeholder="Search by patient email…"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          autoComplete="off"
          className="pl-9 pr-9"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="patient-search-listbox"
        />
        {/* Right-side indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isSearching && selectedPatient && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Selected patient pill */}
      {selectedPatient && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-brand-green-50 border border-brand-green-200 px-3 py-2">
          <UserCheck className="h-4 w-4 text-brand-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-green-800 truncate">
              {selectedPatient.name}
            </p>
            <p className="text-xs text-brand-green-600 truncate">{selectedPatient.email}</p>
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          id="patient-search-listbox"
          role="listbox"
          aria-label="Patient suggestions"
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 rounded-xl border border-border',
            'bg-white shadow-xl overflow-hidden',
            'animate-fade-in',
          )}
        >
          <li className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
            {results.length} patient{results.length !== 1 ? 's' : ''} found
          </li>
          {results.map((patient) => (
            <li
              key={patient.id}
              role="option"
              aria-selected={selectedPatient?.id === patient.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 cursor-pointer',
                'hover:bg-primary/5 transition-colors',
                selectedPatient?.id === patient.id && 'bg-primary/10',
              )}
              onMouseDown={(e) => {
                // mousedown fires before blur; prevent input from losing focus prematurely
                e.preventDefault()
                handleSelect(patient)
              }}
            >
              {/* Avatar initials */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue-100 text-brand-blue-700 text-xs font-semibold">
                {getInitials(patient.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
              </div>
              {selectedPatient?.id === patient.id && (
                <UserCheck className="h-4 w-4 text-primary shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
