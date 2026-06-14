"use client";

import { AlertCircle, SearchX } from "lucide-react";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

interface SearchResultsProps {
  shops: CoffeeShop[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onReset: () => void;
}

const SKELETON_COUNT = 6;

export function SearchResults({
  shops,
  isPending,
  isError,
  onRetry,
  onReset,
}: SearchResultsProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat hasil. Coba lagi.</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <CoffeeShopCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          Tidak ada coffee shop yang cocok dengan filter.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Reset filter
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {shops.map((shop) => (
        <CoffeeShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}