import { useRef, useState, useEffect } from 'react'
import { Loader2, Mail, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 30 // seconds

/**
 * OtpStep – 6-digit OTP verification UI.
 *
 * Props:
 *   email       : string
 *   isLoading   : boolean
 *   error       : string | null
 *   onVerify    : (otp: string) => void
 *   onResend    : () => void
 *   isResending : boolean
 */
export function OtpStep({ email, isLoading, error, onVerify, onResend, isResending }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef([])

  // ── Resend cooldown timer ─────────────────────────────────────────────────
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const timerRef = useRef(null)

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start timer on mount
  useEffect(() => {
    startCooldown()
    return () => clearInterval(timerRef.current)
  }, [])

  // ── OTP input handlers ────────────────────────────────────────────────────
  function handleChange(e, index) {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = val
    setDigits(next)
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  function handleSubmit(e) {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < OTP_LENGTH) return
    onVerify(otp)
  }

  function handleResendClick() {
    setDigits(Array(OTP_LENGTH).fill(''))
    inputsRef.current[0]?.focus()
    onResend()
    startCooldown()
  }

  const isFilled = digits.every(Boolean)
  const canResend = cooldown === 0 && !isResending && !isLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      {/* Digit boxes */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`
              w-11 h-12 text-center text-lg font-bold rounded-lg border-2 
              bg-background outline-none transition-all duration-200
              ${digit
                ? 'border-primary text-foreground'
                : 'border-border text-muted-foreground'
              }
              focus:border-primary focus:ring-2 focus:ring-primary/20
            `}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 text-center">
          {error}
        </p>
      )}

      {/* Verify button */}
      <Button type="submit" className="w-full" disabled={!isFilled || isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Verify & Continue
      </Button>

      {/* Resend */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendClick}
          disabled={!canResend}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          {isResending
            ? 'Sending…'
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend code'}
        </button>
      </div>
    </form>
  )
}
