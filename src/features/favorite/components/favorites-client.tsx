"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { useFavorites } from "@/features/favorite/queries/favorite-queries";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";

export function FavoritesClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const favQuery = useFavorites();
  const listQuery = useCoffeeShops({ limit: 200 });

  if (authLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CoffeeShopCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Heart className="size-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">
          Masuk untuk melihat favorit
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Simpan coffee shop favoritmu dan akses kapan saja dari akun Anda.
        </p>
        <Link
          href="/login?next=/favorites"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Masuk
        </Link>
      </div>
    );
  }

  if (favQuery.isError || listQuery.isError) {
    return (
      <div className="rounded-card border border-border bg-surface px-6 py-12 text-center text-sm text-danger">
        Gagal memuat favorit. Coba muat ulang halaman.
      </div>
    );
  }

  if (favQuery.isPending || listQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CoffeeShopCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const favIds = new Set(favQuery.data ?? []);
  const shops = (listQuery.data?.items ?? []).filter((shop) =>
    favIds.has(shop.id),
  );

  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <Heart className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          Anda belum menyimpan coffee shop apa pun.
        </p>
        <Link
          href="/search"
          className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Jelajahi coffee shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {shops.map((shop) => (
        <CoffeeShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}