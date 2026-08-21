import React from "react"
import { DropdownMenu } from "radix-ui"
import { useNavigate } from "react-router-dom"
import { LogOut, Mail, UserRound } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const displayName = user.name || user.email || "Account"
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card/70 text-sm font-semibold text-foreground shadow-soft-xs ring-ring transition-all duration-200 ease-smooth outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:border-primary/40"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[16rem] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-soft-lg backdrop-blur-xl"
        >
          <div className="px-2.5 py-2">
            <p className="flex items-center gap-2 truncate text-sm font-semibold text-foreground">
              <UserRound className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{displayName}</span>
            </p>
            {user.email && (
              <p className="mt-1 flex items-center gap-2 truncate text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            )}
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-destructive outline-none transition-colors duration-150 data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
