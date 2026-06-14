import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { MOCK_PROMOTIONS } from "@/features/owner/constants/mock-promotions";
import type { Promotion } from "@/features/owner/types/owner.types";

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
    const myShopIds = new Set(
      MOCK_COFFEE_SHOPS.filter((shop) => shop.ownerId === user.id).map(
        (shop) => shop.id,
      ),
    );
    const list = MOCK_PROMOTIONS.filter((promo) =>
      myShopIds.has(promo.coffeeShopId),
    )
      .map((promo) => {
        const shop = MOCK_COFFEE_SHOPS.find(
          (item) => item.id === promo.coffeeShopId,
        );
        return { ...promo, coffeeShopName: shop?.name ?? "-" };
      })
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    return NextResponse.json({ success: true, data: list });
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/promotions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: Promotion[] };
  return NextResponse.json({ success: true, data: payload.data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    coffeeShopId?: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!body.coffeeShopId || !body.title || !body.startDate || !body.endDate) {
    return NextResponse.json(
      { success: false, message: "Field wajib belum lengkap." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const shop = MOCK_COFFEE_SHOPS.find(
      (item) => item.id === body.coffeeShopId,
    );
    if (!shop) {
      return NextResponse.json(
        { success: false, message: "Coffee shop tidak ditemukan." },
        { status: 404 },
      );
    }
    if (shop.ownerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Bukan pemilik." },
        { status: 403 },
      );
    }
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      coffeeShopId: body.coffeeShopId,
      title: body.title,
      description: body.description ?? null,
      startDate: body.startDate,
      endDate: body.endDate,
      createdAt: new Date().toISOString(),
      coffeeShopName: shop.name,
    };
    MOCK_PROMOTIONS.push(newPromo);
    return NextResponse.json(
      { success: true, data: newPromo },
      { status: 201 },
    );
  }

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const apiResponse = await fetch(`${env.apiUrl}/owner/promotions`, {
    method: "POST",
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
  return NextResponse.json(
    { success: true, data: payload.data },
    { status: 201 },
  );
}