import { ApiError } from "@/types/api";

const FAV_BASE = "/api/favorites";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${FAV_BASE}${path}`, {
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

export async function listFavoriteIds(): Promise<string[]> {
  return call<string[]>("");
}

export async function addFavorite(coffeeShopId: string): Promise<string> {
  return call<string>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coffeeShopId }),
  });
}

export async function removeFavorite(coffeeShopId: string): Promise<string> {
  return call<string>(`?coffeeShopId=${encodeURIComponent(coffeeShopId)}`, {
    method: "DELETE",
  });
}

export const favoriteService = {
  listFavoriteIds,
  addFavorite,
  removeFavorite,
};