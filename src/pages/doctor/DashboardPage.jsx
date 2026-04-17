import { CalendarDays, Users, Clock, TrendingUp, Stethoscope, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Link } from "react-router-dom";

function StatCard({ icon: Icon, label, value, color, isLoading }) {
  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="mt-1.5 h-7 w-12 rounded" />
          ) : (
            <p className="text-2xl font-bold leading-tight tracking-tight text-foreground">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DoctorDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useAppointments({ page: 1, limit: 5 });
  const appointments = data?.items ?? [];
  const total = data?.meta?.total ?? 0;
  const firstName = user?.name?.split(" ")[0] ?? "Doctor";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-brand-blue-700 to-brand-blue-900 p-6 text-white shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-brand-green-400/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-sm text-blue-100 sm:text-base">
              Here's what's happening with your patients today.
            </p>
          </div>
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20 sm:flex">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Total Appointments"
          value={total}
          color="bg-brand-blue-100 text-brand-blue-600"
          isLoading={isLoading}
        />
        <StatCard
          icon={Users}
          label="Active Patients"
          value="—"
          color="bg-brand-green-100 text-brand-green-600"
          isLoading={false}
        />
        <StatCard
          icon={Clock}
          label="Pending Reviews"
          value="—"
          color="bg-amber-100 text-amber-600"
          isLoading={false}
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value="—"
          color="bg-purple-100 text-purple-600"
          isLoading={false}
        />
      </div>

      {/* Recent appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Recent Appointments
          </CardTitle>
          <Link
            to={ROUTES.DOCTOR_APPOINTMENTS}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-10 text-center">
              <p className="text-sm font-medium text-foreground">
                No appointments yet
              </p>
              <p className="text-xs text-muted-foreground">
                Create your first appointment to get started.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {appointments.map((apt) => (
                <li key={apt.id}>
                  <Link
                    to={ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)}
                    className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {apt.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {apt.patient?.name} · {formatDateTime(apt.created_at)}
                      </p>
                    </div>
                    <Badge variant="doctor" className="shrink-0">
                      Active
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
