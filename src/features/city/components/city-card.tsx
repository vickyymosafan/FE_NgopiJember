import Link from "next/link";
import { MapPin } from "lucide-react";
import type { City } from "@/features/city/types/city.types";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{city.name}</h3>
          <p className="text-xs text-muted-foreground">
            <MapPin className="inline size-3" aria-hidden="true" /> {city.province}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{city.description}</p>
      <span className="mt-auto text-sm font-medium text-accent">
        {city.coffeeShopCount > 0
          ? `${city.coffeeShopCount} coffee shop`
          : "Segera hadir"}
      </span>
    </Link>
  );
}