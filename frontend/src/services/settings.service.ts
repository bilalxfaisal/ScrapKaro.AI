import { api } from "./api"

export const MIN_SOURCES = 5
export const MAX_SOURCES = 15
export const DEFAULT_SOURCES = 5

export interface ApiKeysStatus {
  geminiConfigured: boolean;
  exaConfigured: boolean;
  maxSources: number;
}

export const MISSING_API_KEYS_MESSAGE =
  "Please configure your Gemini and Exa API keys in Settings before starting research.";

export interface SaveApiKeysPayload {
  geminiApiKey?: string;
  exaApiKey?: string;
  maxSources?: number;
}

export const getApiKeysStatus = async (): Promise<ApiKeysStatus> => {
  const response = await api.get<ApiKeysStatus>("/settings/api-keys");
  return response.data;
};

export const saveApiKeys = async (
  payload: SaveApiKeysPayload,
): Promise<ApiKeysStatus> => {
  const response = await api.put<ApiKeysStatus>("/settings/api-keys", payload);
  return response.data;
};
