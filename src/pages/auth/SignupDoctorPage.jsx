import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { signupDoctor, verifyOtp, signupConfirm, resendOtp } from '@/api/services/auth.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { StepIndicator } from '@/components/auth/StepIndicator'
import { OtpStep } from '@/components/auth/OtpStep'
import { ROUTES } from '@/lib/constants'

const STEPS = ['Personal Info', 'Professional Info', 'Verify Email']

const STEP1_FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. Jane Smith', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'doctor@hospital.com', required: true },
  { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true, minLength: 6 },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210', required: true, maxLength: 10 },
  { id: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City', required: true },
]

const STEP2_FIELDS = [
  { id: 'designation', label: 'Designation', type: 'text', placeholder: 'Senior Cardiologist', required: true },
  { id: 'license', label: 'License Number', type: 'text', placeholder: 'LIC-001', required: true },
  { id: 'specialization', label: 'Specialization', type: 'text', placeholder: 'Cardiology', required: true },
  { id: 'experience', label: 'Experience (years)', type: 'number', placeholder: '10', required: false },
  { id: 'hospital', label: 'Hospital / Clinic', type: 'text', placeholder: 'City General Hospital', required: true },
  { id: 'bio', label: 'Bio', type: 'text', placeholder: 'Brief professional summary…', required: true, span: true },
]

const ALL_FIELDS = [...STEP1_FIELDS, ...STEP2_FIELDS]

export function SignupDoctorPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(Object.fromEntries(ALL_FIELDS.map((f) => [f.id, ''])))
  const [entityId, setEntityId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  /* Step 1 → Step 2: just local nav, no API call yet */
  function handleStep1Submit(e) {
    e.preventDefault()
    setError(null)
    setStep(1)
  }

  /* Step 2 → trigger OTP send */
  async function handleStep2Submit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await signupDoctor({ ...form, experience: Number(form.experience) || undefined })
      setEntityId(res.data.entityId)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  /* Step 3 – verify OTP then confirm signup */
  async function handleOtpVerify(otp) {
    setIsLoading(true)
    setError(null)
    try {
      const verifyRes = await verifyOtp({
        to: form.email,
        type: 'signup-doctor',
        entityId,
        otp,
      })
      await signupConfirm(verifyRes.data.verifyToken)
      navigate(ROUTES.LOGIN, { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  /* Resend OTP – uses /otp/send, not full signup again */
  async function handleResend() {
    setIsResending(true)
    setError(null)
    try {
      await resendOtp({ to: form.email, type: 'signup-doctor', entityId })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  /** Renders a field row */
  function renderFields(fields) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ id, label, type, placeholder, required, minLength, maxLength, span }) => (
          <div key={id} className={`space-y-1.5 ${span ? 'sm:col-span-2' : ''}`}>
            <Label htmlFor={id}>
              {label}
              {!required && <span className="text-muted-foreground ml-1 text-xs">(optional)</span>}
            </Label>
            <Input
              id={id}
              name={id}
              type={type}
              placeholder={placeholder}
              required={required}
              minLength={minLength}
              maxLength={maxLength}
              value={form[id]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Register as Doctor</CardTitle>
        <CardDescription>Complete your professional profile to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator steps={STEPS} current={step} />

        {/* ── Step 1: Personal Info ─────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {renderFields(STEP1_FIELDS)}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full mt-2">
              Continue
            </Button>
          </form>
        )}

        {/* ── Step 2: Professional Info ─────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            {renderFields(STEP2_FIELDS)}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { setError(null); setStep(0) }}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Submit & Get OTP
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 3: OTP ──────────────────────────────────────────── */}
        {step === 2 && (
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
          Already registered?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
