import React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { BookOpen, FileText, GraduationCap, Code, Presentation, Briefcase } from "lucide-react"

const purposeOptions = [
  {
    id: "Assignment",
    label: "Assignment",
    description: "Academic homework and coursework",
    icon: BookOpen,
  },
  {
    id: "Research Paper",
    label: "Research Paper",
    description: "Scientific thesis or peer-reviewed journal papers",
    icon: FileText,
  },
  {
    id: "Learning",
    label: "Learning",
    description: "Self-improvement, exploring skills, or tutorials",
    icon: GraduationCap,
  },
  {
    id: "Coding Project",
    label: "Coding Project",
    description: "Software engineering, building tools or services",
    icon: Code,
  },
  {
    id: "Presentation",
    label: "Presentation",
    description: "Slides, talks, seminars and keynotes",
    icon: Presentation,
  },
  {
    id: "Business Research",
    label: "Business Research",
    description: "Market studies, case reports, business plans",
    icon: Briefcase,
  },
]

export const PurposeStep: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1.5">
        <span className="label-eyebrow">Step 02</span>
        <h3 className="font-display text-2xl font-medium text-foreground">What's it for?</h3>
        <p className="text-sm text-muted-foreground">Select the primary purpose behind your research query.</p>
      </div>

      <Controller
        name="purpose"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {purposeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = field.value === option.id

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => field.onChange(option.id)}
                  aria-pressed={isSelected}
                  className={`group flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ease-smooth ${
                    isSelected
                      ? "border-primary/50 bg-accent shadow-soft-sm ring-1 ring-primary/20"
                      : "border-border bg-card/50 hover:border-primary/25 hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-muted text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </h4>
                    <p className="text-[11.5px] leading-normal text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      />

      {errors.purpose && (
        <p className="animate-fade-in text-xs font-medium text-destructive">
          {errors.purpose.message as string}
        </p>
      )}
    </div>
  )
}
