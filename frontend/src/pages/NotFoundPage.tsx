import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Compass, Home, ArrowLeft } from "lucide-react"

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

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

      {/* Brand header */}
      <header className="w-full border-b border-border/80 bg-background/75 backdrop-blur-xl">
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

      {/* Content */}
      <main className="container mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="animate-fade-in-up mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card shadow-soft-md">
          <Compass className="h-9 w-9 animate-float text-primary" />
        </div>

        <p className="label-eyebrow animate-fade-in-up animation-delay-100">
          Error 404 · Off the map
        </p>

        <h1 className="animate-fade-in-up animation-delay-200 mt-4 font-display text-[6rem] font-medium leading-none tracking-tight text-gradient-brand sm:text-[9rem]">
          404
        </h1>

        <h2 className="animate-fade-in-up animation-delay-300 mt-5 text-xl font-semibold text-foreground">
          This page drifted out of orbit
        </h2>

        <p className="animate-fade-in-up animation-delay-300 mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has moved to another
          coordinate. Let's get you back to researching.
        </p>

        {location.pathname !== "/" && (
          <div className="animate-fade-in-up animation-delay-400 mt-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5">
            <span className="label-eyebrow normal-case tracking-normal">You tried</span>
            <code className="truncate font-mono text-xs text-accent-foreground">
              {location.pathname}
            </code>
          </div>
        )}

        <div className="animate-fade-in-up animation-delay-400 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => navigate(-1)}>
            <ArrowLeft data-icon="inline-start" />
            Go Back
          </Button>
          <Link to="/">
            <Button size="lg" variant="outline">
              <Home data-icon="inline-start" />
              Back to Research
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/70 py-6">
        <p className="label-eyebrow container mx-auto max-w-5xl px-4 normal-case tracking-normal text-muted-foreground">
          © {new Date().getFullYear()} ScrapKaro.AI — plan, search, evaluate.
        </p>
      </footer>
    </div>
  )
}
