import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4 animate-fade-in">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-violet-400 mb-6 shadow-2xl">
        <Compass className="h-12 w-12 animate-pulse" />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 className="text-xl font-semibold text-zinc-200 mb-2">Page Not Found</h2>
      <p className="text-zinc-400 text-sm max-w-sm mb-8">
        The page you are looking for doesn't exist or has been moved to another coordinate.
      </p>
      <Link to="/">
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-none px-6">
          Navigate Back Home
        </Button>
      </Link>
    </div>
  )
}
