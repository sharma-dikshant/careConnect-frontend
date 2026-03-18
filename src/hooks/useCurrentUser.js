import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/api/services/user.service'
import { QUERY_KEYS } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

/**
 * Fetches and caches the current user's full profile via React Query.
 * Only runs when the user is authenticated (has a token).
 */
export function useCurrentUser() {
  const { token } = useAuth()

  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: async () => {
      const response = await getCurrentUser()
      return response?.data ?? null
    },
    enabled: !!token,
  })
}
