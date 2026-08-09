import React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
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
    <div className="space-y-4 py-2 text-left animate-fade-in">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-zinc-200">
          Research Purpose <span className="text-violet-400">*</span>
        </Label>
        <p className="text-zinc-500 text-xs">Select the primary purpose behind your research query.</p>
      </div>

      <Controller
        name="purpose"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {purposeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = field.value === option.id

              return (
                <div
                  key={option.id}
                  onClick={() => field.onChange(option.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-300 select-none ${
                    isSelected
                      ? "border-violet-500 bg-violet-600/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/50"
                      : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg border transition-all duration-300 ${
                      isSelected
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-zinc-900 border-zinc-850 text-zinc-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        isSelected ? "text-violet-400" : "text-zinc-200"
                      }`}
                    >
                      {option.label}
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {option.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      />

      {errors.purpose && (
        <p className="text-red-400 text-xs font-medium mt-2 animate-fade-in">
          {errors.purpose.message as string}
        </p>
      )}
    </div>
  )
}
