import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Clock, Loader2, Sparkles, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  deleteResearchSession,
  getResearchHistory,
  getResearchSession,
} from "@/services/research.service"
import { toast } from "sonner"

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: sessions = [], isLoading, isError } = useQuery({
    queryKey: ["research-history"],
    queryFn: getResearchHistory,
  })
  const openSession = useMutation({
    mutationFn: getResearchSession,
    onSuccess: (data) => navigate("/results", { state: { data } }),
    onError: () => toast.error("Couldn't load the saved research session."),
  })
  const removeSession = useMutation({
    mutationFn: deleteResearchSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-history"] })
      toast.success("Research session deleted.")
    },
    onError: () => toast.error("Couldn't delete the research session."),
  })

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
  }

  if (isError) {
    return <HistoryMessage title="Couldn't Load History" description="Please check that the backend is running and try again." />
  }

  if (!sessions.length) {
    return <HistoryMessage title="No Research History Yet" description="Your past research sessions will show up here once you start generating them." />
  }

  return (
    <div className="flex w-full animate-fade-in flex-col gap-5 py-2">
      <div className="px-1">
        <span className="label-eyebrow">Saved research</span>
        <h1 className="mt-1 font-display text-3xl font-medium text-foreground">Research History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Open a session to view its saved plan and sources without running a new search.</p>
      </div>
      <div className="grid gap-3">
        {sessions.map((session) => (
          <Card key={session.id} className="group border-border/80 bg-card/70 shadow-soft-sm transition-all hover:border-primary/30 hover:shadow-soft-md">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => openSession.mutate(session.id)}
                className="min-w-0 flex-1 text-left"
                disabled={openSession.isPending}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-display text-xl font-medium text-foreground group-hover:text-primary">{session.topic}</h2>
                  <span className="label-eyebrow">{session.purpose}</span>
                </div>
                <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">{session.focus || session.researchGoal}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  <span>{session.results?.length ?? 0} sources</span>
                  <span>{new Date(session.createdAt).toLocaleString()}</span>
                </div>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${session.topic}`}
                disabled={removeSession.isPending}
                onClick={() => {
                  if (window.confirm(`Delete the saved research for \"${session.topic}\"?`)) removeSession.mutate(session.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function HistoryMessage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full animate-fade-in flex-col items-center justify-center py-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
        <CardHeader className="pt-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground"><Clock className="h-6 w-6" /></div>
          <CardTitle className="font-display text-2xl font-medium text-foreground">{title}</CardTitle>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="flex justify-center pb-10 pt-6">
          <Link to="/"><Button size="lg"><Sparkles className="h-4 w-4" />Start Research</Button></Link>
        </CardContent>
      </Card>
    </div>
  )
}
