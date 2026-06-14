"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCoffeeShops } from "@/features/coffee-shop/services/coffee-shop.service";
import { coffeeShopKeys } from "@/features/coffee-shop/queries/query-keys";
import type { CoffeeShopQuery } from "@/features/coffee-shop/types/coffee-shop.types";

export function useCoffeeShops(params: CoffeeShopQuery) {
  return useQuery({
    queryKey: coffeeShopKeys.list(params),
    queryFn: () => getCoffeeShops(params),
    placeholderData: keepPreviousData,
  });
}