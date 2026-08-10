import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex w-full animate-fade-in flex-col items-center justify-center px-4 py-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-soft-md">
        <Compass className="h-7 w-7 animate-pulse" />
      </div>
      <h1 className="font-display text-6xl font-medium tracking-tight text-gradient-brand">404</h1>
      <h2 className="mt-3 text-lg font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved to another coordinate.
      </p>
      <Link to="/" className="mt-7">
        <Button size="lg">Navigate Back Home</Button>
      </Link>
    </div>
  )
}
