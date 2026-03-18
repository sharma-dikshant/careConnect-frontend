import { QueryClient } from '@tanstack/react-query'

/**
 * Shared React Query client with production-ready defaults.
 *
 * - staleTime: 5 min  — avoids hammering the server for fresh-enough data
 * - retry: 2          — retry failed requests twice before surfacing the error
 * - refetchOnWindowFocus: false — reduces noise; user can manually refetch
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export default queryClient
