import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, History, FileText, Compass } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Research", icon: Search },
    { path: "/results", label: "Results", icon: FileText },
    { path: "/history", label: "History", icon: History },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased relative overflow-hidden flex flex-col">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Research Assistant
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-violet-400 bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col justify-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950/20 py-6 text-center text-xs text-zinc-500">
        <div className="container mx-auto px-4 max-w-5xl">
          <p>© {new Date().getFullYear()} Research Assistant. Formulating insights for tomorrow.</p>
        </div>
      </footer>
    </div>
  )
}
