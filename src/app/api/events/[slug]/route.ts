import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_EVENTS } from "@/features/event/constants/mock-events";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeEvent } from "@/features/event/types/event.types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (env.useMock) {
    const event = MOCK_EVENTS.find((item) => item.slug === slug);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event tidak ditemukan." },
        { status: 404 },
      );
    }
    const enriched: CoffeeEvent = {
      ...event,
      cityName:
        MOCK_CITIES.find((city) => city.id === event.cityId)?.name ?? "-",
      coffeeShopName: event.coffeeShopId
        ? MOCK_COFFEE_SHOPS.find((shop) => shop.id === event.coffeeShopId)
            ?.name ?? null
        : null,
    };
    return NextResponse.json({ success: true, data: enriched });
  }

  const apiResponse = await fetch(`${env.apiUrl}/events/${slug}`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeEvent };
  return NextResponse.json({ success: true, data: payload.data });
}