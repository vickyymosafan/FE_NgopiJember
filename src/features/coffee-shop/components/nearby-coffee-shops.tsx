"use client";

import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import { useNearbyCoffeeShops } from "@/features/coffee-shop/queries/use-nearby-coffee-shops";

interface NearbyCoffeeShopsProps {
  slug: string;
}

export function NearbyCoffeeShops({ slug }: NearbyCoffeeShopsProps) {
  const { data, isPending, isError } = useNearbyCoffeeShops(slug);

  if (isError) {
    return null;
  }

  if (!isPending && (!data || data.length === 0)) {
    return null;
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
        Coffee shop terdekat
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, index) => (
              <CoffeeShopCardSkeleton key={index} />
            ))
          : data.map((shop) => <CoffeeShopCard key={shop.id} shop={shop} />)}
      </div>
    </section>
  );
}