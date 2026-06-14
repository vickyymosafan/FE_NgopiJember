"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoffeeShopBySlug } from "@/features/coffee-shop/services/coffee-shop.service";
import { coffeeShopKeys } from "@/features/coffee-shop/queries/query-keys";
import { ApiError } from "@/types/api";

export function useCoffeeShopDetail(slug: string) {
  return useQuery({
    queryKey: coffeeShopKeys.detail(slug),
    queryFn: () => getCoffeeShopBySlug(slug),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
}