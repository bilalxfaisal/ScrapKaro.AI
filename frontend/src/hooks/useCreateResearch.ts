import { useMutation } from "@tanstack/react-query";
import { createResearch } from "@/services/research.service";
import type { ResearchFormData, ResearchResponse } from "@/types/research";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/api-errors";

export const useCreateResearch = () => {
  const navigate = useNavigate();

  return useMutation<ResearchResponse, Error, ResearchFormData>({
    mutationFn: (data: ResearchFormData) => createResearch(data),
    onSuccess: (data) => {
      toast.success("Research plan generated successfully!");
      // Navigate to results page with the response data
      navigate("/results", { state: { data } });
    },
    onError: (error) => {
      console.error("Failed to generate research:", error);
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to generate research plan. Please try again.",
        ),
      );
    },
  });
};
