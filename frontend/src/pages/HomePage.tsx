import React from "react"
import { ResearchForm } from "@/components/ResearchForm"

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full py-4">
      <div className="text-center max-w-xl mb-8 space-y-3 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Research Assistant
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Find the best sources, papers, articles, PDFs, and documentation for any topic.
        </p>
      </div>
      <div className="w-full max-w-xl">
        <ResearchForm />
      </div>
    </div>
  )
}
