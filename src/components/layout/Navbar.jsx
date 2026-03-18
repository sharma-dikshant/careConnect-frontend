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
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-white/95 backdrop-blur-sm px-4 gap-3 shadow-sm">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-primary text-lg select-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <HeartPulse className="h-4 w-4" />
        </div>
        <span className="hidden sm:inline">CareConnect</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                {user.name}
              </span>
              {role && (
                <Badge variant={role} className="text-[10px] px-1.5 py-0">
                  {capitalize(role)}
                </Badge>
              )}
            </div>

            <Avatar className="h-8 w-8">
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
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
