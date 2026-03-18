import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProtocol,
  deleteProtocol,
  getProtocols,
} from '@/api/services/protocol.service'

const PROTOCOLS_KEY = ['protocols']

/**
 * Fetch all protocols (doctor's own).
 * Integrates with the placeholder service; swap service functions for live API.
 */
export function useProtocols() {
  return useQuery({
    queryKey: PROTOCOLS_KEY,
    queryFn: async () => {
      const res = await getProtocols()
      return res?.data ?? { items: [], meta: {} }
    },
  })
}

/**
 * Create a new protocol.
 * Performs optimistic update — adds the item to cache before the request settles.
 */
export function useCreateProtocol() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProtocol,

    // Optimistic: add a temp item immediately
    onMutate: async (newProtocol) => {
      await queryClient.cancelQueries({ queryKey: PROTOCOLS_KEY })
      const previous = queryClient.getQueryData(PROTOCOLS_KEY)

      queryClient.setQueryData(PROTOCOLS_KEY, (old) => {
        const optimistic = {
          id: Date.now(), // temp id
          ...newProtocol,
          created_at: new Date().toISOString(),
          _optimistic: true,
        }
        return {
          ...old,
          items: [optimistic, ...(old?.items ?? [])],
          meta: { total: (old?.meta?.total ?? 0) + 1 },
        }
      })

      return { previous }
    },

    // On error, roll back
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PROTOCOLS_KEY, context.previous)
      }
    },

    // Always refetch to get the real id
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROTOCOLS_KEY })
    },
  })
}

/**
 * Delete a protocol by id.
 * Performs optimistic removal from cache.
 */
export function useDeleteProtocol() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProtocol,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PROTOCOLS_KEY })
      const previous = queryClient.getQueryData(PROTOCOLS_KEY)

      queryClient.setQueryData(PROTOCOLS_KEY, (old) => ({
        ...old,
        items: (old?.items ?? []).filter((p) => p.id !== id),
        meta: { total: Math.max(0, (old?.meta?.total ?? 1) - 1) },
      }))

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PROTOCOLS_KEY, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROTOCOLS_KEY })
    },
  })
}
