import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, HeartPulse, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { loginUser } from '@/api/services/auth.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROLES, ROUTES } from '@/lib/constants'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const registered = location.state?.registered ?? false

  const [form, setForm] = useState({ type: ROLES.PATIENT, email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await loginUser(form)
      const token = res?.data?.token
      if (!token) throw new Error('No token received')
      await login(token)
      navigate(
        form.type === ROLES.DOCTOR ? ROUTES.DOCTOR_DASHBOARD : ROUTES.PATIENT_DASHBOARD,
        { replace: true },
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex lg:hidden items-center gap-2 mb-2">
          <HeartPulse className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your CareConnect account</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Post-signup success message */}
        {registered && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Account created! Please sign in to continue.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden" role="group" aria-label="Account type">
            {[ROLES.PATIENT, ROLES.DOCTOR].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: r }))}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === r
                    ? 'bg-primary text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            New patient?{' '}
            <Link to={ROUTES.SIGNUP_PATIENT} className="text-primary font-medium hover:underline">
              Create patient account
            </Link>
          </p>
          <p>
            Joining as a doctor?{' '}
            <Link to={ROUTES.SIGNUP_DOCTOR} className="text-primary font-medium hover:underline">
              Register as doctor
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
