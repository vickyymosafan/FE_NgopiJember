"use client";

import { AlertCircle } from "lucide-react";
import { useEvents } from "@/features/event/queries/event-queries";
import { EventCard } from "@/features/event/components/event-card";

export function EventsClient() {
  const { data, isPending, isError, refetch } = useEvents();

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat event.</p>
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 w-full animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="rounded-card border border-border bg-surface px-6 py-12 text-center text-muted-foreground">
        Belum ada event terjadwal.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {data.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}