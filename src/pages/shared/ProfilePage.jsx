import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { updateProfile } from '@/api/services/user.service'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Separator } from '@/components/ui/Separator'
import { QUERY_KEYS, ROLES } from '@/lib/constants'
import { getInitials, capitalize } from '@/lib/utils'

const DOCTOR_FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text' },
  { id: 'phone', label: 'Phone', type: 'tel' },
  { id: 'address', label: 'Address', type: 'text' },
  { id: 'designation', label: 'Designation', type: 'text' },
  { id: 'license', label: 'License Number', type: 'text' },
  { id: 'specialization', label: 'Specialization', type: 'text' },
  { id: 'experience', label: 'Experience (years)', type: 'number' },
  { id: 'hospital', label: 'Hospital', type: 'text' },
  { id: 'bio', label: 'Bio', type: 'text' },
]

const PATIENT_FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text' },
]

export function ProfilePage() {
  const { user, role } = useAuth()
  const queryClient = useQueryClient()

  const fields = role === ROLES.DOCTOR ? DOCTOR_FIELDS : PATIENT_FIELDS
  const [form, setForm] = useState(
    Object.fromEntries(fields.map((f) => [f.id, user?.[f.id] ?? ''])),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await updateProfile(form)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your personal information</p>
      </div>

      {/* Avatar card */}
      <Card>
        <CardContent className="flex items-center gap-5 pt-6">
          <Avatar className="h-16 w-16 text-xl">
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {role && (
              <Badge variant={role} className="mt-1">
                {capitalize(role)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Information</CardTitle>
          <CardDescription>
            {role === ROLES.DOCTOR
              ? 'Update your professional details'
              : 'Update your account details'}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ id, label, type }) => (
                <div key={id} className={`space-y-1.5 ${id === 'bio' || id === 'address' ? 'sm:col-span-2' : ''}`}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
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
            {saved && (
              <p className="text-sm text-brand-green-600 bg-brand-green-50 rounded-md px-3 py-2">
                ✓ Profile updated successfully
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
