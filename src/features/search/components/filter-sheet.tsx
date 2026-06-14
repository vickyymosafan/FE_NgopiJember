"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
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
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filter pencarian"
      footer={
        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={onReset}
              className="h-11 rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
            >
              Reset
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-full bg-accent text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Lihat {resultCount} hasil
          </button>
        </div>
      }
    >
      <FilterPanel
        filters={filters}
        activeCount={activeCount}
        onChange={onChange}
        onReset={onReset}
      />
    </BottomSheet>
  );
}