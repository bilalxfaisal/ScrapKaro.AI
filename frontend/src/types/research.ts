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

export interface EvaluationMetadata {
  relevanceScore: number;
  qualityScore: number;
  sourceType: 'academic' | 'article' | 'website';
  recommendation: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface ResearchResult {
  title: string;
  url: string;
  source: string;
  type: string;
  publishedDate?: string;
  author?: string;
  evaluation?: EvaluationMetadata;
}

export interface ResearchResponse {
  topic: string;
  goal: string;
  searchQueries: string[];
  keywords: string[];
  recommendedSources: string[];
  results: ResearchResult[];
}

export interface ResearchHistoryItem {
  id: string;
  topic: string;
  purpose: string;
  focus: string | null;
  researchGoal: string;
  results: ResearchResult[];
  createdAt: string;
}

export interface SavedResearchSession extends ResearchHistoryItem {
  sourceTypes: string[];
  searchQueries: string[];
  keywords: string[];
  recommendedSources: string[];
}
