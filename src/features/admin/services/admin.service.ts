import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";
import type {
  CoffeeShopCreatePayload,
  CoffeeShopUpdatePayload,
} from "@/features/admin/types/admin.types";
import { ApiError } from "@/types/api";

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
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

export async function listCoffeeShops(): Promise<CoffeeShop[]> {
  return request<CoffeeShop[]>("/coffee-shops");
}

export async function createCoffeeShop(
  payload: CoffeeShopCreatePayload,
): Promise<CoffeeShop> {
  return request<CoffeeShop>("/coffee-shops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateCoffeeShop(
  id: string,
  payload: CoffeeShopUpdatePayload,
): Promise<CoffeeShop> {
  return request<CoffeeShop>(`/coffee-shops/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteCoffeeShop(id: string): Promise<void> {
  await request<{ message: string }>(`/coffee-shops/${id}`, {
    method: "DELETE",
  });
}

export const adminService = {
  listCoffeeShops,
  createCoffeeShop,
  updateCoffeeShop,
  deleteCoffeeShop,
};