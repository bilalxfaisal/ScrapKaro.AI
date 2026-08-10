import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Sparkles } from "lucide-react"

export const HistoryPage: React.FC = () => {
  return (
    <div className="flex w-full animate-fade-in flex-col items-center justify-center py-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[80px]"
          style={{ background: `radial-gradient(closest-side, var(--glow-a), transparent)` }}
        />
        <CardHeader className="pt-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
            <Clock className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl font-medium text-foreground">
            No Research History Yet
          </CardTitle>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            Your past research sessions will show up here once you start generating them.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 pb-10 pt-6">
          <Link to="/">
            <Button size="lg">
              <Sparkles className="h-4 w-4" />
              Start Your First Research
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
