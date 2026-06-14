"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";
import { FavoriteButton } from "@/features/favorite/components/favorite-button";

interface CoffeeShopCardProps {
  shop: CoffeeShop;
}

export function CoffeeShopCard({ shop }: CoffeeShopCardProps) {
  const openLabel = shop.isOpen24Hours ? "Buka 24 Jam" : "Buka";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface text-surface-foreground shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/coffee-shops/${shop.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted"
      >
        {shop.imageUrl ? (
          <Image
            src={shop.imageUrl}
            alt={`Foto ${shop.name} di ${shop.address}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Coffee className="size-10" aria-hidden="true" />
          </span>
        )}
        <span className="absolute left-3 top-3">
          <Badge variant="success">{openLabel}</Badge>
        </span>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton coffeeShopId={shop.id} coffeeShopName={shop.name} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-foreground">
            <Link href={`/coffee-shops/${shop.slug}`}>{shop.name}</Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            {shop.rating.toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{shop.address}</span>
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {shop.facilities.slice(0, 3).map((facility) => (
            <Badge key={facility.id}>{facility.name}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{shop.priceLabel}</span>
          <span>{shop.reviewCount.toLocaleString("id-ID")} ulasan</span>
        </div>
      </div>
    </article>
  );
}

export function CoffeeShopCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-surface">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}