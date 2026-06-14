"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useEvent } from "@/features/event/queries/event-queries";

interface EventDetailClientProps {
  slug: string;
}

export function EventDetailClient({ slug }: EventDetailClientProps) {
  const { data, isPending, isError, error } = useEvent(slug);

  if (isError) {
    if (error && (error as { status?: number }).status === 404) {
      notFound();
    }
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat event.</p>
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-60 animate-pulse rounded bg-muted" />
        <div className="h-40 w-full animate-pulse rounded-card bg-muted" />
      </div>
    );
  }

  const startFmt = new Date(data.startDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endFmt = new Date(data.endDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const period = data.startDate === data.endDate ? startFmt : `${startFmt} - ${endFmt}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Semua event
        </Link>
      </div>

      <article className="rounded-card border border-border bg-surface p-6 space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-h2">
          {data.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" aria-hidden="true" />
            {period}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" aria-hidden="true" />
            {data.cityName ?? "-"}
            {data.coffeeShopName ? ` · ${data.coffeeShopName}` : ""}
          </span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {data.description}
        </p>
      </article>
    </div>
  );
}