import { ApiError } from "@/types/api";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { Review } from "@/features/review/types/review.types";

const BASE = "/api/profile";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "same-origin",
  });
  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T }
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
    );
  }
  return (payload?.data ?? payload) as T;
}

export async function getProfile(): Promise<AuthUser> {
  return call<AuthUser>("");
}

export async function updateProfile(payload: {
  name: string;
  avatarUrl?: string | null;
}): Promise<AuthUser> {
  return call<AuthUser>("", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getMyReviews(): Promise<Review[]> {
  return call<Review[]>("/reviews");
}

export const profileService = {
  getProfile,
  updateProfile,
  getMyReviews,
};