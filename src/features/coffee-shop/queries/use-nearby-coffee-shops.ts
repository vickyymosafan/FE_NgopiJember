"use client";

import { useQuery } from "@tanstack/react-query";
import { getNearbyCoffeeShops } from "@/features/coffee-shop/services/coffee-shop.service";
import { coffeeShopKeys } from "@/features/coffee-shop/queries/query-keys";

export function useNearbyCoffeeShops(slug: string, limit = 4) {
  return useQuery({
    queryKey: coffeeShopKeys.nearby(slug, limit),
    queryFn: () => getNearbyCoffeeShops(slug, limit),
  });
}