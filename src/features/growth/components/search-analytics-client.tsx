"use client";

import { AlertCircle, Search, TrendingUp } from "lucide-react";
import { useSearchAnalytics } from "@/features/growth/queries/growth-queries";

export function SearchAnalyticsClient() {
  const { data, isPending, isError, refetch } = useSearchAnalytics();

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Gagal memuat analitik pencarian.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-card bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="size-4" aria-hidden="true" />
            Total Pencarian
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {data.totalSearches.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="size-4" aria-hidden="true" />
            Istilah Unik
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {data.uniqueTerms}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Pencarian populer
          </h2>
          {data.popularSearches.length === 0 ? (
            <p className="rounded-card border border-border bg-surface px-5 py-6 text-sm text-muted-foreground">
              Belum ada data pencarian populer.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.popularSearches.map((item) => (
                <li
                  key={item.term}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">
                    {item.term}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Pencarian terbaru
          </h2>
          {data.recentSearches.length === 0 ? (
            <p className="rounded-card border border-border bg-surface px-5 py-6 text-sm text-muted-foreground">
              Belum ada pencarian.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.recentSearches.map((item, index) => (
                <li
                  key={`${item.term}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-foreground">
                    {item.term}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("id-ID")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}