"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMapCoffeeShops } from "@/features/coffee-shop/services/coffee-shop.service";
import { coffeeShopKeys } from "@/features/coffee-shop/queries/query-keys";
import type { CoffeeShopQuery } from "@/features/coffee-shop/types/coffee-shop.types";

export function useMapCoffeeShops(params: CoffeeShopQuery) {
  return useQuery({
    queryKey: coffeeShopKeys.map(params),
    queryFn: () => getMapCoffeeShops(params),
    placeholderData: keepPreviousData,
  });
}