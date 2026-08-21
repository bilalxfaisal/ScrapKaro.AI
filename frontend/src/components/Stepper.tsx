import React from "react"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number // 1 to 4
  totalSteps: number
  stepNames: string[]
  onStepClick?: (step: number) => void
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  stepNames,
  onStepClick,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">Research Brief</span>
        <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
          Step {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-start">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isClickable = isCompleted && Boolean(onStepClick)

          const circleClasses = `relative z-10 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all duration-300 ease-smooth ${
            isActive
              ? "scale-110 border-primary bg-primary text-primary-foreground shadow-[0_0_18px_-2px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
              : isCompleted
              ? "border-primary/40 bg-primary/15 text-primary group-hover:scale-105 group-hover:border-primary/70 group-hover:bg-primary/25"
              : "border-border bg-card text-muted-foreground/50"
          }`

          const labelClasses = `text-[11px] font-medium leading-tight transition-colors duration-200 ${
            isActive
              ? "text-foreground"
              : isClickable
              ? "text-muted-foreground group-hover:text-foreground"
              : "text-muted-foreground/40"
          } ${isActive ? "" : "hidden sm:block"}`

          const content = (
            <>
              <div className={circleClasses}>
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : String(stepNumber).padStart(2, "0")}
              </div>
              <span className={labelClasses}>{name}</span>
            </>
          )

          const nodeAlignment = "flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-20"

          return (
            <React.Fragment key={name}>
              {index > 0 && (
                <div
                  aria-hidden
                  className="relative -ml-px -mr-px mt-[17px] h-0.5 flex-1 self-start overflow-hidden rounded-full bg-border"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-smooth ${
                      stepNumber <= currentStep
                        ? "w-full bg-gradient-to-r from-primary/60 to-primary"
                        : "w-0 bg-transparent"
                    }`}
                  />
                </div>
              )}

              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(stepNumber)}
                  aria-label={`Go back to step ${stepNumber}: ${name}`}
                  aria-current={isActive ? "step" : undefined}
                  title={`Back to "${name}"`}
                  className={`group cursor-pointer ${nodeAlignment}`}
                >
                  {content}
                </button>
              ) : (
                <div aria-current={isActive ? "step" : undefined} className={nodeAlignment}>
                  {content}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
