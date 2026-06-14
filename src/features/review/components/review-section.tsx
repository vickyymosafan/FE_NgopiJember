"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useReviews } from "@/features/review/queries/review-queries";
import { ReviewForm } from "@/features/review/components/review-form";
import { ReviewList } from "@/features/review/components/review-list";

interface ReviewSectionProps {
  coffeeShopId: string;
  coffeeShopName: string;
}

export function ReviewSection({
  coffeeShopId,
  coffeeShopName,
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { data, isPending, isError, refetch } = useReviews(coffeeShopId);

  const hasOwnReview = useMemo(() => {
    if (!user || !data) return false;
    return data.some((review) => review.author.id === user.id);
  }, [data, user]);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-h4">
        Ulasan pengunjung
      </h2>

      {isAuthenticated ? (
        hasOwnReview ? (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            Anda sudah memberi ulasan untuk {coffeeShopName}.
          </p>
        ) : (
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="mb-3 font-medium text-foreground">
              Tulis ulasan Anda
            </h3>
            <ReviewForm
              coffeeShopId={coffeeShopId}
              onSuccess={() => refetch()}
            />
          </div>
        )
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Masuk untuk memberi ulasan.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/coffee-shops/${coffeeShopId}`)}`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Masuk
          </Link>
        </div>
      )}

      <ReviewList
        reviews={data ?? []}
        isPending={isPending}
        isError={isError}
        onRetry={() => refetch()}
      />
    </section>
  );
}