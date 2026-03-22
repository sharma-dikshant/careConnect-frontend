import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupPatient, verifyOtp } from '@/api/services/auth.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { StepIndicator } from '@/components/auth/StepIndicator'
import { OtpStep } from '@/components/auth/OtpStep'
import { ROUTES } from '@/lib/constants'
import { Loader2 } from 'lucide-react'

const STEPS = ['Account Info', 'Verify Email']

export function SignupPatientPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  /* Step 1 – submit account info, trigger OTP send */
  async function handleInfoSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await signupPatient(form)
      setStep(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  /* Step 2 – verify OTP */
  async function handleOtpVerify(otp) {
    setIsLoading(true)
    setError(null)
    try {
      await verifyOtp({ to: form.email, type: 'signup-patient', otp })
      navigate(ROUTES.LOGIN, { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  /* Resend OTP */
  async function handleResend() {
    setIsResending(true)
    setError(null)
    try {
      await signupPatient(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Create patient account</CardTitle>
        <CardDescription>Get started with CareConnect today</CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator steps={STEPS} current={step} />

        {/* ── Step 1: Account Info ─────────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', auto: 'name' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', auto: 'email' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', auto: 'new-password' },
            ].map(({ id, label, type, placeholder, auto }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={auto}
                  required
                  minLength={id === 'password' ? 6 : undefined}
                  value={form[id]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Continue
            </Button>
          </form>
        )}

        {/* ── Step 2: OTP ──────────────────────────────────────────────── */}
        {step === 1 && (
          <OtpStep
            email={form.email}
            isLoading={isLoading}
            error={error}
            onVerify={handleOtpVerify}
            onResend={handleResend}
            isResending={isResending}
          />
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
