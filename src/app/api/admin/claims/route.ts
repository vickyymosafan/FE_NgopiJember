import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_CLAIMS } from "@/features/claim/constants/mock-claims";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import type { OwnerClaim } from "@/features/claim/types/claim.types";

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
    const list = MOCK_CLAIMS.map((claim) => ({
      ...claim,
      coffeeShopName:
        MOCK_COFFEE_SHOPS.find((item) => item.id === claim.coffeeShopId)?.name ??
        "-",
      userName:
        MOCK_USERS.find((item) => item.id === claim.userId)?.name ?? "-",
    })).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: list });
  }

  const apiResponse = await fetch(`${env.apiUrl}/admin/claims`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: OwnerClaim[] };
  return NextResponse.json({ success: true, data: payload.data });
}