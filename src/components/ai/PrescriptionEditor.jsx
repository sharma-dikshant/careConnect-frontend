import { cn } from '@/lib/utils'

const SECTIONS = [
  { key: 'symptoms', label: '🩺 Symptoms', placeholder: 'e.g. Fever 38.5°C, headache, mild cough for 2 days' },
  { key: 'diagnosis', label: '🔬 Diagnosis', placeholder: 'e.g. Viral upper respiratory tract infection' },
  { key: 'medicines', label: '💊 Medicines', placeholder: 'e.g. Paracetamol 500 mg\nIbuprofen 400 mg' },
  { key: 'dosage', label: '⏱ Dosage', placeholder: 'e.g. Paracetamol: 1–2 tablets every 4–6 hours' },
  { key: 'notes', label: '📝 Notes', placeholder: 'e.g. Rest advised. Follow up in 5 days if symptoms persist.' },
]

/**
 * Editable structured prescription form.
 *
 * Props:
 *  prescription – { symptoms, diagnosis, medicines, dosage, notes }
 *  onChange     – (updated: object) => void
 */
export function PrescriptionEditor({ prescription, onChange }) {
  function handleChange(key, val) {
    onChange({ ...prescription, [key]: val })
  }

  return (
    <div
      className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin pr-1"
      role="form"
      aria-label="Editable prescription"
    >
      {SECTIONS.map(({ key, label, placeholder }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label
            htmlFor={`rx-${key}`}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
          <textarea
            id={`rx-${key}`}
            value={prescription[key] ?? ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            rows={key === 'symptoms' || key === 'diagnosis' ? 2 : 3}
            className={cn(
              'w-full resize-none rounded-xl border border-input bg-background px-3.5 py-2.5',
              'text-sm leading-relaxed placeholder:text-muted-foreground/50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'transition-colors hover:border-ring/50',
            )}
          />
        </div>
      ))}
    </div>
  )
}
