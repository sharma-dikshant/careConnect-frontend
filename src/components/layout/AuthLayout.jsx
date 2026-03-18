import { Outlet } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

/**
 * Centered layout for authentication pages (login, signup).
 * Shows the brand logo/tagline on the left and the auth form on the right
 * on desktop; stacked on mobile.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel — visible on lg+ */}
      <div className="hidden lg:flex flex-col justify-center items-start gap-6 w-[45%] bg-gradient-to-br from-primary to-brand-blue-800 p-16 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CareConnect</span>
        </div>

        <div className="space-y-3 max-w-sm">
          <h1 className="text-4xl font-extrabold leading-tight">
            Healthcare at your fingertips.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Connect with licensed doctors, manage your appointments, and get
            AI-powered medical support — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-blue-100">
          {[
            '🩺  Verified healthcare professionals',
            '🔒  Secure & confidential consultations',
            '🤖  AI-assisted medical guidance',
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      {/* Auth form panel */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 bg-brand-slate-50">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-primary">CareConnect</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
