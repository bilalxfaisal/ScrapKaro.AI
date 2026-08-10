import React from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export const ResearchTopicStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

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
    </div>
  )
}
