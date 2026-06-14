"use client";

import { useQuery } from "@tanstack/react-query";
import { getCity, listCities } from "@/features/city/services/city.service";

export const cityKeys = {
  all: ["cities"] as const,
  list: () => [...cityKeys.all, "list"] as const,
  detail: (slug: string) => [...cityKeys.all, "detail", slug] as const,
};

export function useCities() {
  return useQuery({
    queryKey: cityKeys.list(),
    queryFn: listCities,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCity(slug: string) {
  return useQuery({
    queryKey: cityKeys.detail(slug),
    queryFn: () => getCity(slug),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(slug),
  });
}