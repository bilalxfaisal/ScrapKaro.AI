import React, { useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export const LoginPage: React.FC = () => {
  const { user, isLoading, signInWithGoogle } = useAuth()
  const location = useLocation()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? "/"

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signInWithGoogle()
      // The browser is redirected to Google's OAuth consent screen.
    } catch (error) {
      console.error("Google sign-in failed:", error)
      setIsSigningIn(false)
      toast.error("Couldn't start Google sign-in. Please try again.")
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      {/* Decorative backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute -top-48 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: `radial-gradient(closest-side, var(--glow-a), transparent)` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] shadow-soft-sm ring-1 ring-border transition-transform duration-300 ease-smooth group-hover:scale-105">
              <img src="/scrapkarologo2.png" alt="" className="h-[70%] w-[70%] object-contain" />
            </span>
            <span className="font-display text-[1.2rem] font-medium leading-none tracking-tight text-foreground">
              ScrapKaro<span className="text-primary">.AI</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Login content */}
      <main className="container mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="flex w-full max-w-md animate-fade-in-up flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/80 shadow-soft-md ring-1 ring-border">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>

          <h1 className="font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-[3rem]">
            Research <span className="text-gradient-brand">smarter.</span>
          </h1>

          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Find papers, PDFs, articles and reliable sources across the web —
            planned, searched and scored by AI.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="group mt-10 flex w-full items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white px-6 py-3.5 text-[0.95rem] font-semibold text-[#1f1f1f] shadow-soft-md transition-all duration-200 ease-smooth outline-none hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60"
          >
            {isSigningIn ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#1f1f1f]" />
            ) : (
              <GoogleLogo className="h-5 w-5" />
            )}
            Continue with Google
          </button>

          <p className="label-eyebrow mt-8 normal-case tracking-normal text-muted-foreground">
            Sign in to save and revisit your research history.
          </p>
        </div>
      </main>
    </div>
  )
}
