"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPopularSearches,
  getSearchAnalytics,
  logSearch,
} from "@/features/growth/services/growth.service";

export const growthKeys = {
  popular: (limit: number) => ["growth", "popular", limit] as const,
  analytics: ["growth", "analytics", "searches"] as const,
};

export function usePopularSearches(limit = 6) {
  return useQuery({
    queryKey: growthKeys.popular(limit),
    queryFn: () => getPopularSearches(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchAnalytics() {
  return useQuery({
    queryKey: growthKeys.analytics,
    queryFn: getSearchAnalytics,
    staleTime: 1000 * 60,
  });
}

export function useLogSearch() {
  return useMutation({
    mutationFn: (term: string) => logSearch(term),
  });
}