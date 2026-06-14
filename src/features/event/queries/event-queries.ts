"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvent, listEvents } from "@/features/event/services/event.service";

export const eventKeys = {
  all: ["events"] as const,
  list: (cityId?: string) => [...eventKeys.all, "list", cityId ?? "all"] as const,
  detail: (slug: string) => [...eventKeys.all, "detail", slug] as const,
};

export function useEvents(cityId?: string) {
  return useQuery({
    queryKey: eventKeys.list(cityId),
    queryFn: () => listEvents(cityId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventKeys.detail(slug),
    queryFn: () => getEvent(slug),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
  });
}