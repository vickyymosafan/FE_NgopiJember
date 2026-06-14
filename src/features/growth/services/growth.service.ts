import { ApiError } from "@/types/api";
import type {
  PopularSearch,
  SearchAnalytics,
  SearchLog,
} from "@/features/growth/types/growth.types";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T }
    | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Permintaan gagal.",
      response.status,
    );
  }
  return (payload?.data ?? payload) as T;
}

export async function logSearch(term: string): Promise<SearchLog> {
  return call<SearchLog>("/api/search-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ term }),
  });
}

export async function getPopularSearches(
  limit = 6,
): Promise<PopularSearch[]> {
  return call<PopularSearch[]>(`/api/popular-searches?limit=${limit}`);
}

export async function getSearchAnalytics(): Promise<SearchAnalytics> {
  return call<SearchAnalytics>("/api/admin/analytics/searches");
}

export const growthService = {
  logSearch,
  getPopularSearches,
  getSearchAnalytics,
};