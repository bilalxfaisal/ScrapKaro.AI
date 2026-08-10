import React from "react"
import { useFormContext, Controller } from "react-hook-form"
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
    <div className="space-y-5 text-left">
      <div className="space-y-1.5">
        <span className="label-eyebrow">Step 03</span>
        <h3 className="font-display text-2xl font-medium text-foreground">Where should it look?</h3>
        <p className="text-sm text-muted-foreground">Select one or more source types you want referenced.</p>
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
            <div className="grid max-h-[280px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:max-h-none sm:grid-cols-2 sm:overflow-visible">
              {sourceOptions.map((option) => {
                const Icon = option.icon
                const isChecked = currentValues.includes(option.id)

                return (
                  <div
                    key={option.id}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onClick={() => handleToggle(option.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleToggle(option.id)
                      }
                    }}
                    className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                      isChecked
                        ? "border-primary/50 bg-accent shadow-soft-sm ring-1 ring-primary/20"
                        : "border-border bg-card/50 hover:border-primary/25 hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(option.id)}
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={-1}
                    />
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                        isChecked
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h4
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          isChecked ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </h4>
                      <p className="truncate text-[10.5px] leading-normal text-muted-foreground">
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
        <p className="animate-fade-in text-xs font-medium text-destructive">
          {errors.sourceTypes.message as string}
        </p>
      )}
    </div>
  )
}
