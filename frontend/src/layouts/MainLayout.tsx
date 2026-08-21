import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, History, FileText, Settings } from "lucide-react"
import { UserMenu } from "@/components/UserMenu"

interface MainLayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { path: "/", label: "Research", icon: Search },
  { path: "/results", label: "Results", icon: FileText },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
]

const BrandLink: React.FC = () => (
  <Link to="/" className="group flex items-center gap-2.5">
    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] shadow-soft-sm ring-1 ring-border transition-transform duration-300 ease-smooth group-hover:scale-105">
      <img src="/scrapkarologo2.png" alt="" className="h-[70%] w-[70%] object-contain" />
    </span>
    <span className="font-display text-[1.2rem] font-medium leading-none tracking-tight text-foreground">
      ScrapKaro<span className="text-primary">.AI</span>
    </span>
  </Link>
)

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation()

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

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
        {/* Mobile — brand row + full-width labeled nav */}
        <div className="sm:hidden">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
            <BrandLink />
            <UserMenu />
          </div>
          <nav className="mx-auto mb-2.5 flex w-[calc(100%-2rem)] max-w-5xl items-stretch gap-1 rounded-2xl border border-border bg-card/60 p-1 shadow-soft-xs">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all duration-200 ease-smooth ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-soft-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Tablet / desktop — single row */}
        <div className="hidden sm:block">
          <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <BrandLink />

            <nav className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-soft-xs">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-smooth ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/70 py-6">
        <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 text-center sm:flex-row sm:text-left">
          <p className="label-eyebrow normal-case tracking-normal text-muted-foreground">
            © {new Date().getFullYear()} ScrapKaro.AI — plan, search, evaluate.
          </p>
          <p className="label-eyebrow">Gemini + Exa</p>
        </div>
      </footer>
    </div>
  )
}
