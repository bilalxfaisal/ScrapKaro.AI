import { z } from "zod"

export const researchFormSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be at least 2 characters long" }),
  purpose: z.enum([
    "Assignment",
    "Research Paper",
    "Learning",
    "Coding Project",
    "Presentation",
    "Business Research",
  ], {
    errorMap: () => ({ message: "Please select a purpose" })
  }),
  sourceTypes: z.array(z.string()).min(1, { message: "Select at least one source type" }),
  focus: z.string().optional(),
})

export type ResearchFormData = z.infer<typeof researchFormSchema>

export interface ResearchResponse {
  topic: string;
  goal: string;
  searchQueries: string[];
  keywords: string[];
  recommendedSources: string[];
}
