import { useState } from 'react'
import {
  SmartphoneNfc,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
  Copy,
  CheckCheck,
} from 'lucide-react'
import { useAppointmentDevices, useRegisterDevice } from '@/hooks/useDevices'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Separator } from '@/components/ui/Separator'
import { ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const fmt = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function DeviceSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border bg-white">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-48 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function DeviceRow({ device }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(device.token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border bg-white hover:bg-muted/30 transition-colors">
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue-100 text-brand-blue-600">
        <SmartphoneNfc className="h-4 w-4" />
      </div>

      {/* Token + date */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-mono text-foreground truncate"
          title={device.token}
        >
          {device.token}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {fmt.format(new Date(device.createdAt))}
        </p>
      </div>

      {/* Active badge */}
      <Badge
        variant={device.active ? 'success' : 'inactive'}
        className="shrink-0 text-[10px] px-1.5 py-0"
      >
        {device.active ? 'Active' : 'Inactive'}
      </Badge>

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Copy token"
        aria-label="Copy token"
      >
        {copied
          ? <CheckCheck className="h-3.5 w-3.5 text-green-600" />
          : <Copy className="h-3.5 w-3.5" />
        }
      </button>
    </div>
  )
}

/**
 * Panel embedded in the Appointment Detail page.
 * Shows a "Register New Device" section and lists all registered devices.
 *
 * Props:
 *  - appointmentId: number | string
 *  - viewerRole: 'doctor' | 'patient'
 */
export function AppointmentDevicesPanel({ appointmentId, viewerRole }) {
  const [expanded, setExpanded] = useState(true)
  const [lastToken, setLastToken] = useState(null)
  const [tokenCopied, setTokenCopied] = useState(false)

  const isDoctor = viewerRole === ROLES.DOCTOR

  const { data: devices = [], isLoading, error } = useAppointmentDevices(appointmentId)
  const { mutate: register, isPending: isRegistering } = useRegisterDevice(appointmentId)

  function handleRegister() {
    register(undefined, {
      onSuccess: (res) => {
        setLastToken(res?.data?.token ?? null)
      },
    })
  }

  function handleCopyToken() {
    if (!lastToken) return
    navigator.clipboard.writeText(lastToken).then(() => {
      setTokenCopied(true)
      setTimeout(() => setTokenCopied(false), 2000)
    })
  }

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 font-medium text-sm hover:text-primary transition-colors"
        >
          <SmartphoneNfc className="h-4 w-4 text-primary" />
          Device Details
          <span className="text-xs text-muted-foreground font-normal">
            ({isLoading ? '…' : devices.length})
          </span>
          {expanded
            ? <ChevronUp className="h-3.5 w-3.5" />
            : <ChevronDown className="h-3.5 w-3.5" />
          }
        </button>

        {isDoctor && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Plus className="h-3.5 w-3.5" />
            }
            Register Device
          </Button>
        )}
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-5">
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}

          {/* ── Register section (doctor only) ────────────────────────── */}
          {isDoctor && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Register New Device
              </p>
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Register a device to link it to this appointment. A unique token will be generated that the device can use to authenticate.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="gap-1.5"
                >
                  {isRegistering
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Plus className="h-3.5 w-3.5" />
                  }
                  {isRegistering ? 'Registering…' : 'Register Device'}
                </Button>

                {/* Last registered token */}
                {lastToken && (
                  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2.5 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-green-700 uppercase tracking-wide mb-0.5">
                        New device token
                      </p>
                      <p className="text-xs font-mono text-green-900 break-all">{lastToken}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="shrink-0 p-1 rounded text-green-600 hover:text-green-800 hover:bg-green-100 transition-colors"
                      title="Copy token"
                      aria-label="Copy new device token"
                    >
                      {tokenCopied
                        ? <CheckCheck className="h-4 w-4" />
                        : <Copy className="h-4 w-4" />
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {isDoctor && <Separator />}

          {/* ── Registered devices list ───────────────────────────────── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Registered Devices
            </p>

            {isLoading ? (
              <DeviceSkeleton />
            ) : devices.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2 text-center">
                <SmartphoneNfc className="h-8 w-8 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">No devices registered yet.</p>
                {isDoctor && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Plus className="h-4 w-4" />
                    }
                    Register first device
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <DeviceRow key={device.id} device={device} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
