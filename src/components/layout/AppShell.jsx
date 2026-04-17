import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

/**
 * Main application shell.
 * Renders: Navbar (top) + Sidebar (left) + page content (right via Outlet).
 *
 * Layout:
 * ┌─────────────── Navbar (h-16, sticky) ───────────────┐
 * │ Sidebar (w-64) │ Main Content (flex-1, scrollable)  │
 * └────────────────────────────────────────────────────┘
 */
export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-slate-50">
      <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
