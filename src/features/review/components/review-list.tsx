import { AlertCircle, MessageCircle } from "lucide-react";
import type { Review } from "@/features/review/types/review.types";
import { RatingStars } from "@/features/review/components/rating-input";

interface ReviewListProps {
  reviews: Review[];
  isPending: boolean;
  isError: boolean;
  onRetry?: () => void;
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hari ini";
  if (days === 1) return "kemarin";
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  return `${Math.floor(months / 12)} tahun lalu`;
}

export function ReviewList({
  reviews,
  isPending,
  isError,
  onRetry,
}: ReviewListProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Gagal memuat ulasan.</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Muat ulang
          </button>
        ) : null}
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 w-full animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
        <MessageCircle className="size-6" aria-hidden="true" />
        Belum ada ulasan. Jadilah yang pertama.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-card border border-border bg-surface p-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
              {review.author.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">
                  {review.author.name}
                </span>
                <RatingStars value={review.rating} />
                <span className="text-xs text-muted-foreground">
                  {formatRelative(review.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {review.comment}
              </p>
              {review.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {review.images.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt="Foto ulasan"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}