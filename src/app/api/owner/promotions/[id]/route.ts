import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { MOCK_PROMOTIONS } from "@/features/owner/constants/mock-promotions";
import type { Promotion } from "@/features/owner/types/owner.types";

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
    const index = MOCK_PROMOTIONS.findIndex((promo) => promo.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Promosi tidak ditemukan." },
        { status: 404 },
      );
    }
    const promo = MOCK_PROMOTIONS[index];
    const shop = MOCK_COFFEE_SHOPS.find(
      (item) => item.id === promo.coffeeShopId,
    );
    if (!shop || (shop.ownerId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Bukan pemilik." },
        { status: 403 },
      );
    }
    MOCK_PROMOTIONS[index] = { ...promo, ...body } as Promotion;
    return NextResponse.json({ success: true, data: MOCK_PROMOTIONS[index] });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/promotions/${id}`, {
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
  const payload = (await apiResponse.json()) as { data: Promotion };
  return NextResponse.json({ success: true, data: payload.data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const index = MOCK_PROMOTIONS.findIndex((promo) => promo.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Promosi tidak ditemukan." },
        { status: 404 },
      );
    }
    const promo = MOCK_PROMOTIONS[index];
    const shop = MOCK_COFFEE_SHOPS.find(
      (item) => item.id === promo.coffeeShopId,
    );
    if (!shop || (shop.ownerId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "Bukan pemilik." },
        { status: 403 },
      );
    }
    MOCK_PROMOTIONS.splice(index, 1);
    return NextResponse.json({ success: true, message: "Dihapus." });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/promotions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ success: true, message: "Dihapus." });
}