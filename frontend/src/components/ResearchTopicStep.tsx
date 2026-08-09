import React from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const ResearchTopicStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-4 py-2 text-left">
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-semibold text-zinc-200">
          Research Topic <span className="text-violet-400">*</span>
        </Label>
        <Input
          id="topic"
          placeholder="e.g. Machine Learning"
          {...register("topic")}
          className={`bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500 text-zinc-100 placeholder:text-zinc-650 h-11 ${
            errors.topic ? "border-red-500/60 focus-visible:ring-red-500/50" : ""
          }`}
        />
        {errors.topic && (
          <p className="text-red-400 text-xs font-medium animate-fade-in">
            {errors.topic.message as string}
          </p>
        )}
      </div>
    </div>
  )
}
