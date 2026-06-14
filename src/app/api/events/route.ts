import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_EVENTS } from "@/features/event/constants/mock-events";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeEvent } from "@/features/event/types/event.types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityId = url.searchParams.get("cityId");

  if (env.useMock) {
    const list = MOCK_EVENTS.filter(
      (event) => !cityId || event.cityId === cityId,
    )
      .map((event) => ({
        ...event,
        cityName:
          MOCK_CITIES.find((city) => city.id === event.cityId)?.name ?? "-",
        coffeeShopName: event.coffeeShopId
          ? MOCK_COFFEE_SHOPS.find((shop) => shop.id === event.coffeeShopId)
              ?.name ?? null
          : null,
      }))
      .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
    return NextResponse.json({ success: true, data: list });
  }

  const qs = cityId ? `?cityId=${encodeURIComponent(cityId)}` : "";
  const apiResponse = await fetch(`${env.apiUrl}/events${qs}`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeEvent[] };
  return NextResponse.json({ success: true, data: payload.data });
}