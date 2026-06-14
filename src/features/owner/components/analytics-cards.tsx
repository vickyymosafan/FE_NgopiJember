"use client";

import { AlertCircle, Eye, MessageCircle, Star, Store } from "lucide-react";
import { useOwnerAnalytics } from "@/features/owner/queries/owner-queries";

const STAT_ITEMS = [
  { key: "coffeeShopCount", label: "Coffee Shop", icon: Store, format: (v: number) => String(v) },
  { key: "totalReviews", label: "Total Ulasan", icon: MessageCircle, format: (v: number) => String(v) },
  { key: "averageRating", label: "Rating Rata-rata", icon: Star, format: (v: number) => v.toFixed(2) },
  { key: "totalViews", label: "Total Views", icon: Eye, format: (v: number) => v.toLocaleString("id-ID") },
];

export function AnalyticsCards() {
  const { data, isPending, isError } = useOwnerAnalytics();

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-border bg-surface px-5 py-4 text-sm text-danger">
        <AlertCircle className="size-5" aria-hidden="true" />
        Gagal memuat analitik.
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = data[item.key as keyof typeof data] as number;
        return (
          <div
            key={item.key}
            className="rounded-card border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {item.format(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}