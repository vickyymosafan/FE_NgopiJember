"use client";

import { useMemo } from "react";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { recommendCoffeeShops } from "@/features/growth/lib/recommend";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

interface RecommendedCoffeeShopsProps {
  current: CoffeeShop;
}

export function RecommendedCoffeeShops({
  current,
}: RecommendedCoffeeShopsProps) {
  const { data, isPending, isError } = useCoffeeShops({ limit: 200 });

  const recommended = useMemo(() => {
    if (!data) return [];
    return recommendCoffeeShops({
      current,
      candidates: data.items,
      limit: 4,
    });
  }, [data, current]);

  if (isError) {
    return null;
  }

  if (isPending) {
    return (
      <section className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
          Rekomendasi untuk Anda
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CoffeeShopCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (recommended.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
        Rekomendasi untuk Anda
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recommended.map((shop) => (
          <CoffeeShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}