import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Search,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Nav link config per role ─────────────────────────────────────────────────
const DOCTOR_NAV = [
  {
    label: "Dashboard",
    to: ROUTES.DOCTOR_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    to: ROUTES.DOCTOR_APPOINTMENTS,
    icon: CalendarDays,
  },
  {
    label: "Protocols",
    to: "/doctor/protocols",
    icon: ClipboardList,
  },
  // {
  //   label: 'Search Patients',
  //   to: '/doctor/search',
  //   icon: Search,
  // },
  {
    label: "Profile",
    to: ROUTES.DOCTOR_PROFILE,
    icon: UserCircle,
  },
];

const PATIENT_NAV = [
  {
    label: "Dashboard",
    to: ROUTES.PATIENT_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "My Appointments",
    to: ROUTES.PATIENT_APPOINTMENTS,
    icon: CalendarDays,
  },
  {
    label: "Messages",
    to: "/patient/messages",
    icon: MessageSquare,
  },
  {
    label: "Profile",
    to: ROUTES.PATIENT_PROFILE,
    icon: UserCircle,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Role-aware sidebar navigation.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();
  const navItems = role === ROLES.DOCTOR ? DOCTOR_NAV : PATIENT_NAV;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[54] bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-[55] h-[calc(100vh-4rem)] w-64 border-r border-border bg-white",
          "flex flex-col sidebar-transition",
          // Mobile: slide in/out
          "lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
          // Desktop: always visible
          "lg:static lg:z-auto lg:shadow-none",
        )}
      >
        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} CareConnect
          </p>
        </div>
      </aside>
    </>
  );
}
