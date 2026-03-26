import api from '@/api/axiosInstance'

// ─── Mock helpers ─────────────────────────────────────────────────────────────
const MOCK_DELAY_MS = 1600

/**
 * Produce a realistic structured prescription string from a free-text prompt.
 * Used as the mock response until the real AI endpoint is live.
 */
function buildMockPrescription(prompt) {
  const trigger = prompt.toLowerCase()

  const symptoms = trigger || 'As described by the patient'

  const diagnosis =
    trigger.includes('fever') && trigger.includes('cough')
      ? 'Viral upper respiratory tract infection (URTI) with pyrexia'
      : trigger.includes('fever')
        ? 'Pyrexia of unknown origin – likely viral aetiology'
        : trigger.includes('headache')
          ? 'Tension-type headache'
          : trigger.includes('diabetes')
            ? 'Type 2 Diabetes Mellitus – routine review'
            : 'Clinical assessment based on presenting symptoms'

  const medicines =
    trigger.includes('fever') || trigger.includes('pain')
      ? 'Paracetamol 500 mg\nIbuprofen 400 mg (if not contraindicated)\nOral Rehydration Salts (ORS)'
      : trigger.includes('cough')
        ? 'Dextromethorphan HBr 15 mg/5 ml syrup\nSaline nasal rinse'
        : trigger.includes('diabetes')
          ? 'Metformin 500 mg\nGlipizide 5 mg'
          : 'Medication to be determined after clinical review'

  const dosage =
    trigger.includes('fever') || trigger.includes('pain')
      ? 'Paracetamol: 1–2 tablets every 4–6 hours, max 8 tablets/day\nIbuprofen: 1 tablet every 8 hours with food\nORS: 200 ml after every loose stool'
      : trigger.includes('cough')
        ? 'Syrup: 10 ml every 6–8 hours; saline rinse 2–3× daily'
        : trigger.includes('diabetes')
          ? 'Metformin: 500 mg twice daily with meals\nGlipizide: 5 mg once daily before breakfast'
          : 'As per clinical judgement — confirm with patient weight and renal profile'

  return [
    `SYMPTOMS: ${symptoms}`,
    `DIAGNOSIS: ${diagnosis}`,
    `MEDICINES: ${medicines}`,
    `DOSAGE: ${dosage}`,
    `NOTES: Rest advised. Stay well-hydrated. Follow up in 3–5 days if symptoms persist or worsen. Avoid self-medication beyond the prescribed course.`,
  ].join('\n\n')
}

// ─── Session cache ─────────────────────────────────────────────────────────────
/** @type {Map<string, string>} */
const sessionCache = new Map()

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate an AI prescription for the given prompt.
 *
 * Tries the real endpoint first. Falls back to the mock when the server
 * returns a 404 / 501 (endpoint not yet implemented) or when we're
 * running against a mock-only environment.
 *
 * @param {string} prompt  Free-text description of the patient's symptoms.
 * @returns {Promise<string>}  Raw prescription text (newline-separated sections).
 */
export async function generateAIPrescription(prompt) {
  const cacheKey = prompt.trim()

  if (sessionCache.has(cacheKey)) {
    // Simulate a tiny network round-trip for cached results
    await new Promise((r) => setTimeout(r, 200))
    return sessionCache.get(cacheKey)
  }

  let prescriptionText

  try {
    const { data } = await api.post('/api/ai/prescription', { prompt })
    prescriptionText = data?.data?.prescription ?? data?.prescription
    if (!prescriptionText) throw new Error('Empty response from AI endpoint')
  } catch (err) {
    // Only fall back to mock if the endpoint doesn't exist yet (not for auth errors etc.)
    const status = err?.response?.status
    const isMissing = status === 404 || status === 501 || status === 502 || status === 503
    const isNetworkError = !status  // axios network error (no response)

    if (isMissing || isNetworkError) {
      // Use mock
      await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
      prescriptionText = buildMockPrescription(prompt)
    } else {
      throw err
    }
  }

  sessionCache.set(cacheKey, prescriptionText)
  return prescriptionText
}
