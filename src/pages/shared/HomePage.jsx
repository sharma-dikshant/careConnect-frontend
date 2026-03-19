import { Link } from 'react-router-dom'
import {
  HeartPulse,
  CalendarDays,
  MessageSquare,
  FileText,
  Bot,
  ShieldCheck,
  Stethoscope,
  User,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { ROLES, ROUTES } from '@/lib/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NavBar() {
  const { token, role } = useAuth()
  const dashRoute =
    role === ROLES.DOCTOR ? ROUTES.DOCTOR_DASHBOARD : ROUTES.PATIENT_DASHBOARD

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-primary text-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span>CareConnect</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#roles" className="hover:text-foreground transition-colors">For doctors & patients</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {token ? (
            <Button size="sm" asChild>
              <Link to={dashRoute}>
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={ROUTES.SIGNUP_PATIENT}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Appointment Management',
    desc: 'Doctors create appointments, add patients, and manage the full lifecycle — create, edit, delete — all from one clean dashboard.',
    color: 'bg-brand-blue-100 text-brand-blue-600',
  },
  {
    icon: Bot,
    title: 'AI-Assisted Chat',
    desc: 'Patients describe symptoms via chat and receive intelligent, AI-powered guidance instantly. Every message is visible to their doctor.',
    color: 'bg-brand-green-100 text-brand-green-600',
  },
  {
    icon: FileText,
    title: 'Care Protocols (PDF)',
    desc: 'Doctors upload PDF protocols — globally to their library or per-appointment. Patients can view and download all attached documents.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    desc: 'Strict separation between doctor and patient scopes. Every API route is protected by JWT with role enforcement on the server.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Polling',
    desc: 'Chat messages refresh every 5 seconds automatically while the tab is active. Both sides see new messages without manual refresh.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: HeartPulse,
    title: 'Secure & Confidential',
    desc: 'All traffic is JWT-authenticated. Patients can only access their own appointments; doctors can only access their own patients.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Register',
    desc: 'Create an account as a doctor or patient. Doctors fill in professional details; patients sign up with just name + email.',
  },
  {
    step: '02',
    title: 'Create an appointment',
    desc: 'The doctor searches for a patient by email and creates a named appointment with optional notes.',
  },
  {
    step: '03',
    title: 'Patient asks questions',
    desc: 'The patient opens the appointment, types their symptoms or questions, and the AI assistant responds in real-time.',
  },
  {
    step: '04',
    title: 'Doctor reviews & attaches protocols',
    desc: 'The doctor reads the conversation and attaches relevant PDF care protocols for the patient to download.',
  },
]

// ─── Page component ───────────────────────────────────────────────────────────

export function HomePage() {
  const { token, role } = useAuth()
  const dashRoute =
    role === ROLES.DOCTOR ? ROUTES.DOCTOR_DASHBOARD : ROUTES.PATIENT_DASHBOARD

  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-brand-blue-700 to-brand-blue-900 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-brand-green-400/10 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36 text-center relative z-10">
          <Badge className="mb-5 inline-flex bg-white/15 text-white border-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
            🩺 Healthcare · AI · Real-time Chat
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Healthcare at your&nbsp;
            <span className="text-brand-green-300">fingertips</span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            CareConnect bridges the gap between doctors and patients with
            AI-assisted consultations, PDF care protocols, and real-time
            appointment management — all in one secure platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {token ? (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-blue-50 shadow-lg font-semibold px-8"
                asChild
              >
                <Link to={dashRoute}>
                  Go to Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 shadow-lg font-semibold px-8"
                  asChild
                >
                  <Link to={ROUTES.SIGNUP_PATIENT}>
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 px-8"
                  asChild
                >
                  <Link to={ROUTES.LOGIN}>Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            {['✓ JWT-secured', '✓ Role-based access', '✓ AI-powered chat', '✓ S3 PDF storage'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-brand-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
              A tightly scoped feature set built around real clinical workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-brand-green-100 text-brand-green-700 border-brand-green-200">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-brand-green-400/20" />

            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/30 z-10">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground text-base">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Cards ──────────────────────────────────────────────────────── */}
      <section id="roles" className="py-20 bg-brand-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-purple-100 text-purple-700 border-purple-200">Two roles, one platform</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Designed for both sides of care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doctor card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 text-white p-8">
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 mb-5">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-white/20">For Doctors</Badge>
              <h3 className="text-2xl font-bold mb-3">Take control of your practice</h3>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Create & manage appointments',
                  'Search patients by email',
                  'Upload global PDF protocol library',
                  'Attach per-appointment PDFs',
                  'Read-only view of patient chat',
                  'Edit appointment title & description',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-blue-100">
                    <CheckCircle2 className="h-4 w-4 text-brand-green-300 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="bg-white text-brand-blue-700 hover:bg-blue-50 font-semibold"
                asChild
              >
                <Link to={ROUTES.SIGNUP_DOCTOR}>
                  Register as Doctor <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Patient card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-600 to-brand-green-900 text-white p-8">
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 mb-5">
                <User className="h-7 w-7 text-white" />
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-white/20">For Patients</Badge>
              <h3 className="text-2xl font-bold mb-3">Get guidance, anytime</h3>
              <ul className="space-y-2.5 mb-8">
                {[
                  'View all your appointments',
                  'Chat with AI for instant guidance',
                  'Doctor reviews every conversation',
                  'Download PDF care protocols',
                  'Secure, confidential consultations',
                  'Real-time message updates',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-green-100">
                    <CheckCircle2 className="h-4 w-4 text-white shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="bg-white text-brand-green-700 hover:bg-green-50 font-semibold"
                asChild
              >
                <Link to={ROUTES.SIGNUP_PATIENT}>
                  Register as Patient <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary to-brand-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Ready to transform healthcare communication?
          </h2>
          <p className="text-blue-100 text-lg">
            Join CareConnect today — free for patients, easy onboarding for doctors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {token ? (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-blue-50 shadow-lg font-semibold px-8"
                asChild
              >
                <Link to={dashRoute}>Open Dashboard <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 font-semibold px-8 shadow-lg"
                  asChild
                >
                  <Link to={ROUTES.SIGNUP_PATIENT}>Create Patient Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 px-8"
                  asChild
                >
                  <Link to={ROUTES.SIGNUP_DOCTOR}>Register as Doctor</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-brand-slate-900 text-brand-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <HeartPulse className="h-5 w-5 text-primary" />
            CareConnect
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} CareConnect · Built for better healthcare.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Sign In</Link>
            <Link to={ROUTES.SIGNUP_PATIENT} className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
