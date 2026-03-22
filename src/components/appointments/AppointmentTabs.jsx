import { memo } from 'react'
import { cn } from '@/lib/utils'

/**
 * Segmented tab control for switching between Active and Inactive appointments.
 *
 * Props:
 *  - activeTab: 'active' | 'inactive'
 *  - onChange: (tab: 'active' | 'inactive') => void
 *  - counts: { active?: number, inactive?: number } — optional badge counts
 */
export const AppointmentTabs = memo(function AppointmentTabs({
  activeTab,
  onChange,
  counts = {},
}) {
  const tabs = [
    {
      id: 'active',
      label: 'Active Appointments',
      shortLabel: 'Active',
      count: counts.active,
    },
    {
      id: 'inactive',
      label: 'Past Appointments',
      shortLabel: 'Past',
      count: counts.inactive,
    },
  ]

  return (
    <div
      role="tablist"
      aria-label="Appointment filter tabs"
      className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50 overflow-x-auto scrollbar-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 min-w-[110px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              isActive
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
            )}
          >
            {/* Full label on md+, short label on mobile */}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>

            {/* Count badge */}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none min-w-[1.2rem] transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted-foreground/15 text-muted-foreground',
                )}
              >
                {tab.count}
              </span>
            )}

            {/* Active indicator line */}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full bg-primary opacity-0" />
            )}
          </button>
        )
      })}
    </div>
  )
})
