import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_REVIEWS } from "@/features/review/constants/mock-reviews";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import type { Review } from "@/features/review/types/review.types";

const COOKIE_NAME = "ngopi_token";

async function ensureAuth(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function GET() {
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const user = MOCK_USERS[0];
    const reviews = MOCK_REVIEWS.filter(
      (review) => review.author.id === user.id,
    ).slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: reviews });
  }

  const apiResponse = await fetch(`${env.apiUrl}/reviews/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: Review[] };
  return NextResponse.json({ success: true, data: payload.data });
}