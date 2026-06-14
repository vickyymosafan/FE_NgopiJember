"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { FilterPanel } from "@/features/search/components/filter-panel";
import type {
  FilterPatch,
  SearchFilters,
} from "@/features/search/hooks/use-search-filters";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  activeCount: number;
  onChange: (patch: FilterPatch) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterSheet({
  open,
  onClose,
  filters,
  activeCount,
  onChange,
  onReset,
  resultCount,
}: FilterSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filter pencarian">
      <button
        type="button"
        aria-label="Tutup filter"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filter</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <FilterPanel
          filters={filters}
          activeCount={activeCount}
          onChange={onChange}
          onReset={onReset}
        />

        <div className="sticky bottom-0 -mx-5 mt-5 border-t border-border bg-background p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Lihat {resultCount} hasil
          </button>
        </div>
      </div>
    </div>
  );
}