"use client";

import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

interface MapListItemProps {
  shop: CoffeeShop;
  active: boolean;
  onSelect: (slug: string) => void;
}

export function MapListItem({ shop, active, onSelect }: MapListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(shop.slug)}
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-accent bg-accent/5"
          : "border-border bg-surface hover:border-accent",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground">{shop.name}</span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
          <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
          {shop.rating.toFixed(1)}
        </span>
      </div>
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{shop.address}</span>
      </span>
      <span className="text-xs text-muted-foreground">
        {shop.isOpen24Hours ? "Buka 24 jam" : "Lihat jam buka"} &middot;{" "}
        {shop.priceLabel}
      </span>
    </button>
  );
}