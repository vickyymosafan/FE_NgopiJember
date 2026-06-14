"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorite/queries/favorite-queries";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";

export function ProfileMyFavorites() {
  const favQuery = useFavorites();
  const listQuery = useCoffeeShops({ limit: 200 });

  if (favQuery.isPending || listQuery.isPending) {
    return (
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Favorit saya</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CoffeeShopCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (favQuery.isError || listQuery.isError) {
    return (
      <section className="rounded-card border border-border bg-surface px-6 py-8 text-center text-sm text-danger">
        Gagal memuat favorit.
      </section>
    );
  }

  const favIds = new Set(favQuery.data ?? []);
  const shops = (listQuery.data?.items ?? []).filter((shop) =>
    favIds.has(shop.id),
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Favorit saya</h3>
        <Link
          href="/favorites"
          className="text-sm font-medium text-accent hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
          <Heart className="size-6" aria-hidden="true" />
          Belum ada coffee shop favorit.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
}