"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, MapPin } from "lucide-react";
import { useMapCoffeeShops } from "@/features/coffee-shop/queries/use-map-coffee-shops";
import { useSearchFilters } from "@/features/search/hooks/use-search-filters";
import { SearchBar } from "@/components/shared/search-bar";
import { MapListItem } from "@/features/map/components/map-list-item";

const MapCanvas = dynamic(
  () => import("@/features/map/components/map-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center bg-muted">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 animate-pulse" aria-hidden="true" />
          Memuat peta...
        </span>
      </div>
    ),
  },
);

export function MapView() {
  const { filters, query } = useSearchFilters();
  const { data, isPending, isError, refetch } = useMapCoffeeShops(query);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const shops = data ?? [];

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col md:h-[calc(100dvh-4rem)]">
      <div className="flex flex-1 flex-col-reverse overflow-hidden md:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-t border-border bg-background md:h-full md:w-80 md:border-r md:border-t-0">
          <div className="space-y-3 border-b border-border p-4">
            <SearchBar defaultValue={filters.search} className="shadow-none" />
            <p className="text-sm text-muted-foreground">
              {isPending
                ? "Memuat lokasi..."
                : `${shops.length} coffee shop di peta`}
            </p>
          </div>

          <div className="max-h-64 flex-1 space-y-2 overflow-y-auto p-4 md:max-h-none">
            {isError ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center">
                <AlertCircle className="size-6 text-danger" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Gagal memuat lokasi.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Coba lagi
                </button>
              </div>
            ) : isPending ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 w-full animate-pulse rounded-xl bg-muted"
                />
              ))
            ) : shops.length === 0 ? (
              <p className="rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
                Tidak ada coffee shop yang cocok.
              </p>
            ) : (
              shops.map((shop) => (
                <MapListItem
                  key={shop.id}
                  shop={shop}
                  active={shop.slug === selectedSlug}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </aside>

        <div className="relative h-64 flex-1 md:h-full">
          <MapCanvas
            shops={shops}
            selectedSlug={selectedSlug}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}