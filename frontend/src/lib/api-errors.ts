import type { AxiosError } from "axios"

interface ApiErrorBody {
  message?: string | string[]
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiErrorBody>
  const message = axiosError?.response?.data?.message

  if (typeof message === "string" && message.trim()) {
    return message
  }

  if (Array.isArray(message) && message.length > 0) {
    return message.join(" ")
  }

  if (axiosError?.code === "ERR_NETWORK") {
    return "Can't reach the server. Please check that the backend is running and try again."
  }

  return fallback
}
