import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import type { CoffeeShopDetail } from "@/features/coffee-shop/types/coffee-shop.types";

interface DetailMapProps {
  shop: CoffeeShopDetail;
}

export function DetailMap({ shop }: DetailMapProps) {
  const hasCoords = shop.latitude !== null && shop.longitude !== null;
  const directionsHref = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${shop.name} ${shop.address}`,
      )}`;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div
        className="relative flex min-h-[200px] items-center justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(192,132,87,0.18), transparent 50%)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:36px_36px]"
        />
        <span className="relative flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-sm text-muted-foreground">
          {hasCoords ? "Lokasi pada peta" : "Koordinat belum tersedia"}
        </p>
        <Link
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Navigation className="size-4" aria-hidden="true" />
          Petunjuk arah
        </Link>
      </div>
    </div>
  );
}