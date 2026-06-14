"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrendingCoffeeShops } from "@/features/coffee-shop/services/coffee-shop.service";
import { coffeeShopKeys } from "@/features/coffee-shop/queries/query-keys";

export function useTrendingCoffeeShops(limit = 8) {
  return useQuery({
    queryKey: coffeeShopKeys.trending(limit),
    queryFn: () => getTrendingCoffeeShops(limit),
  });
}
