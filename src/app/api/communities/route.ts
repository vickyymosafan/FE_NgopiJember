import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_COMMUNITIES } from "@/features/community/constants/mock-communities";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import type { CoffeeCommunity } from "@/features/community/types/community.types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cityId = url.searchParams.get("cityId");

  if (env.useMock) {
    const list = MOCK_COMMUNITIES.filter(
      (community) => !cityId || community.cityId === cityId,
    ).map((community) => ({
      ...community,
      cityName:
        MOCK_CITIES.find((city) => city.id === community.cityId)?.name ?? "-",
    }));
    return NextResponse.json({ success: true, data: list });
  }

  const qs = cityId ? `?cityId=${encodeURIComponent(cityId)}` : "";
  const apiResponse = await fetch(`${env.apiUrl}/communities${qs}`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeCommunity[] };
  return NextResponse.json({ success: true, data: payload.data });
}