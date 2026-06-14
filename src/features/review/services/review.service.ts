import { ApiError } from "@/types/api";
import type {
  Review,
  ReviewCreatePayload,
} from "@/features/review/types/review.types";

const REV_BASE = "/api/reviews";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${REV_BASE}${path}`, {
    ...init,
    credentials: "same-origin",
  });
  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T; errors?: string[] }
    | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Permintaan gagal.",
      response.status,
      payload?.errors ?? [],
    );
  }
  return (payload?.data ?? payload) as T;
}

export async function listReviews(coffeeShopId: string): Promise<Review[]> {
  return call<Review[]>(`?coffeeShopId=${encodeURIComponent(coffeeShopId)}`);
}

export async function createReview(
  payload: ReviewCreatePayload,
): Promise<Review> {
  return call<Review>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export const reviewService = {
  listReviews,
  createReview,
};