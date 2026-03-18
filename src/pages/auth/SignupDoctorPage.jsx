import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signupDoctor } from '@/api/services/auth.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROUTES } from '@/lib/constants'

const FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. Jane Smith', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'doctor@hospital.com', required: true },
  { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true, minLength: 6 },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210', required: true, maxLength: 10 },
  { id: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City', required: true },
  { id: 'designation', label: 'Designation', type: 'text', placeholder: 'Senior Cardiologist', required: true },
  { id: 'license', label: 'License Number', type: 'text', placeholder: 'LIC-001', required: true },
  { id: 'specialization', label: 'Specialization', type: 'text', placeholder: 'Cardiology', required: true },
  { id: 'experience', label: 'Experience (years)', type: 'number', placeholder: '10', required: false },
  { id: 'hospital', label: 'Hospital / Clinic', type: 'text', placeholder: 'City General Hospital', required: true },
  { id: 'bio', label: 'Bio', type: 'text', placeholder: 'Brief professional summary…', required: true },
]

export function SignupDoctorPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.id, ''])),
  )
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
      const res = await signupDoctor({ ...form, experience: Number(form.experience) || undefined })
      const token = res?.data?.token
      if (!token) throw new Error('Registration failed')
      await login(token)
      navigate(ROUTES.DOCTOR_DASHBOARD, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Register as Doctor</CardTitle>
        <CardDescription>Complete your professional profile to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map(({ id, label, type, placeholder, required, minLength, maxLength }) => (
              <div key={id} className={`space-y-1.5 ${id === 'bio' ? 'sm:col-span-2' : ''}`}>
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

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Doctor Account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
