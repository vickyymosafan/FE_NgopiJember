import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_SEARCH_LOGS } from "@/features/growth/constants/mock-search-logs";
import type { SearchAnalytics } from "@/features/growth/types/growth.types";

const COOKIE_NAME = "ngopi_token";

async function ensureAdmin(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function GET() {
  const token = await ensureAdmin();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const counts = new Map<string, number>();
    for (const log of MOCK_SEARCH_LOGS) {
      counts.set(log.term, (counts.get(log.term) ?? 0) + 1);
    }
    const popular = Array.from(counts.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    const recent = MOCK_SEARCH_LOGS.slice(0, 20);
    const analytics: SearchAnalytics = {
      totalSearches: MOCK_SEARCH_LOGS.length,
      uniqueTerms: counts.size,
      popularSearches: popular,
      recentSearches: recent,
    };
    return NextResponse.json({ success: true, data: analytics });
  }

  const apiResponse = await fetch(`${env.apiUrl}/admin/search-analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: SearchAnalytics };
  return NextResponse.json({ success: true, data: payload.data });
}