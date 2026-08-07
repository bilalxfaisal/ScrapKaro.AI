import React from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export const FocusStep: React.FC = () => {
  const { register } = useFormContext()

  return (
    <div className="space-y-4 py-2 text-left animate-fade-in">
      <div className="space-y-1">
        <Label htmlFor="focus" className="text-sm font-semibold text-zinc-200">
          Specific Focus <span className="text-zinc-500 font-normal text-xs">(Optional)</span>
        </Label>
        <p className="text-zinc-500 text-xs">Define key target metrics, parameters, or restrictions to refine the research.</p>
      </div>

      <Textarea
        id="focus"
        placeholder="Optional. Example: Healthcare, Neural Networks, Python"
        {...register("focus")}
        className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500 text-zinc-100 placeholder:text-zinc-650 min-h-[120px] resize-y h-32"
      />
    </div>
  )
}
