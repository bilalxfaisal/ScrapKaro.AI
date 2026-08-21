import axios, { type InternalAxiosRequestConfig } from "axios";
import { supabase } from "./supabase";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();

  console.log("REQUEST:", config.method?.toUpperCase(), config.url);
  console.log("SESSION:", data.session);
  console.log("SESSION ERROR:", error);
  console.log("TOKEN EXISTS:", !!data.session?.access_token);

  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshed.session) {
          original.headers.Authorization = `Bearer ${refreshed.session.access_token}`;
          return api(original);
        }
      }

      await supabase.auth.signOut();
    }

    return Promise.reject(error);
  },
);
