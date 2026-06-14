import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import type { City } from "@/features/city/types/city.types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (env.useMock) {
    const city = MOCK_CITIES.find((item) => item.slug === slug);
    if (!city) {
      return NextResponse.json(
        { success: false, message: "Kota tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: city });
  }
  const apiResponse = await fetch(`${env.apiUrl}/cities/${slug}`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: City };
  return NextResponse.json({ success: true, data: payload.data });
}