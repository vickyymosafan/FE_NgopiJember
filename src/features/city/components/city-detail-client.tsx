"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useCity } from "@/features/city/queries/city-queries";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import {
  CoffeeShopCard,
  CoffeeShopCardSkeleton,
} from "@/features/coffee-shop/components/coffee-shop-card";
import { useEvents } from "@/features/event/queries/event-queries";
import { useCommunities } from "@/features/community/queries/community-queries";
import { EventCard } from "@/features/event/components/event-card";
import { CommunityCard } from "@/features/community/components/community-card";

interface CityDetailClientProps {
  slug: string;
}

export function CityDetailClient({ slug }: CityDetailClientProps) {
  const { data: city, isPending, isError, error } = useCity(slug);
  const shopsQuery = useCoffeeShops({ cityId: city?.id, limit: 200 });
  const eventsQuery = useEvents(city?.id);
  const communitiesQuery = useCommunities(city?.id);

  if (isError) {
    if (error && (error as { status?: number }).status === 404) {
      notFound();
    }
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat detail kota.</p>
      </div>
    );
  }

  if (isPending || !city) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        <div className="h-20 w-full animate-pulse rounded-card bg-muted" />
      </div>
    );
  }

  const shops = shopsQuery.data?.items ?? [];
  const events = eventsQuery.data ?? [];
  const communities = communitiesQuery.data ?? [];

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/cities"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Semua kota
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-h2">
          {city.name}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{city.description}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
          Coffee shop di {city.name}
        </h2>
        {shopsQuery.isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CoffeeShopCardSkeleton key={index} />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <p className="rounded-card border border-border bg-surface px-6 py-12 text-center text-sm text-muted-foreground">
            Belum ada coffee shop terdaftar di kota ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <CoffeeShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
          Event mendatang
        </h2>
        {eventsQuery.isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-32 w-full animate-pulse rounded-card bg-muted"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="rounded-card border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
            Belum ada event terjadwal.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
          Komunitas kopi
        </h2>
        {communitiesQuery.isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-32 w-full animate-pulse rounded-card bg-muted"
              />
            ))}
          </div>
        ) : communities.length === 0 ? (
          <p className="rounded-card border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
            Belum ada komunitas terdaftar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}