"use client";
import { ClaimButton } from "@/features/claim/components/claim-button";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, MapPin, AlertCircle, BadgeCheck } from "lucide-react";
import { ApiError } from "@/types/api";
import { useCoffeeShopDetail } from "@/features/coffee-shop/queries/use-coffee-shop-detail";
import { DetailGallery } from "@/features/coffee-shop/components/detail-gallery";
import { DetailInfoCard } from "@/features/coffee-shop/components/detail-info-card";
import { DetailMap } from "@/features/coffee-shop/components/detail-map";
import { FacilityList } from "@/features/coffee-shop/components/facility-list";
import { ReviewSection } from "@/features/review/components/review-section";
import { RecommendedCoffeeShops } from "@/features/growth/components/recommended-coffee-shops";
import { CoffeeShopDetailSkeleton } from "@/features/coffee-shop/components/detail-skeleton";

interface CoffeeShopDetailViewProps {
  slug: string;
}

export function CoffeeShopDetailView({ slug }: CoffeeShopDetailViewProps) {
  const { data: shop, isPending, isError, error, refetch } =
    useCoffeeShopDetail(slug);

  if (isPending) {
    return <CoffeeShopDetailSkeleton />;
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-20 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">
          Gagal memuat detail coffee shop. Coba lagi.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-[1280px] space-y-8 px-6 py-6">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke pencarian
      </Link>

      <DetailGallery shop={shop} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-h2">
                {shop.name}
              </h1>
              {shop.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  Terverifikasi
                </span>
              ) : null}
            </div>
            <ClaimButton coffeeShopId={shop.id} isVerified={shop.verified} />
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                {shop.rating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({shop.reviewCount.toLocaleString("id-ID")} ulasan)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" aria-hidden="true" />
                Kec. {shop.district}
              </span>
            </div>
          </header>

          {shop.description ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
                Tentang
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {shop.description}
              </p>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
              Fasilitas
            </h2>
            <FacilityList facilities={shop.facilities} />
          </section>

          <ReviewSection coffeeShopId={shop.id} coffeeShopName={shop.name} />

          <section className="space-y-3 lg:hidden">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
              Lokasi
            </h2>
            <DetailMap shop={shop} />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <DetailInfoCard shop={shop} />
          <div className="hidden lg:block">
            <DetailMap shop={shop} />
          </div>
        </aside>
      </div>

      <RecommendedCoffeeShops current={shop} />
    </article>
  );
}