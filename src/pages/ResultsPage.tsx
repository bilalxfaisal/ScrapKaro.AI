import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Inbox, Lightbulb, Search, BookOpen, Tag } from "lucide-react"
import type { ResearchResponse } from "@/types/research"

export const ResultsPage: React.FC = () => {
  const location = useLocation()
  const data = location.state?.data as ResearchResponse | undefined

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-4 animate-fade-in">
        <Card className="w-full max-w-xl bg-zinc-950 border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
              <Inbox className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              No Active Research Results
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              You haven't run a research query yet in this session. Start a new search from the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Link to="/">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-none gap-2 px-6">
                <ArrowLeft className="h-4 w-4" />
                Start Research
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] w-full py-8 animate-fade-in px-4">
      <Card className="w-full max-w-4xl bg-zinc-950 border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <CardHeader className="border-b border-zinc-900/60 pb-6 pt-8 px-6 sm:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-violet-400 tracking-wider uppercase">Research Results</h2>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">{data.topic}</CardTitle>
        </CardHeader>

        <CardContent className="py-8 px-6 sm:px-8 flex flex-col gap-8">
          
          <section>
            <div className="flex items-center gap-2 mb-3 text-zinc-200">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h3 className="text-xl font-semibold">Research Goal</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed pl-7">{data.goal}</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-zinc-200">
              <Search className="h-5 w-5 text-blue-400" />
              <h3 className="text-xl font-semibold">Search Queries</h3>
            </div>
            <ul className="list-disc pl-11 text-zinc-400 space-y-1">
              {data.searchQueries?.map((query, idx) => (
                <li key={idx}>{query}</li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-zinc-200">
              <Tag className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xl font-semibold">Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2 pl-7">
              {data.keywords?.map((kw, idx) => (
                <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 text-sm">
                  {kw}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-zinc-200">
              <BookOpen className="h-5 w-5 text-rose-400" />
              <h3 className="text-xl font-semibold">Recommended Sources</h3>
            </div>
            <ul className="list-disc pl-11 text-zinc-400 space-y-1">
              {data.recommendedSources?.map((source, idx) => (
                <li key={idx}>{source}</li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-zinc-200">
              <BookOpen className="h-5 w-5 text-rose-400" />
              <h3 className="text-xl font-semibold">Search Results</h3>
            </div>
            <div className="space-y-4 pl-7">
              {data.results?.length ? (
                data.results.map((result, idx) => (
                  <a
                    key={idx}
                    href={result.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-violet-500 transition"
                  >
                    <p className="text-white font-semibold">{result.title}</p>
                    <p className="text-zinc-500 text-sm mt-1">{result.source}</p>
                  </a>
                ))
              ) : (
                <p className="text-zinc-500">No results were returned for this research request.</p>
              )}
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  )
}
