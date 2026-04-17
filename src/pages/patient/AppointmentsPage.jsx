import { useState, useCallback } from 'react'
import { useAppointments } from '@/hooks/useAppointments'
import { AppointmentList } from '@/components/appointments/AppointmentList'
import { AppointmentTabs } from '@/components/appointments/AppointmentTabs'

// ─── Tab Panel ────────────────────────────────────────────────────────────────
function TabPanel({ id, isVisible, children }) {
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
      className={isVisible ? 'animate-fade-in' : ''}
    >
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PatientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('active')

  // ── Data hooks — separate cache per tab ────────────────────────────────────
  const activeQuery = useAppointments({ active: true, limit: 50 })
  const inactiveQuery = useAppointments({ active: false, limit: 50 })

  const activeAppointments = activeQuery.data?.items ?? []
  const inactiveAppointments = inactiveQuery.data?.items ?? []

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  const isActiveTab = activeTab === 'active'
  const currentQuery = isActiveTab ? activeQuery : inactiveQuery

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">My Appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentQuery.isLoading
            ? 'Loading…'
            : `${isActiveTab ? activeAppointments.length : inactiveAppointments.length} ${isActiveTab ? 'active' : 'past'} appointment${(isActiveTab ? activeAppointments.length : inactiveAppointments.length) === 1 ? '' : 's'}`}
        </p>
      </div>

      {/* Segmented tab control */}
      <AppointmentTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        counts={{
          active: activeQuery.isLoading ? undefined : activeAppointments.length,
          inactive: inactiveQuery.isLoading ? undefined : inactiveAppointments.length,
        }}
      />

      {/* Active tab panel */}
      <TabPanel id="active" isVisible={isActiveTab}>
        <AppointmentList
          appointments={activeAppointments}
          isLoading={activeQuery.isLoading}
          error={activeQuery.error}
          role="patient"
          isActive={true}
          // No onEdit / onDelete — patients don't manage appointments
        />
      </TabPanel>

      {/* Inactive / past tab panel */}
      <TabPanel id="inactive" isVisible={!isActiveTab}>
        <AppointmentList
          appointments={inactiveAppointments}
          isLoading={inactiveQuery.isLoading}
          error={inactiveQuery.error}
          role="patient"
          isActive={false}
        />
      </TabPanel>
    </div>
  )
}
