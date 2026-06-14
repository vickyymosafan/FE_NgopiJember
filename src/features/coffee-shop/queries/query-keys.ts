import type { CoffeeShopQuery } from "@/features/coffee-shop/types/coffee-shop.types";

export const coffeeShopKeys = {
  all: ["coffee-shops"] as const,
  trending: (limit: number) =>
    [...coffeeShopKeys.all, "trending", limit] as const,
  list: (params: CoffeeShopQuery) =>
    [...coffeeShopKeys.all, "list", params] as const,
  detail: (slug: string) => [...coffeeShopKeys.all, "detail", slug] as const,
  nearby: (slug: string, limit: number) =>
    [...coffeeShopKeys.all, "nearby", slug, limit] as const,
  map: (params: CoffeeShopQuery) =>
    [...coffeeShopKeys.all, "map", params] as const,
};