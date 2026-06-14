import { ApiError } from "@/types/api";
import type { CoffeeEvent } from "@/features/event/types/event.types";

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

export async function listEvents(cityId?: string): Promise<CoffeeEvent[]> {
  const qs = cityId ? `?cityId=${encodeURIComponent(cityId)}` : "";
  return call<CoffeeEvent[]>(`/api/events${qs}`);
}

export async function getEvent(slug: string): Promise<CoffeeEvent> {
  return call<CoffeeEvent>(`/api/events/${slug}`);
}

export const eventService = { listEvents, getEvent };