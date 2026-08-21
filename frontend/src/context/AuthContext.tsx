import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/services/supabase"
import type { User } from "@supabase/supabase-js"

export interface AppUser {
  id: string
  email: string | null
  name: string | null
  avatarUrl: string | null
}

interface AuthContextValue {
  user: AppUser | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function mapUser(u: User): AppUser {
  const meta = u.user_metadata ?? {}
  const name =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    u.email ||
    null

  return {
    id: u.id,
    email: u.email ?? null,
    name,
    avatarUrl: (meta.avatar_url as string | undefined) || null,
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(data.session?.user ? mapUser(data.session.user) : null)
      setIsLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(session?.user ? mapUser(session.user) : null)
      setIsLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, signInWithGoogle, signOut }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
