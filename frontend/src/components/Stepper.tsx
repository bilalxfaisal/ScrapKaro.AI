import React from "react"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number // 1 to 4
  totalSteps: number
  stepNames: string[]
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, stepNames }) => {
  // Calculate percentage: for 4 steps, progress transitions from 0%, 33.3%, 66.6%, to 100%
  const progressValue = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full space-y-6">
      {/* Visual Line Progress */}
      <div className="relative pt-2">
        <Progress value={progressValue} className="h-1 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500" />
      </div>

      {/* Number Bubbles */}
      <div className="flex justify-between items-center relative">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={name} className="flex flex-col items-center text-center group">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold border transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 border-transparent text-white shadow-lg shadow-violet-500/20"
                    : isActive
                    ? "bg-zinc-900 border-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] scale-105"
                    : "bg-zinc-950 border-zinc-850 text-zinc-500"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-violet-400 font-semibold"
                    : isCompleted
                    ? "text-zinc-300"
                    : "text-zinc-500"
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
