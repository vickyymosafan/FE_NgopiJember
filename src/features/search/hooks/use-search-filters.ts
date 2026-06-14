"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CoffeeShopQuery,
  CoffeeShopSort,
} from "@/features/coffee-shop/types/coffee-shop.types";

const SORT_VALUES: CoffeeShopSort[] = [
  "trending",
  "rating",
  "reviews",
  "newest",
];

function parseSort(value: string | null): CoffeeShopSort {
  return SORT_VALUES.includes(value as CoffeeShopSort)
    ? (value as CoffeeShopSort)
    : "trending";
}

function parseNumber(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export interface SearchFilters {
  search: string;
  cityId?: string;
  district?: string;
  rating?: number;
  facility?: string;
  priceRange?: number;
  openNow: boolean;
  sort: CoffeeShopSort;
}

export type FilterPatch = Partial<{
  cityId: string;
  search: string;
  district: string;
  rating: number;
  facility: string;
  priceRange: number;
  openNow: boolean;
  sort: CoffeeShopSort;
}>;

export function useSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<SearchFilters>(() => {
    return {
      search: searchParams.get("q") ?? "",
      cityId: searchParams.get("cityId") ?? undefined,
      district: searchParams.get("district") ?? undefined,
      rating: parseNumber(searchParams.get("rating")),
      facility: searchParams.get("facility") ?? undefined,
      priceRange: parseNumber(searchParams.get("priceRange")),
      openNow: searchParams.get("openNow") === "true",
      sort: parseSort(searchParams.get("sort")),
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (patch: FilterPatch) => {
      const params = new URLSearchParams(searchParams.toString());
      const apply = (key: string, value: string | number | boolean | undefined) => {
        if (value === undefined || value === "" || value === false) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      };

      if ("search" in patch) apply("q", patch.search);
      if ("cityId" in patch) apply("cityId", patch.cityId);
    if ("district" in patch) apply("district", patch.district);
      if ("rating" in patch) apply("rating", patch.rating);
      if ("facility" in patch) apply("facility", patch.facility);
      if ("priceRange" in patch) apply("priceRange", patch.priceRange);
      if ("openNow" in patch) apply("openNow", patch.openNow);
      if ("sort" in patch) apply("sort", patch.sort);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) {
      params.set("q", filters.search);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [filters.search, pathname, router]);

  const query = useMemo<CoffeeShopQuery>(
    () => ({
      search: filters.search || undefined,
      cityId: filters.cityId,
      district: filters.district,
      rating: filters.rating,
      facility: filters.facility,
      priceRange: filters.priceRange,
      openNow: filters.openNow || undefined,
      sort: filters.sort,
    }),
    [filters],
  );

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.cityId) count += 1;
    if (filters.district) count += 1;
    if (filters.rating) count += 1;
    if (filters.facility) count += 1;
    if (filters.priceRange) count += 1;
    if (filters.openNow) count += 1;
    return count;
  }, [filters]);

  return { filters, query, activeCount, setFilters, resetFilters };
}