import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_SEARCH_LOGS } from "@/features/growth/constants/mock-search-logs";
import type { SearchLog } from "@/features/growth/types/growth.types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    term?: string;
  } | null;

  const term = body?.term?.trim().toLowerCase() ?? "";
  if (!term) {
    return NextResponse.json(
      { success: false, message: "Term wajib." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const log: SearchLog = { term, createdAt: new Date().toISOString() };
    MOCK_SEARCH_LOGS.unshift(log);
    return NextResponse.json({ success: true, data: log });
  }

  const apiResponse = await fetch(`${env.apiUrl}/search-analytics/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ term }),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ success: true, data: { term } });
}