import { Coffee } from "lucide-react";
import type { CoffeeShopDetail } from "@/features/coffee-shop/types/coffee-shop.types";

interface DetailGalleryProps {
  shop: CoffeeShopDetail;
}

export function DetailGallery({ shop }: DetailGalleryProps) {
  const images = shop.gallery.length > 0 ? shop.gallery : [];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-card border border-border bg-muted text-muted-foreground md:aspect-[21/9]">
        <Coffee className="size-12" aria-hidden="true" />
        <span className="sr-only">Galeri {shop.name} belum tersedia</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-card">
      {images.slice(0, 5).map((src, index) => (
        <div
          key={src}
          className={
            index === 0
              ? "col-span-2 row-span-2 aspect-square sm:aspect-auto"
              : "aspect-square"
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${shop.name} foto ${index + 1}`}
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}