import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_CITIES } from "@/features/city/constants/mock-cities";
import type { City } from "@/features/city/types/city.types";

export async function GET() {
  if (env.useMock) {
    return NextResponse.json({ success: true, data: MOCK_CITIES });
  }
  const apiResponse = await fetch(`${env.apiUrl}/cities`);
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: City[] };
  return NextResponse.json({ success: true, data: payload.data });
}