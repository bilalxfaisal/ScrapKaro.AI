import React from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb } from "lucide-react"

const focusExamples = [
  "Recent developments (last 2 years)",
  "India-specific data & case studies",
  "Beginner-friendly explanations",
]

export const FocusStep: React.FC = () => {
  const { register, setValue, watch } = useFormContext()

  const currentFocus = (watch("focus") as string | undefined) ?? ""

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1.5">
        <span className="label-eyebrow">Step 04</span>
        <h3 className="font-display text-2xl font-medium text-foreground">Anything to narrow it down?</h3>
        <p className="text-sm text-muted-foreground">
          Define key target metrics, parameters, or restrictions to refine the research.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="focus">
          Specific Focus <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="focus"
          autoFocus
          placeholder="Optional. Example: Healthcare, Neural Networks, Python"
          {...register("focus")}
          className="min-h-[110px] resize-y"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {focusExamples.map((example) => {
            const isSelected = currentFocus.includes(example)
            return (
              <button
                key={example}
                type="button"
                onClick={() => setValue("focus", example, { shouldDirty: true })}
                aria-pressed={isSelected}
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-smooth ${
                  isSelected
                    ? "border-primary/50 bg-accent text-primary shadow-soft-xs"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/25 hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Lightbulb className="h-3 w-3 shrink-0" />
                {example}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
