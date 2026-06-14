"use client";

import { AlertCircle } from "lucide-react";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import { useTrendingCoffeeShops } from "@/features/coffee-shop/queries/use-trending-coffee-shops";
import { SectionHeading } from "@/features/home/components/section-heading";

const TRENDING_LIMIT = 8;

export function TrendingSection() {
  const { data, isPending, isError, refetch } =
    useTrendingCoffeeShops(TRENDING_LIMIT);

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <SectionHeading
        title="Coffee shop trending"
        description="Paling banyak dikunjungi dan diulas minggu ini."
        actionLabel="Lihat semua"
        actionHref="/search?sort=trending"
      />

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
          <AlertCircle className="size-8 text-danger" aria-hidden="true" />
          <p className="text-muted-foreground">
            Gagal memuat coffee shop. Coba lagi.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Muat ulang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isPending
            ? Array.from({ length: TRENDING_LIMIT }).map((_, index) => (
                <CoffeeShopCardSkeleton key={index} />
              ))
            : data.map((shop) => (
                <CoffeeShopCard key={shop.id} shop={shop} />
              ))}
        </div>
      )}

      {!isPending && !isError && data.length === 0 ? (
        <p className="rounded-card border border-border bg-surface px-6 py-12 text-center text-muted-foreground">
          Belum ada coffee shop yang tersedia.
        </p>
      ) : null}
    </section>
  );
}
