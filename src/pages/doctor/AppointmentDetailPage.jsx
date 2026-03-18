import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useUpdateAppointment, useDeleteAppointment } from '@/hooks/useAppointments'
import { useMessages } from '@/hooks/useMessages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Separator } from '@/components/ui/Separator'
import { formatDateTime } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

export function DoctorAppointmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: messagesData, isLoading: loadingMessages } = useMessages(id)
  const messages = messagesData?.items ?? []

  const { mutate: update, isPending: isUpdating } = useUpdateAppointment(id)
  const { mutate: deleteApt, isPending: isDeleting } = useDeleteAppointment()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })

  function handleSave() {
    update(form, { onSuccess: () => setEditing(false) })
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteApt(id, { onSuccess: () => navigate(ROUTES.DOCTOR_APPOINTMENTS) })
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back nav */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Button>

      {/* Header card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            {editing ? (
              <div className="space-y-2">
                <Input
                  value={form.title}
                  placeholder="Appointment title"
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                <Input
                  value={form.description}
                  placeholder="Description (optional)"
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            ) : (
              <>
                <CardTitle>Appointment #{id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View patient messages and manage this appointment
                </p>
              </>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {editing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" disabled={isUpdating} onClick={handleSave}>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Message thread */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Message Thread</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {loadingMessages ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className={`h-12 w-3/4 rounded-xl ${i % 2 === 1 ? 'ml-auto' : ''}`} />)}
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">
              No messages yet in this appointment.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender === 'patient'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={msg.sender === 'patient' ? 'patient' : 'secondary'}
                        className="text-[10px] px-1.5 py-0 capitalize"
                      >
                        {msg.sender}
                      </Badge>
                      <span className="text-xs opacity-60">{formatDateTime(msg.created_at)}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
