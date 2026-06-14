"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { usePopularSearches } from "@/features/growth/queries/growth-queries";

interface PopularSearchesProps {
  limit?: number;
}

export function PopularSearches({ limit = 6 }: PopularSearchesProps) {
  const { data, isPending } = usePopularSearches(limit);

  if (isPending || !data || data.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">
          Pencarian populer
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <Link
            key={item.term}
            href={`/search?q=${encodeURIComponent(item.term)}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent"
          >
            {item.term}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}