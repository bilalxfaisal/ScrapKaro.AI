import React from "react"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number // 1 to 4
  totalSteps: number
  stepNames: string[]
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, stepNames }) => {
  const progressValue = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">Research Brief</span>
        <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
          {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </span>
      </div>

      <div className="relative">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[color-mix(in_oklab,var(--primary)_55%,#4f74ff)] transition-all duration-500 ease-smooth"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={name} className="flex flex-1 flex-col items-center gap-2 text-center first:items-start first:text-left last:items-end last:text-right">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all duration-300 ease-smooth ${
                  isCompleted
                    ? "border-transparent bg-primary text-primary-foreground shadow-soft-sm"
                    : isActive
                    ? "border-primary bg-card text-primary shadow-soft-sm ring-4 ring-primary/10"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : String(stepNumber).padStart(2, "0")}
              </div>
              <span
                className={`text-[11px] font-medium transition-colors duration-200 ${
                  isActive ? "text-foreground" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"
                }`}
              >
                {name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
