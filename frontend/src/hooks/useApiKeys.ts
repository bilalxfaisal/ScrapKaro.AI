import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getApiKeysStatus, saveApiKeys } from "@/services/settings.service"
import type { ApiKeysStatus, SaveApiKeysPayload } from "@/services/settings.service"

export const API_KEYS_STATUS_QUERY_KEY = ["api-keys-status"] as const

export const useApiKeysStatus = () =>
  useQuery<ApiKeysStatus>({
    queryKey: API_KEYS_STATUS_QUERY_KEY,
    queryFn: getApiKeysStatus,
  })

export const useSaveApiKeys = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiKeysStatus, Error, SaveApiKeysPayload>({
    mutationFn: saveApiKeys,
    onSuccess: (data) => {
      queryClient.setQueryData(API_KEYS_STATUS_QUERY_KEY, data)
    },
  })
}
