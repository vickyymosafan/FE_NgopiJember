"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  listFavoriteIds,
  removeFavorite,
} from "@/features/favorite/services/favorite.service";
import { useAuth } from "@/providers/auth-provider";

const FAVORITES_KEY = ["favorites"] as const;

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: listFavoriteIds,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}

export function useIsFavorite(coffeeShopId: string) {
  const { data, isLoading } = useFavorites();
  const ids = data ?? [];
  return {
    isFavorite: ids.includes(coffeeShopId),
    isLoading,
  };
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      coffeeShopId,
      add,
    }: {
      coffeeShopId: string;
      add: boolean;
    }) => (add ? addFavorite(coffeeShopId) : removeFavorite(coffeeShopId)),
    onMutate: async ({ coffeeShopId, add }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<string[]>(FAVORITES_KEY);
      const ids = previous ?? [];
      const next = add
        ? ids.includes(coffeeShopId)
          ? ids
          : [...ids, coffeeShopId]
        : ids.filter((id) => id !== coffeeShopId);
      queryClient.setQueryData<string[]>(FAVORITES_KEY, next);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITES_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}