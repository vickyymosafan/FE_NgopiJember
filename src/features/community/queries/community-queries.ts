"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCommunity,
  listCommunities,
} from "@/features/community/services/community.service";

export const communityKeys = {
  all: ["communities"] as const,
  list: (cityId?: string) =>
    [...communityKeys.all, "list", cityId ?? "all"] as const,
  detail: (slug: string) => [...communityKeys.all, "detail", slug] as const,
};

export function useCommunities(cityId?: string) {
  return useQuery({
    queryKey: communityKeys.list(cityId),
    queryFn: () => listCommunities(cityId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: communityKeys.detail(slug),
    queryFn: () => getCommunity(slug),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
  });
}