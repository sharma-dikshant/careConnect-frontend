import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getCurrentUser } from '@/api/services/user.service'
import { logoutUser } from '@/api/services/auth.service'
import { TOKEN_KEY } from '@/lib/constants'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

/**
 * Provides authentication state (user, token, role) and actions (login, logout)
 * to all descendant components.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'doctor' | 'patient' | null
  const [isLoading, setIsLoading] = useState(true)

  // ── Bootstrap: hydrate user from stored token on mount ──────────────────────
  useEffect(() => {
    async function hydrate() {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const response = await getCurrentUser()
        const profile = response?.data ?? null

        if (profile) {
          setUser(profile)
          // Role is derived from which fields are present
          // Doctor profiles contain 'specialization'; patient profiles do not
          const derivedRole =
            'specialization' in profile ? 'doctor' : 'patient'
          setRole(derivedRole)
        }
      } catch {
        // Token invalid or expired — clear everything
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    hydrate()
  }, [])

  /**
   * Call after a successful login.
   * Stores the token and re-fetches user profile.
   * @param {string} newToken
   */
  const login = useCallback(async (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)

    try {
      const response = await getCurrentUser()
      const profile = response?.data ?? null
      if (profile) {
        setUser(profile)
        const derivedRole =
          'specialization' in profile ? 'doctor' : 'patient'
        setRole(derivedRole)
      }
    } catch {
      // Profile fetch failed — still allow navigation, role will be null
    }
  }, [])

  /**
   * Logout the current user — calls server endpoint and clears local state.
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Server logout is best-effort; always clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      setRole(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, token, role, isLoading, login, logout }),
    [user, token, role, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Access authentication context. Must be used inside <AuthProvider>.
 * @throws if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
