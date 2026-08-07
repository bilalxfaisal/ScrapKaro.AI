import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Inbox } from "lucide-react"

export const ResultsPage: React.FC = () => {
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
