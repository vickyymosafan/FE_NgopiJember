"use client";

import { AlertCircle } from "lucide-react";
import { useCities } from "@/features/city/queries/city-queries";
import { CityCard } from "@/features/city/components/city-card";

export function CitiesClient() {
  const { data, isPending, isError, refetch } = useCities();

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat daftar kota.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 w-full animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="rounded-card border border-border bg-surface px-6 py-12 text-center text-muted-foreground">
        Belum ada kota yang tersedia.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((city) => (
        <CityCard key={city.id} city={city} />
      ))}
    </div>
  );
}