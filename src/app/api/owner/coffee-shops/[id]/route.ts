import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const COOKIE_NAME = "ngopi_token";

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as Record<string, unknown>;

  if (env.useMock) {
    const index = MOCK_COFFEE_SHOPS.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Coffee shop tidak ditemukan." },
        { status: 404 },
      );
    }
    const shop = MOCK_COFFEE_SHOPS[index];
    if (shop.ownerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Bukan pemilik." },
        { status: 403 },
      );
    }
    const updated: CoffeeShop = {
      ...shop,
      ...body,
      id: shop.id,
      latitude:
        body.latitude !== undefined
          ? body.latitude != null
            ? Number(body.latitude)
            : null
          : shop.latitude,
      longitude:
        body.longitude !== undefined
          ? body.longitude != null
            ? Number(body.longitude)
            : null
          : shop.longitude,
      priceRange:
        body.priceRange !== undefined
          ? Number(body.priceRange)
          : shop.priceRange,
    } as CoffeeShop;
    MOCK_COFFEE_SHOPS[index] = updated;
    return NextResponse.json({ success: true, data: updated });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/coffee-shops/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: CoffeeShop };
  return NextResponse.json({ success: true, data: payload.data });
}