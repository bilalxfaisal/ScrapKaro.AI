import { api } from "./api";
import type { ResearchFormData, ResearchResponse } from "@/types/research";

interface BackendResearchPlan {
  researchGoal: string;
  searchQueries: string[];
  keywords: string[];
  recommendedSources: string[];
}

interface BackendResearch {
  topic: string;
  plan: BackendResearchPlan;
  results: ResearchResponse["results"];
}

interface BackendResponse {
  success: boolean;
  research: BackendResearch;
}

export const createResearch = async (data: ResearchFormData): Promise<ResearchResponse> => {
  const payload = {
    topic: data.topic,
    purpose: data.purpose,
    sourceTypes: data.sourceTypes,
    focus: data.focus || "",
  };

  const response = await api.post<BackendResponse>("/research", payload);
  const backendData = response.data.research;

  return {
    topic: backendData.topic,
    goal: backendData.plan.researchGoal,
    searchQueries: backendData.plan.searchQueries,
    keywords: backendData.plan.keywords,
    recommendedSources: backendData.plan.recommendedSources,
    results: backendData.results ?? [],
  };
};
