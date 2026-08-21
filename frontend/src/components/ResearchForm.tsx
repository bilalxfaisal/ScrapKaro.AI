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
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useCreateResearch } from "@/hooks/useCreateResearch"
import { useApiKeysStatus } from "@/hooks/useApiKeys"
import { MISSING_API_KEYS_MESSAGE } from "@/services/settings.service"
import { toast } from "sonner"

const stepNames = ["Topic", "Purpose", "Sources", "Focus"]

export const ResearchForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
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

  const { trigger, handleSubmit } = methods

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
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onSubmit = (data: ResearchFormData) => {
    if (currentStep !== 4) {
      setCurrentStep(4)
      return
    }

    if (keyStatus && (!keyStatus.geminiConfigured || !keyStatus.exaConfigured)) {
      toast.error(MISSING_API_KEYS_MESSAGE)
      return
    }

    createResearch(data)
  }

  return (
    <Card className="w-full overflow-hidden rounded-3xl border-border/80 bg-card/70 shadow-soft-lg backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-6 pb-6 pt-7 sm:px-8">
        <Stepper currentStep={currentStep} totalSteps={4} stepNames={stepNames} />
      </CardHeader>

      <FormProvider {...methods}>
        <form onSubmit={(event) => event.preventDefault()}>
          <CardContent className="flex min-h-[340px] flex-col justify-center px-6 py-8 sm:px-8">
            <div key={currentStep} className="animate-fade-in-up">
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
              disabled={currentStep === 1}
              size="lg"
              className="disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} size="lg">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
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
