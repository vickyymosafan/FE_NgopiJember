import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_COMMUNITIES } from "@/features/community/constants/mock-communities";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import type { CoffeeCommunity } from "@/features/community/types/community.types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (env.useMock) {
    const community = MOCK_COMMUNITIES.find((item) => item.slug === slug);
    if (!community) {
      return NextResponse.json(
        { success: false, message: "Komunitas tidak ditemukan." },
        { status: 404 },
      );
    }
    const enriched: CoffeeCommunity = {
      ...community,
      cityName:
        MOCK_CITIES.find((city) => city.id === community.cityId)?.name ?? "-",
    };
    return NextResponse.json({ success: true, data: enriched });
  }

  const apiResponse = await fetch(`${env.apiUrl}/communities/${slug}`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeCommunity };
  return NextResponse.json({ success: true, data: payload.data });
}