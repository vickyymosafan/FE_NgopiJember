import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";

const COOKIE_NAME = "ngopi_token";

function mockList(): CoffeeShop[] {
  return [...MOCK_COFFEE_SHOPS].sort((a, b) => a.name.localeCompare(b.name));
}

async function realList(token: string) {
  return fetch(`${env.apiUrl}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

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
    return NextResponse.json({
      success: true,
      data: mockList(),
    });
  }

  const apiResponse = await realList(token);
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

export async function POST(request: Request) {
  const token = await ensureAdmin();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as Record<string, unknown>;

  if (env.useMock) {
    const newShop: CoffeeShop = {
      id: `mock-admin-${Date.now()}`,
      name: String(body.name ?? ""),
      slug: String(body.slug ?? ""),
      description: body.description ? String(body.description) : null,
      address: String(body.address ?? ""),
      district: String(body.district ?? ""),
      latitude: body.latitude != null ? Number(body.latitude) : null,
      longitude: body.longitude != null ? Number(body.longitude) : null,
      phone: body.phone ? String(body.phone) : null,
      instagram: body.instagram ? String(body.instagram) : null,
      website: body.website ? String(body.website) : null,
      openingTime: body.openingTime ? String(body.openingTime) : null,
      closingTime: body.closingTime ? String(body.closingTime) : null,
      isOpen24Hours:
        !body.openingTime && !body.closingTime,
      priceRange: Number(body.priceRange ?? 1),
      priceLabel: "Admin",
      rating: 0,
      reviewCount: 0,
      verified: true,
      imageUrl: null,
      facilities: [],
    };
    MOCK_COFFEE_SHOPS.unshift(newShop);
    return NextResponse.json({ success: true, data: newShop }, { status: 201 });
  }

  const apiResponse = await fetch(`${env.apiUrl}/coffee-shops`, {
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
  const payload = (await apiResponse.json()) as { data: CoffeeShop };
  return NextResponse.json({ success: true, data: payload.data }, { status: 201 });
}