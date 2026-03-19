import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Bot, User } from 'lucide-react'
import { useMessages, useSendMessage } from '@/hooks/useMessages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { Separator } from '@/components/ui/Separator'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'

export function PatientAppointmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  const { data, isLoading } = useMessages(id)
  const { mutate: send, isPending: isSending } = useSendMessage(id)
  const messages = data?.items ?? []

  const [messageText, setMessageText] = useState('')

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    const text = messageText.trim()
    if (!text) return
    setMessageText('')
    send({ message: text })
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Button>

      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Appointment #{id}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Send a message to get AI-assisted guidance. Your doctor can also view this thread.
          </p>
        </CardHeader>
      </Card>

      {/* Chat */}
      <Card className="flex flex-col" style={{ height: 'calc(100vh - 340px)' }}>
        <CardHeader className="pb-2 shrink-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI-Assisted Chat
          </CardTitle>
        </CardHeader>
        <Separator />

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className={`h-12 w-2/3 rounded-2xl`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Bot className="h-10 w-10 opacity-30" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isPatient = msg.sender === 'patient'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs ${
                        isPatient ? 'bg-primary' : 'bg-brand-green-500'
                      }`}
                    >
                      {isPatient ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        isPatient
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge
                          variant={isPatient ? 'patient' : 'success'}
                          className="text-[10px] px-1.5 py-0 capitalize"
                        >
                          {msg.sender}
                        </Badge>
                        <span className={`text-xs ${isPatient ? 'text-blue-100' : 'text-muted-foreground'}`}>
                          {formatDateTime(msg.created_at)}
                        </span>
                      </div>
                      <p className="leading-snug">{msg.message}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="shrink-0 border-t border-border p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Describe your symptoms or ask a question…"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending}
              className="flex-1"
              aria-label="Message input"
            />
            <Button type="submit" size="icon" disabled={isSending || !messageText.trim()}>
              {isSending ? (
                <Bot className="h-4 w-4 animate-pulse" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-1.5">
            AI responses are for guidance only and do not replace professional medical advice.
          </p>
        </div>
      </Card>
    </div>
  )
}
