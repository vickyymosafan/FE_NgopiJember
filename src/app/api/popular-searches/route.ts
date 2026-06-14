import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_SEARCH_LOGS } from "@/features/growth/constants/mock-search-logs";
import type { PopularSearch } from "@/features/growth/types/growth.types";

function aggregateMock(limit: number): PopularSearch[] {
  const counts = new Map<string, number>();
  for (const log of MOCK_SEARCH_LOGS) {
    counts.set(log.term, (counts.get(log.term) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "6"), 20);

  if (env.useMock) {
    return NextResponse.json({
      success: true,
      data: aggregateMock(limit),
    });
  }

  const apiResponse = await fetch(
    `${env.apiUrl}/search-analytics/popular?limit=${limit}`,
  );
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: PopularSearch[] };
  return NextResponse.json({ success: true, data: payload.data });
}