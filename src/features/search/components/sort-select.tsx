"use client";

import { SORT_OPTIONS } from "@/features/search/constants/filters";
import type { CoffeeShopSort } from "@/features/coffee-shop/types/coffee-shop.types";

interface SortSelectProps {
  value: CoffeeShopSort;
  onChange: (value: CoffeeShopSort) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">Urutkan</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CoffeeShopSort)}
        className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}