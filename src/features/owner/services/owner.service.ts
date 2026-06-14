import { ApiError } from "@/types/api";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";
import type {
  OwnerAnalytics,
  Promotion,
  PromotionPayload,
} from "@/features/owner/types/owner.types";

const COFFEE_BASE = "/api/owner/coffee-shops";
const PROMO_BASE = "/api/owner/promotions";
const ANALYTICS_BASE = "/api/owner/analytics";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
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

export async function listOwnerCoffeeShops(): Promise<CoffeeShop[]> {
  return call<CoffeeShop[]>(COFFEE_BASE);
}

export async function updateOwnerCoffeeShop(
  id: string,
  payload: Record<string, unknown>,
): Promise<CoffeeShop> {
  return call<CoffeeShop>(`${COFFEE_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function listOwnerPromotions(): Promise<Promotion[]> {
  return call<Promotion[]>(PROMO_BASE);
}

export async function createOwnerPromotion(
  payload: PromotionPayload,
): Promise<Promotion> {
  return call<Promotion>(PROMO_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateOwnerPromotion(
  id: string,
  payload: Partial<PromotionPayload>,
): Promise<Promotion> {
  return call<Promotion>(`${PROMO_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteOwnerPromotion(id: string): Promise<void> {
  await call<{ message: string }>(`${PROMO_BASE}/${id}`, {
    method: "DELETE",
  });
}

export async function getOwnerAnalytics(): Promise<OwnerAnalytics> {
  return call<OwnerAnalytics>(ANALYTICS_BASE);
}

export const ownerService = {
  listOwnerCoffeeShops,
  updateOwnerCoffeeShop,
  listOwnerPromotions,
  createOwnerPromotion,
  updateOwnerPromotion,
  deleteOwnerPromotion,
  getOwnerAnalytics,
};