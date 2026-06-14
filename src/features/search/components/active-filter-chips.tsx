"use client";

import { X } from "lucide-react";
import { FACILITY_OPTIONS } from "@/features/search/constants/filters";
import type {
  FilterPatch,
  SearchFilters,
} from "@/features/search/hooks/use-search-filters";

interface ActiveFilterChipsProps {
  filters: SearchFilters;
  onChange: (patch: FilterPatch) => void;
}

interface ChipItem {
  key: keyof FilterPatch;
  label: string;
  clear: FilterPatch;
}

const PRICE_LABEL: Record<number, string> = {
  1: "Rp1K - 25K",
  2: "Rp25K - 50K",
  3: "Rp50K - 100K",
  4: "Rp100K+",
};

export function ActiveFilterChips({
  filters,
  onChange,
}: ActiveFilterChipsProps) {
  const chips: ChipItem[] = [];

  if (filters.cityId) {
    chips.push({
      key: "cityId",
      label: `Kota terpilih`,
      clear: { cityId: undefined },
    });
  }
  if (filters.district) {
    chips.push({
      key: "district",
      label: filters.district,
      clear: { district: undefined },
    });
  }
  if (filters.rating) {
    chips.push({
      key: "rating",
      label: `Rating ${filters.rating}+`,
      clear: { rating: undefined },
    });
  }
  if (filters.priceRange) {
    chips.push({
      key: "priceRange",
      label: PRICE_LABEL[filters.priceRange] ?? `Harga ${filters.priceRange}`,
      clear: { priceRange: undefined },
    });
  }
  if (filters.facility) {
    const facility = FACILITY_OPTIONS.find((f) => f.id === filters.facility);
    chips.push({
      key: "facility",
      label: facility?.name ?? filters.facility,
      clear: { facility: undefined },
    });
  }
  if (filters.openNow) {
    chips.push({
      key: "openNow",
      label: "Buka 24 jam",
      clear: { openNow: false },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.clear)}
          aria-label={`Hapus filter ${chip.label}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {chip.label}
          <X className="size-3" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}