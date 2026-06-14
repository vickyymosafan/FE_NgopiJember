import {
  Wifi,
  Plug,
  BookOpen,
  Armchair,
  Trees,
  Car,
  Users,
  Snowflake,
  Expand,
  Sparkles,
  ShoppingBag,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import type { Facility } from "@/features/coffee-shop/types/coffee-shop.types";

const ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  plug: Plug,
  "book-open": BookOpen,
  armchair: Armchair,
  trees: Trees,
  car: Car,
  users: Users,
  snowflake: Snowflake,
  expand: Expand,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
};

interface FacilityListProps {
  facilities: Facility[];
}

export function FacilityList({ facilities }: FacilityListProps) {
  if (facilities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Informasi fasilitas belum tersedia.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {facilities.map((facility) => {
        const Icon = ICONS[facility.icon] ?? Coffee;
        return (
          <li
            key={facility.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
          >
            <Icon className="size-4 text-accent" aria-hidden="true" />
            {facility.name}
          </li>
        );
      })}
    </ul>
  );
}