import { api } from "./api";
import type {
  ResearchFormData,
  ResearchHistoryItem,
  ResearchResponse,
  SavedResearchSession,
} from "@/types/research";

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

export const getResearchHistory = async (): Promise<ResearchHistoryItem[]> => {
  const response = await api.get<ResearchHistoryItem[]>("/research/history");
  return response.data;
};

export const getResearchSession = async (id: string): Promise<ResearchResponse> => {
  const response = await api.get<SavedResearchSession>(`/research/history/${id}`);
  const session = response.data;

  return {
    topic: session.topic,
    goal: session.researchGoal,
    searchQueries: session.searchQueries,
    keywords: session.keywords,
    recommendedSources: session.recommendedSources,
    results: session.results,
  };
};

export const deleteResearchSession = async (id: string): Promise<void> => {
  await api.delete(`/research/history/${id}`);
};
