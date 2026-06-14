"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOwnerPromotion,
  deleteOwnerPromotion,
  getOwnerAnalytics,
  listOwnerCoffeeShops,
  listOwnerPromotions,
  updateOwnerCoffeeShop,
  updateOwnerPromotion,
} from "@/features/owner/services/owner.service";
import type { PromotionPayload } from "@/features/owner/types/owner.types";

export const ownerKeys = {
  coffeeShops: ["owner", "coffee-shops"] as const,
  promotions: ["owner", "promotions"] as const,
  analytics: ["owner", "analytics"] as const,
};

export function useOwnerCoffeeShops() {
  return useQuery({
    queryKey: ownerKeys.coffeeShops,
    queryFn: listOwnerCoffeeShops,
    staleTime: 1000 * 60,
  });
}

export function useOwnerPromotions() {
  return useQuery({
    queryKey: ownerKeys.promotions,
    queryFn: listOwnerPromotions,
    staleTime: 1000 * 60,
  });
}

export function useOwnerAnalytics() {
  return useQuery({
    queryKey: ownerKeys.analytics,
    queryFn: getOwnerAnalytics,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOwnerUpdateCoffeeShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => updateOwnerCoffeeShop(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerKeys.coffeeShops });
      void queryClient.invalidateQueries({ queryKey: ownerKeys.analytics });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}

export function useOwnerCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PromotionPayload) => createOwnerPromotion(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerKeys.promotions });
    },
  });
}

export function useOwnerUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PromotionPayload>;
    }) => updateOwnerPromotion(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerKeys.promotions });
    },
  });
}

export function useOwnerDeletePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOwnerPromotion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ownerKeys.promotions });
    },
  });
}