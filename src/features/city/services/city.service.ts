import { ApiError } from "@/types/api";
import type { City } from "@/features/city/types/city.types";

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

export async function listCities(): Promise<City[]> {
  return call<City[]>("/api/cities");
}

export async function getCity(slug: string): Promise<City> {
  return call<City>(`/api/cities/${slug}`);
}

export const cityService = { listCities, getCity };