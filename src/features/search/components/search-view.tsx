"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { useSearchFilters } from "@/features/search/hooks/use-search-filters";
import { FilterPanel } from "@/features/search/components/filter-panel";
import { FilterSheet } from "@/features/search/components/filter-sheet";
import { SortSelect } from "@/features/search/components/sort-select";
import { SearchResults } from "@/features/search/components/search-results";
import { ActiveFilterChips } from "@/features/search/components/active-filter-chips";

export function SearchView() {
  const { filters, query, activeCount, setFilters, resetFilters } =
    useSearchFilters();
  const { data, isPending, isError, refetch } = useCoffeeShops(query);
  const [sheetOpen, setSheetOpen] = useState(false);

  const shops = data?.items ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="mb-6 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
          {filters.search
            ? `Hasil untuk "${filters.search}"`
            : "Jelajah coffee shop"}
        </h1>
        <SearchBar defaultValue={filters.search} className="shadow-none" />
        <ActiveFilterChips filters={filters} onChange={setFilters} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <p className="text-sm text-muted-foreground">
          {isPending ? "Memuat..." : `${total} coffee shop ditemukan`}
        </p>
        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={resetFilters}
              className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted md:inline-flex"
            >
              <X className="size-3" aria-hidden="true" />
              Reset
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted md:hidden"
            aria-label="Buka filter"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filter
            {activeCount > 0 ? (
              <span className="rounded-full bg-accent px-1.5 text-xs text-accent-foreground">
                {activeCount}
              </span>
            ) : null}
          </button>
          <SortSelect
            value={filters.sort}
            onChange={(sort) => setFilters({ sort })}
          />
        </div>
      </div>

      <div className="flex gap-8 pt-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-20 rounded-card border border-border bg-surface p-5">
            <FilterPanel
              filters={filters}
              activeCount={activeCount}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <SearchResults
            shops={shops}
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            onReset={resetFilters}
          />
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        activeCount={activeCount}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={total}
      />
    </div>
  );
}