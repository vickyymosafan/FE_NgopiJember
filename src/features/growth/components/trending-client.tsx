"use client";

import { TrendingUp } from "lucide-react";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { PopularSearches } from "@/features/growth/components/popular-searches";

const TRENDING_LIMIT = 12;

export function TrendingClient() {
  const { data, isPending, isError, refetch } = useCoffeeShops({
    sort: "trending",
    limit: TRENDING_LIMIT,
  });

  return (
    <div className="space-y-10">
      <PopularSearches limit={8} />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">
            Coffee shop trending
          </h2>
        </div>

        {isError ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Gagal memuat trending.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Muat ulang
            </button>
          </div>
        ) : isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: TRENDING_LIMIT }).map((_, index) => (
              <CoffeeShopCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.items ?? []).map((shop) => (
              <CoffeeShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}