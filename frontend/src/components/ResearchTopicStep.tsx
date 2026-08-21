import React from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Zap } from "lucide-react"

const topicSuggestions = [
  "Machine Learning in Healthcare",
  "Impact of Social Media on Mental Health",
  "Renewable Energy in India",
  "Quantum Computing Basics",
]

export const ResearchTopicStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const currentTopic = (watch("topic") as string | undefined) ?? ""

  const applySuggestion = (value: string) => {
    setValue("topic", value, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1.5">
        <span className="label-eyebrow">Step 01</span>
        <h3 className="font-display text-2xl font-medium text-foreground">What are you researching?</h3>
        <p className="text-sm text-muted-foreground">Give it a topic — as broad or specific as you like.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">
          Research Topic <span className="text-primary">*</span>
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="topic"
            autoFocus
            placeholder="e.g. Machine Learning in Healthcare"
            {...register("topic")}
            className={`pl-10 ${errors.topic ? "border-destructive/60 focus-visible:ring-destructive/20" : ""}`}
          />
        </div>
        {errors.topic && (
          <p className="animate-fade-in text-xs font-medium text-destructive">
            {errors.topic.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Zap className="h-3 w-3 text-primary" />
          Quick start
        </span>
        <div className="flex flex-wrap gap-1.5">
          {topicSuggestions.map((suggestion) => {
            const isSelected = currentTopic === suggestion
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                aria-pressed={isSelected}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-smooth ${
                  isSelected
                    ? "border-primary/50 bg-accent text-primary shadow-soft-xs"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/25 hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                {suggestion}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
