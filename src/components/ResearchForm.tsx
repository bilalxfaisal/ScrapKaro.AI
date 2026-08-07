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

const stepNames = ["Topic", "Purpose", "Sources", "Focus"]

export const ResearchForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const { mutate: createResearch, isPending } = useCreateResearch()

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

    // Call the API via the mutation hook
    createResearch(data)
  }

  return (
    <Card className="w-full bg-zinc-950/40 border-zinc-800/80 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="border-b border-zinc-900/60 pb-6 pt-8 px-6 sm:px-8">
        <Stepper currentStep={currentStep} totalSteps={4} stepNames={stepNames} />
      </CardHeader>

      <FormProvider {...methods}>
        <form onSubmit={(event) => event.preventDefault()}>
          <CardContent className="py-8 px-6 sm:px-8 min-h-[340px] flex flex-col justify-center">
            {currentStep === 1 && <ResearchTopicStep />}
            {currentStep === 2 && <PurposeStep />}
            {currentStep === 3 && <SourceTypeStep />}
            {currentStep === 4 && <FocusStep />}
          </CardContent>

          <CardFooter className="border-t border-zinc-900/60 pt-6 pb-8 px-6 sm:px-8 flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 text-white border-none transition-all duration-200"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-700 hover:to-indigo-700 text-white border-none shadow-[0_0_20px_rgba(139,92,246,0.3)] shadow-violet-500/20 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isPending ? (
                  <>
                    Analyzing your research topic...
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Generate Research
                    <Sparkles className="h-4 w-4 ml-2" />
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
