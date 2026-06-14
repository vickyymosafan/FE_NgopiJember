"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoffeeShop,
  deleteCoffeeShop,
  listCoffeeShops,
  updateCoffeeShop,
} from "@/features/admin/services/admin.service";
import type {
  CoffeeShopCreatePayload,
  CoffeeShopUpdatePayload,
} from "@/features/admin/types/admin.types";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const ADMIN_COFFEE_SHOPS_KEY = ["admin", "coffee-shops"] as const;

export function useAdminCoffeeShops() {
  return useQuery({
    queryKey: ADMIN_COFFEE_SHOPS_KEY,
    queryFn: listCoffeeShops,
    staleTime: 1000 * 60,
  });
}

export function useAdminCreateCoffeeShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CoffeeShopCreatePayload) => createCoffeeShop(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_COFFEE_SHOPS_KEY });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}

export function useAdminUpdateCoffeeShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CoffeeShopUpdatePayload;
    }) => updateCoffeeShop(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_COFFEE_SHOPS_KEY });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}

export function useAdminDeleteCoffeeShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoffeeShop(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_COFFEE_SHOPS_KEY });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}

export function useAdminFindCoffeeShop(id: string | null) {
  const listQuery = useAdminCoffeeShops();
  const shop: CoffeeShop | undefined = id
    ? listQuery.data?.find((item) => item.id === id)
    : undefined;
  return { ...listQuery, shop };
}