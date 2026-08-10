import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Inbox,
  Lightbulb,
  Search,
  BookOpen,
  Tag,
  ArrowUpRight,
  GraduationCap,
  Newspaper,
  FileCheck2,
  Globe,
  Sparkles,
} from "lucide-react"
import type { ResearchResult, ResearchResponse } from "@/types/research"
import { ScoreRing } from "@/components/ScoreRing"

const typeMeta: Record<string, { icon: React.ElementType; label: string }> = {
  academic: { icon: GraduationCap, label: "Academic" },
  article: { icon: Newspaper, label: "Article" },
  pdf: { icon: FileCheck2, label: "PDF" },
  website: { icon: Globe, label: "Website" },
}

const recommendationMeta: Record<string, { label: string; className: string }> = {
  high: {
    label: "High Match",
    className: "bg-[color-mix(in_oklab,var(--score-high)_16%,transparent)] text-[var(--score-high)] border-[color-mix(in_oklab,var(--score-high)_35%,transparent)]",
  },
  medium: {
    label: "Medium Match",
    className: "bg-[color-mix(in_oklab,var(--score-medium)_16%,transparent)] text-[var(--score-medium)] border-[color-mix(in_oklab,var(--score-medium)_35%,transparent)]",
  },
  low: {
    label: "Low Match",
    className: "bg-[color-mix(in_oklab,var(--score-low)_16%,transparent)] text-[var(--score-low)] border-[color-mix(in_oklab,var(--score-low)_35%,transparent)]",
  },
}

function SourceCard({ result, index }: { result: ResearchResult; index: number }) {
  const type = typeMeta[result.type] ?? typeMeta.website
  const TypeIcon = type.icon
  const rec = result.evaluation ? recommendationMeta[result.evaluation.recommendation] : null

  return (
    <div
      className="group relative animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-card/70 p-5 shadow-soft-sm transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-md"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
              <TypeIcon className="h-3 w-3" />
              {type.label}
            </span>
            {rec && (
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wide ${rec.className}`}>
                {rec.label}
              </span>
            )}
          </div>

          <h4 className="text-[1.05rem] font-semibold leading-snug text-foreground">
            {result.title}
          </h4>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-muted-foreground">
            {result.source && <span>{result.source}</span>}
            {result.publishedDate && (
              <>
                <span className="opacity-40">·</span>
                <span>{result.publishedDate}</span>
              </>
            )}
            {result.author && (
              <>
                <span className="opacity-40">·</span>
                <span className="truncate">{result.author}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
          {result.evaluation && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2">
              <ScoreRing value={result.evaluation.relevanceScore} label="Relevance" size={52} />
              <ScoreRing value={result.evaluation.qualityScore} label="Quality" size={52} />
            </div>
          )}
        </div>
      </div>

      {result.evaluation?.explanation ? (
        <div className="mt-4 rounded-xl border-l-2 border-primary/40 bg-muted/30 py-2.5 pl-4 pr-3">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {result.evaluation.explanation}
          </p>
        </div>
      ) : !result.evaluation ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-2.5">
          <p className="text-[13px] text-muted-foreground">
            Returned by Exa but not evaluated by Gemini for this request.
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <a href={result.url} target="_blank" rel="noreferrer noopener">
          <Button variant="outline" size="sm" className="gap-1.5">
            Open Source
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </a>
      </div>
    </div>
  )
}

export const ResultsPage: React.FC = () => {
  const location = useLocation()
  const data = location.state?.data as ResearchResponse | undefined

  if (!data) {
    return (
      <div className="flex w-full animate-fade-in flex-col items-center justify-center py-4">
        <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
          <CardHeader className="pt-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <CardTitle className="font-display text-2xl font-medium text-foreground">
              No Active Research Results
            </CardTitle>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              You haven't run a research query yet in this session. Start a new search from the home page.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center pb-10 pt-6">
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4" />
                Start Research
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const evaluatedCount = data.results?.filter((r) => r.evaluation).length ?? 0

  return (
    <div className="flex w-full animate-fade-in flex-col gap-6 py-2">
      {/* Briefing header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-soft-md backdrop-blur-xl sm:p-8">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[90px]"
          style={{ background: `radial-gradient(closest-side, var(--glow-a), transparent)` }}
        />
        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-1.5 label-eyebrow">
            <Sparkles className="h-3 w-3 text-primary" />
            Research Briefing
          </span>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              New Search
            </Button>
          </Link>
        </div>

        <h1 className="relative mt-3 font-display text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          {data.topic}
        </h1>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <MetaChip value={data.searchQueries?.length ?? 0} label="queries" />
          <MetaChip value={data.keywords?.length ?? 0} label="keywords" />
          <MetaChip value={data.results?.length ?? 0} label="sources" />
          <MetaChip value={evaluatedCount} label="evaluated" />
        </div>
      </div>

      {/* Plan overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PlanCard icon={Lightbulb} iconClass="text-amber-400" title="Research Goal">
          <p className="text-sm leading-relaxed text-muted-foreground">{data.goal}</p>
        </PlanCard>

        <PlanCard icon={Search} iconClass="text-sky-400" title="Search Queries">
          <ul className="space-y-1.5">
            {data.searchQueries?.map((query, idx) => (
              <li key={idx} className="flex items-start gap-2 font-mono text-[12.5px] text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                {query}
              </li>
            ))}
          </ul>
        </PlanCard>

        <PlanCard icon={Tag} iconClass="text-emerald-400" title="Keywords">
          <div className="flex flex-wrap gap-1.5">
            {data.keywords?.map((kw, idx) => (
              <span
                key={idx}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        </PlanCard>

        <PlanCard icon={BookOpen} iconClass="text-rose-400" title="Recommended Sources">
          <ul className="space-y-1.5">
            {data.recommendedSources?.map((source, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                {source}
              </li>
            ))}
          </ul>
        </PlanCard>
      </div>

      {/* Sources */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h3 className="font-display text-xl font-medium text-foreground">Ranked Sources</h3>
          <span className="label-eyebrow">high → low</span>
        </div>

        {data.results?.length ? (
          <div className="flex flex-col gap-3">
            {data.results.map((result, idx) => (
              <SourceCard key={`${result.url}-${idx}`} result={result} index={idx} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">No results were returned for this research request.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function MetaChip({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1">
      <span className="font-mono text-xs font-semibold tabular-nums text-foreground">{value}</span>
      <span className="label-eyebrow">{label}</span>
    </span>
  )
}

function PlanCard({
  icon: Icon,
  iconClass,
  title,
  children,
}: {
  icon: React.ElementType
  iconClass: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-soft-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconClass}`} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}
