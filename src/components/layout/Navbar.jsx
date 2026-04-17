import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  HeartPulse,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { getInitials, capitalize } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

/**
 * Top navigation bar.
 * @param {{ onMenuToggle: () => void, isSidebarOpen: boolean }} props
 */
export function Navbar({ onMenuToggle, isSidebarOpen }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-border bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="-ml-2 shrink-0 lg:hidden"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2.5 font-bold text-primary text-lg select-none"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
          <HeartPulse className="h-[18px] w-[18px]" />
        </div>
        <span className="hidden tracking-tight sm:inline">CareConnect</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="max-w-[160px] truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              {role && (
                <Badge variant={role} className="mt-0.5 px-1.5 py-0 text-[10px]">
                  {capitalize(role)}
                </Badge>
              )}
            </div>

            <Avatar className="h-9 w-9 ring-2 ring-border">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </header>
  )
}
