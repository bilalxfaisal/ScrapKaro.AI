import React from "react"
import { ResearchForm } from "@/components/ResearchForm"
import { Sparkles, ScanSearch, Gauge } from "lucide-react"

const pillars = [
  { icon: ScanSearch, text: "Plans your search strategy" },
  { icon: Gauge, text: "Scores every source it finds" },
]

export const HomePage: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 py-4">
      <div className="max-w-2xl space-y-5 text-center">
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 shadow-soft-xs animate-fade-in">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="label-eyebrow">AI Research Assistant</span>
        </div>

        <h1 className="animate-fade-in-up font-display text-[2.75rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-6xl">
          Turn a topic into a
          <span className="text-gradient-brand"> ranked reading list</span>
        </h1>

        <p className="mx-auto max-w-md animate-fade-in-up text-balance text-[15px] leading-relaxed text-muted-foreground animation-delay-100">
          Give it a topic and purpose. It plans the research, searches the real web,
          and scores every source for relevance and quality — before you open a single link.
        </p>

        <div className="flex animate-fade-in-up flex-wrap items-center justify-center gap-2 animation-delay-200">
          {pillars.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-xl animate-fade-in-up animation-delay-300">
        <ResearchForm />
      </div>
    </div>
  )
}
