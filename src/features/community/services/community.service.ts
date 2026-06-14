import { ApiError } from "@/types/api";
import type { CoffeeCommunity } from "@/features/community/types/community.types";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
  const text = await response.text();
  let payload: { success?: boolean; message?: string; data?: T } | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new ApiError(payload?.message ?? "Permintaan gagal.", response.status);
  }
  return (payload?.data ?? payload) as T;
}

export async function listCommunities(
  cityId?: string,
): Promise<CoffeeCommunity[]> {
  const qs = cityId ? `?cityId=${encodeURIComponent(cityId)}` : "";
  return call<CoffeeCommunity[]>(`/api/communities${qs}`);
}

export async function getCommunity(slug: string): Promise<CoffeeCommunity> {
  return call<CoffeeCommunity>(`/api/communities/${slug}`);
}

export const communityService = { listCommunities, getCommunity };