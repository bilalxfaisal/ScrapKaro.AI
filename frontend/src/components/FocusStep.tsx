import React from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export const FocusStep: React.FC = () => {
  const { register } = useFormContext()

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
          placeholder="Optional. Example: Healthcare, Neural Networks, Python"
          {...register("focus")}
          className="min-h-[130px] resize-y"
        />
      </div>
    </div>
  )
}
