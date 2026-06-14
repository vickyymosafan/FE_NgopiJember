import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { CoffeeEvent } from "@/features/event/types/event.types";

interface EventCardProps {
  event: CoffeeEvent;
}

function formatDateRange(start: string, end: string) {
  const startFmt = new Date(start).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (start === end) return startFmt;
  const endFmt = new Date(end).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startFmt} - ${endFmt}`;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="size-3" aria-hidden="true" />
        {formatDateRange(event.startDate, event.endDate)}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {event.description}
      </p>
      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="size-3" aria-hidden="true" />
        <span>{event.cityName ?? "-"}</span>
        {event.coffeeShopName ? (
          <>
            <span>·</span>
            <span>{event.coffeeShopName}</span>
          </>
        ) : null}
      </div>
    </Link>
  );
}