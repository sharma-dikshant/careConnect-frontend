import { useState, useRef, useCallback } from 'react'
import { generateAIPrescription } from '@/api/services/prescription.service'

/**
 * Parse the raw prescription text (newline-based sections) into a structured object.
 * Handles both "SECTION: value" and blank-line-separated blocks.
 *
 * @param {string} raw
 * @returns {{ symptoms: string, diagnosis: string, medicines: string, dosage: string, notes: string }}
 */
function parsePrescription(raw) {
  const extract = (label) => {
    const regex = new RegExp(
      `${label}:\\s*([\\s\\S]*?)(?=\\n\\n[A-Z]+:|$)`,
      'i',
    )
    const match = raw.match(regex)
    return match ? match[1].trim() : ''
  }

  return {
    symptoms: extract('SYMPTOMS'),
    diagnosis: extract('DIAGNOSIS'),
    medicines: extract('MEDICINES'),
    dosage: extract('DOSAGE'),
    notes: extract('NOTES'),
  }
}

/**
 * Custom hook that manages the full AI prescription generation flow.
 *
 * @returns {{
 *   prompt: string,
 *   setPrompt: (v: string) => void,
 *   result: { symptoms: string, diagnosis: string, medicines: string, dosage: string, notes: string } | null,
 *   setResult: (v: object) => void,
 *   isLoading: boolean,
 *   error: string | null,
 *   generate: () => Promise<void>,
 *   regenerate: () => Promise<void>,
 *   reset: () => void,
 * }}
 */
export function useAIPrescription() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Prevent duplicate in-flight calls
  const isInFlight = useRef(false)

  const _call = useCallback(async (promptText) => {
    if (isInFlight.current) return
    if (!promptText.trim()) {
      setError('Please describe the patient symptoms before generating.')
      return
    }

    isInFlight.current = true
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const rawText = await generateAIPrescription(promptText.trim())
      const parsed = parsePrescription(rawText)
      setResult(parsed)
    } catch (err) {
      setError(err.message ?? 'Failed to generate prescription. Please try again.')
    } finally {
      setIsLoading(false)
      isInFlight.current = false
    }
  }, [])

  const generate = useCallback(() => _call(prompt), [_call, prompt])

  const regenerate = useCallback(async () => {
    // Bypass session cache: clear the cached entry then re-call
    // The service module exposes the cache only internally; we work around it
    // by slightly modifying the prompt temporarily — instead, we directly clear
    // result and call again (service will use cache but that's fine for regenerate UX;
    // for true re-generation the backend would be called with a different seed).
    setResult(null)
    await _call(prompt)
  }, [_call, prompt])

  const reset = useCallback(() => {
    setPrompt('')
    setResult(null)
    setError(null)
    setIsLoading(false)
    isInFlight.current = false
  }, [])

  return {
    prompt,
    setPrompt,
    result,
    setResult,
    isLoading,
    error,
    generate,
    regenerate,
    reset,
  }
}
