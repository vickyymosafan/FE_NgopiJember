import Link from "next/link";
import { Clock, MapPin, Phone, Instagram, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoffeeShopDetail } from "@/features/coffee-shop/types/coffee-shop.types";
import {
  formatOpeningHours,
  isOpenNow,
} from "@/features/coffee-shop/lib/opening-hours";
import { FavoriteButton } from "@/features/favorite/components/favorite-button";

interface DetailInfoCardProps {
  shop: CoffeeShopDetail;
}

export function DetailInfoCard({ shop }: DetailInfoCardProps) {
  const open = isOpenNow(shop);

  return (
    <div className="space-y-5 rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-medium text-muted-foreground">Tersimpan?</p>
        <FavoriteButton coffeeShopId={shop.id} coffeeShopName={shop.name} />
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
            open ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              open ? "bg-success" : "bg-muted-foreground",
            )}
          />
          {open ? "Buka sekarang" : "Tutup"}
        </span>
      </div>

      <dl className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground">Jam buka</dt>
            <dd className="font-medium text-foreground">
              {formatOpeningHours(shop)}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground">Alamat</dt>
            <dd className="font-medium text-foreground">{shop.address}</dd>
            <dd className="text-muted-foreground">Kec. {shop.district}</dd>
          </div>
        </div>
        {shop.phone ? (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <dt className="text-muted-foreground">Telepon</dt>
              <dd className="font-medium text-foreground">{shop.phone}</dd>
            </div>
          </div>
        ) : null}
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground">
            Rp
          </span>
          <div>
            <dt className="text-muted-foreground">Kisaran harga</dt>
            <dd className="font-medium text-foreground">{shop.priceLabel}</dd>
          </div>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        {shop.instagram ? (
          <Link
            href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Instagram className="size-4" aria-hidden="true" />
            Instagram
          </Link>
        ) : null}
        {shop.website ? (
          <Link
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Globe className="size-4" aria-hidden="true" />
            Website
          </Link>
        ) : null}
      </div>
    </div>
  );
}