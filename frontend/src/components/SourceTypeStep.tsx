import React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { LucideIcon } from "lucide-react"
import { FileText, Newspaper, FileCode, BarChart4, Globe, Book, FileCheck2 } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import type { IconType } from "react-icons"

type SourceOption = {
  id: string
  label: string
  description: string
  icon: LucideIcon | IconType
}

const sourceOptions: SourceOption[] = [
  {
    id: "Articles",
    label: "Articles",
    description: "Web article resources and blog posts",
    icon: Globe,
  },
  {
    id: "Research Papers",
    label: "Research Papers",
    description: "Journals, studies, and conference papers",
    icon: FileText,
  },
  {
    id: "PDFs",
    label: "PDFs",
    description: "Manual whitepapers, scanned drafts and forms",
    icon: FileCheck2,
  },
  {
    id: "Books",
    label: "Books",
    description: "eBooks, textbook materials and encyclopedias",
    icon: Book,
  },
  {
    id: "Official Documentation",
    label: "Official Documentation",
    description: "API references, manuals, code guides",
    icon: FileCode,
  },
  {
    id: "Statistics",
    label: "Statistics",
    description: "Government datasets, census, financial indexes",
    icon: BarChart4,
  },
  {
    id: "GitHub",
    label: "GitHub",
    description: "Open-source readmes, issues, codebases",
    icon: FaGithub,
  },
  {
    id: "News",
    label: "News",
    description: "Journalism columns, press events, newsletters",
    icon: Newspaper,
  },
]

export const SourceTypeStep: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-4 py-2 text-left animate-fade-in">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-zinc-200">
          Source Types <span className="text-violet-400">*</span>
        </Label>
        <p className="text-zinc-500 text-xs">Select one or more sources you want to reference.</p>
      </div>

      <Controller
        name="sourceTypes"
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const currentValues: string[] = field.value || []

          const handleToggle = (id: string) => {
            const nextValues = currentValues.includes(id)
              ? currentValues.filter((v) => v !== id)
              : [...currentValues, id]
            field.onChange(nextValues)
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {sourceOptions.map((option) => {
                const Icon = option.icon
                const isChecked = currentValues.includes(option.id)

                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggle(option.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-300 select-none ${isChecked
                      ? "border-violet-500 bg-violet-600/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/50"
                      : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700"
                      }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(option.id)}
                      className="border-zinc-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-500 focus-visible:ring-violet-500"
                      onClick={(e) => e.stopPropagation()} // Prevent double trigger
                    />
                    <div
                      className={`p-2 rounded-lg border transition-all duration-300 ${isChecked
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-zinc-900 border-zinc-850 text-zinc-400"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4
                        className={`text-sm font-semibold transition-colors duration-200 ${isChecked ? "text-violet-400" : "text-zinc-200"
                          }`}
                      >
                        {option.label}
                      </h4>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        {option.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }}
      />

      {errors.sourceTypes && (
        <p className="text-red-400 text-xs font-medium mt-2 animate-fade-in">
          {errors.sourceTypes.message as string}
        </p>
      )}
    </div>
  )
}
