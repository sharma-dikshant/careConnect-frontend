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
      className="scrollbar-none flex items-center gap-1 overflow-x-auto rounded-xl border border-border/60 bg-muted/60 p-1"
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
              'relative flex min-w-[110px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              isActive
                ? 'bg-white text-foreground shadow-sm ring-1 ring-border/40'
                : 'text-muted-foreground hover:bg-white/60 hover:text-foreground',
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>

            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted-foreground/15 text-muted-foreground',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})
