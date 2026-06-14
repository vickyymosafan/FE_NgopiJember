"use client";

import { useMyReviews } from "@/features/profile/queries/profile-queries";
import { useCoffeeShops } from "@/features/coffee-shop/queries/use-coffee-shops";
import { ReviewList } from "@/features/review/components/review-list";
import Link from "next/link";

export function ProfileMyReviews() {
  const { data: reviews, isPending, isError, refetch } = useMyReviews();
  const shopsQuery = useCoffeeShops({ limit: 200 });

  const shopMap = new Map(
    (shopsQuery.data?.items ?? []).map((shop) => [shop.id, shop]),
  );

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Ulasan saya</h3>
      <ReviewList
        reviews={reviews ?? []}
        isPending={isPending}
        isError={isError}
        onRetry={() => refetch()}
      />
      {!isPending && reviews && reviews.length > 0 ? (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {reviews.map((review) => {
            const shop = shopMap.get(review.coffeeShopId);
            return shop ? (
              <li key={review.id}>
                <Link
                  href={`/coffee-shops/${shop.slug}`}
                  className="font-medium text-accent hover:underline"
                >
                  {shop.name}
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      ) : null}
    </section>
  );
}