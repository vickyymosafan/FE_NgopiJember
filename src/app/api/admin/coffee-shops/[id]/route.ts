import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const COOKIE_NAME = "ngopi_token";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function ensureAdmin(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

function findMock(id: string) {
  const index = MOCK_COFFEE_SHOPS.findIndex((item) => item.id === id);
  return index === -1 ? null : { index, shop: MOCK_COFFEE_SHOPS[index] };
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = await ensureAdmin();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as Record<string, unknown>;

  if (env.useMock) {
    const found = findMock(id);
    if (!found) {
      return NextResponse.json(
        { success: false, message: "Coffee shop tidak ditemukan." },
        { status: 404 },
      );
    }
    const updated: CoffeeShop = {
      ...found.shop,
      ...body,
      id: found.shop.id,
      latitude:
        body.latitude !== undefined
          ? body.latitude != null
            ? Number(body.latitude)
            : null
          : found.shop.latitude,
      longitude:
        body.longitude !== undefined
          ? body.longitude != null
            ? Number(body.longitude)
            : null
          : found.shop.longitude,
      priceRange:
        body.priceRange !== undefined
          ? Number(body.priceRange)
          : found.shop.priceRange,
    } as CoffeeShop;
    MOCK_COFFEE_SHOPS[found.index] = updated;
    return NextResponse.json({ success: true, data: updated });
  }

  const apiResponse = await fetch(`${env.apiUrl}/coffee-shops/${id}`, {
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

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = await ensureAdmin();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const found = findMock(id);
    if (!found) {
      return NextResponse.json(
        { success: false, message: "Coffee shop tidak ditemukan." },
        { status: 404 },
      );
    }
    MOCK_COFFEE_SHOPS.splice(found.index, 1);
    return NextResponse.json({ success: true, message: "Dihapus." });
  }

  const apiResponse = await fetch(`${env.apiUrl}/coffee-shops/${id}`, {
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