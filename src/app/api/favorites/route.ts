import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  MOCK_FAVORITES,
  type MockFavoriteRow,
} from "@/features/favorite/constants/mock-favorites";

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
    return NextResponse.json({
      success: true,
      data: MOCK_FAVORITES.map((row) => row.coffeeShopId),
    });
  }

  const apiResponse = await fetch(`${env.apiUrl}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as {
    data: Array<{ coffeeShopId: string }>;
  };
  return NextResponse.json({
    success: true,
    data: payload.data.map((item) => item.coffeeShopId),
  });
}

export async function POST(request: Request) {
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { coffeeShopId?: string };
  if (!body.coffeeShopId) {
    return NextResponse.json(
      { success: false, message: "coffeeShopId wajib." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const exists = MOCK_FAVORITES.find(
      (row) => row.coffeeShopId === body.coffeeShopId,
    );
    if (!exists) {
      const newRow: MockFavoriteRow = {
        id: `fav-mock-${Date.now()}`,
        coffeeShopId: body.coffeeShopId,
        createdAt: new Date().toISOString(),
      };
      MOCK_FAVORITES.push(newRow);
    }
    return NextResponse.json({ success: true, data: body.coffeeShopId });
  }

  const apiResponse = await fetch(`${env.apiUrl}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ coffeeShopId: body.coffeeShopId }),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ success: true, data: body.coffeeShopId });
}

export async function DELETE(request: Request) {
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const coffeeShopId = url.searchParams.get("coffeeShopId");
  if (!coffeeShopId) {
    return NextResponse.json(
      { success: false, message: "coffeeShopId wajib." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const index = MOCK_FAVORITES.findIndex(
      (row) => row.coffeeShopId === coffeeShopId,
    );
    if (index >= 0) {
      MOCK_FAVORITES.splice(index, 1);
    }
    return NextResponse.json({ success: true, data: coffeeShopId });
  }

  const apiResponse = await fetch(
    `${env.apiUrl}/favorites/${coffeeShopId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ success: true, data: coffeeShopId });
}