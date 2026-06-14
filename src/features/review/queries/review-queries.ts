"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  listReviews,
} from "@/features/review/services/review.service";
import type { ReviewCreatePayload } from "@/features/review/types/review.types";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (coffeeShopId: string) =>
    ["reviews", "list", coffeeShopId] as const,
};

export function useReviews(coffeeShopId: string) {
  return useQuery({
    queryKey: reviewKeys.list(coffeeShopId),
    queryFn: () => listReviews(coffeeShopId),
    staleTime: 1000 * 60,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewCreatePayload) => createReview(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.coffeeShopId),
      });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}