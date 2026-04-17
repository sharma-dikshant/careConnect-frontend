import { CalendarDays, Users, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Link } from "react-router-dom";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good morning, {user?.name ?? "Doctor"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your patients today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarDays}
          label="Total Appointments"
          value={isLoading ? "—" : total}
          color="bg-brand-blue-100 text-brand-blue-600"
        />
        <StatCard
          icon={Users}
          label="Active Patients"
          value="—"
          color="bg-brand-green-100 text-brand-green-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Reviews"
          value="—"
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value="—"
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Recent appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Appointments</CardTitle>
          <Link
            to={ROUTES.DOCTOR_APPOINTMENTS}
            className="text-sm text-primary hover:underline font-medium"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No appointments yet. Create your first appointment to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {appointments.map((apt) => (
                <Link
                  key={apt.id}
                  to={ROUTES.DOCTOR_APPOINTMENT_DETAIL(apt.id)}
                  className="flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {apt.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {apt.patient?.name} · {formatDateTime(apt.created_at)}
                    </p>
                  </div>
                  <Badge variant="doctor" className="shrink-0">
                    Active
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
