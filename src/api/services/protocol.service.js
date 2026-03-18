/**
 * Protocol API service — placeholder layer.
 *
 * All functions are wired to the same pattern as the real services so
 * swapping to a live endpoint only requires changing the function body.
 *
 * Expected protocol shape:
 *   { id: number, title: string, description: string, created_at: string }
 */

// ── Local in-memory store (simulates a server) ────────────────────────────────
let _protocols = [
  {
    id: 1,
    title: 'Post-Operative Care',
    description:
      'Instructions for wound care, medications, and follow-up scheduling after surgery.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'Hypertension Management',
    description:
      'Lifestyle modifications and medication schedule for patients with elevated blood pressure.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 3,
    title: 'Diabetes Type-2 Monitoring',
    description:
      'Daily blood glucose logging, dietary guidelines, and HbA1c check frequency.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
]
let _nextId = 4

/** Simulate network delay */
function delay(ms = 120) {
  return new Promise((res) => setTimeout(res, ms))
}

/**
 * Fetch all protocols.
 * @returns {Promise<{ data: { items: Protocol[], meta: { total: number } } }>}
 */
export async function getProtocols() {
  await delay()
  return {
    message: 'Protocols retrieved successfully',
    data: {
      items: [..._protocols].sort((a, b) => b.id - a.id),
      meta: { total: _protocols.length },
    },
  }
}

/**
 * Create a new protocol.
 * @param {{ title: string, description: string }} body
 * @returns {Promise<{ data: Protocol }>}
 */
export async function createProtocol(body) {
  await delay(180)
  if (!body.title?.trim()) throw new Error('Title is required')
  const protocol = {
    id: _nextId++,
    title: body.title.trim(),
    description: body.description?.trim() ?? '',
    created_at: new Date().toISOString(),
  }
  _protocols.push(protocol)
  return { message: 'Protocol created successfully', data: protocol }
}

/**
 * Delete a protocol by id.
 * @param {number} id
 */
export async function deleteProtocol(id) {
  await delay(150)
  const idx = _protocols.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('Protocol not found')
  _protocols.splice(idx, 1)
  return { message: 'Protocol deleted successfully', data: null }
}
