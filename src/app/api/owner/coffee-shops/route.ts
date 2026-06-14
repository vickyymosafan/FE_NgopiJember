import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const COOKIE_NAME = "ngopi_token";

async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (env.useMock) {
    return MOCK_USERS.find((u) => u.role === "OWNER" || u.role === "ADMIN") ?? null;
  }
  const res = await fetch(`${env.apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const payload = (await res.json()) as { data: { id: string; role: string } };
  return payload.data;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const mine = MOCK_COFFEE_SHOPS.filter(
      (shop) => shop.ownerId === user.id,
    ).sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ success: true, data: mine });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/coffee-shops`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeShop[] };
  return NextResponse.json({ success: true, data: payload.data });
}