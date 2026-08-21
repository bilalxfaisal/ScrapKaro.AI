import React, { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stepper } from "./Stepper"
import { ResearchTopicStep } from "./ResearchTopicStep"
import { PurposeStep } from "./PurposeStep"
import { SourceTypeStep } from "./SourceTypeStep"
import { FocusStep } from "./FocusStep"
import { researchFormSchema } from "@/types/research"
import type { ResearchFormData } from "@/types/research"
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Pencil } from "lucide-react"
import { useCreateResearch } from "@/hooks/useCreateResearch"
import { useApiKeysStatus } from "@/hooks/useApiKeys"
import { MISSING_API_KEYS_MESSAGE } from "@/services/settings.service"
import { toast } from "sonner"

const stepNames = ["Topic", "Purpose", "Sources", "Focus"]

const BriefRecap: React.FC<{
  topic: string
  purpose: string
  sourceTypes: string[]
  onEdit: (step: number) => void
}> = ({ topic, purpose, sourceTypes, onEdit }) => {
  const items = [
    { step: 1, label: "Topic", value: topic || "Not set" },
    { step: 2, label: "Purpose", value: purpose || "Not set" },
    {
      step: 3,
      label: "Sources",
      value: sourceTypes.length ? `${sourceTypes.length} type${sourceTypes.length === 1 ? "" : "s"} selected` : "None selected",
    },
  ]

  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-muted/40 p-3.5">
      <span className="label-eyebrow">Your brief</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => onEdit(item.step)}
            title={`Edit ${item.label.toLowerCase()}`}
            className="group flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card/70 py-1 pl-3 pr-2 text-xs transition-all duration-200 ease-smooth hover:border-primary/30 hover:bg-accent/60"
          >
            <span className="shrink-0 font-semibold text-muted-foreground">{item.label}:</span>
            <span className="truncate font-medium capitalize text-foreground">{item.value}</span>
            <Pencil className="h-3 w-3 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  )
}

export const ResearchForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const { mutate: createResearch, isPending } = useCreateResearch()
  const { data: keyStatus } = useApiKeysStatus()

  const methods = useForm<ResearchFormData>({
    resolver: zodResolver(researchFormSchema),
    mode: "onChange",
    defaultValues: {
      topic: "",
      purpose: undefined,
      sourceTypes: [],
      focus: "",
    },
  })

  const { trigger, handleSubmit, watch } = methods

  const goToStep = (step: number) => {
    if (step === currentStep || isPending) return
    setDirection(step < currentStep ? "back" : "forward")
    setCurrentStep(step)
  }

  const handleNext = async () => {
    let isValid = false
    if (currentStep === 1) {
      isValid = await trigger("topic")
    } else if (currentStep === 2) {
      isValid = await trigger("purpose")
    } else if (currentStep === 3) {
      isValid = await trigger("sourceTypes")
    }

    if (isValid) {
      goToStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    goToStep(currentStep - 1)
  }

  const onSubmit = (data: ResearchFormData) => {
    if (currentStep !== 4) {
      goToStep(4)
      return
    }

    if (keyStatus && (!keyStatus.geminiConfigured || !keyStatus.exaConfigured)) {
      toast.error(MISSING_API_KEYS_MESSAGE)
      return
    }

    createResearch(data)
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isPending) return
    if (currentStep < 4) {
      void handleNext()
      return
    }
    void handleSubmit(onSubmit)(event)
  }

  return (
    <Card className="w-full overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-6 pb-6 pt-7 sm:px-8">
        <Stepper
          currentStep={currentStep}
          totalSteps={4}
          stepNames={stepNames}
          onStepClick={goToStep}
        />
      </CardHeader>

      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit}>
          <CardContent className="flex min-h-[340px] flex-col justify-center px-6 py-8 sm:px-8">
            <div key={currentStep} className={direction === "back" ? "animate-step-back" : "animate-step-forward"}>
              {currentStep === 4 && (
                <div className="mb-5">
                  <BriefRecap
                    topic={watch("topic")}
                    purpose={watch("purpose") ?? ""}
                    sourceTypes={watch("sourceTypes") ?? []}
                    onEdit={goToStep}
                  />
                </div>
              )}
              {currentStep === 1 && <ResearchTopicStep />}
              {currentStep === 2 && <PurposeStep />}
              {currentStep === 3 && <SourceTypeStep />}
              {currentStep === 4 && <FocusStep />}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-4 border-t border-border/70 bg-muted/30 px-6 py-6 sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isPending}
              size="lg"
              className="disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button type="submit" size="lg">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="shadow-glow-primary"
              >
                {isPending ? (
                  <>
                    Analyzing your topic
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Generate Research
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  )
}
