import { api } from "./api";
import { ResearchFormData, ResearchResponse } from "@/types/research";

export const createResearch = async (data: ResearchFormData): Promise<ResearchResponse> => {
  // Ensure the payload matches backend DTO exactly.
  // The backend might expect 'sources' instead of 'sourceTypes', let's map it.
  const payload = {
    topic: data.topic,
    purpose: data.purpose,
    sources: data.sourceTypes,
    focus: data.focus || "",
  };

  const response = await api.post<ResearchResponse>("/research", payload);
  return response.data;
};
