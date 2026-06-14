import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_CLAIMS } from "@/features/claim/constants/mock-claims";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import type { OwnerClaim } from "@/features/claim/types/claim.types";

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
    const list = MOCK_CLAIMS.filter((claim) => claim.userId === user.id)
      .map((claim) => {
        const shop = MOCK_COFFEE_SHOPS.find((item) => item.id === claim.coffeeShopId);
        return { ...claim, coffeeShopName: shop?.name ?? "-" };
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json({ success: true, data: list });
  }

  const apiResponse = await fetch(`${env.apiUrl}/owner/claims`, {
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

export async function POST(request: Request) {
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    coffeeShopId?: string;
    notes?: string;
  };

  if (!body.coffeeShopId) {
    return NextResponse.json(
      { success: false, message: "coffeeShopId wajib." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const user = MOCK_USERS[0];
    const existing = MOCK_CLAIMS.find(
      (claim) =>
        claim.coffeeShopId === body.coffeeShopId &&
        claim.userId === user.id &&
        claim.status !== "REJECTED",
    );
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda sudah mengajukan klaim untuk coffee shop ini.",
        },
        { status: 409 },
      );
    }
    const newClaim: OwnerClaim = {
      id: `claim-${Date.now()}`,
      userId: user.id,
      coffeeShopId: body.coffeeShopId,
      status: "PENDING",
      notes: body.notes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      coffeeShopName:
        MOCK_COFFEE_SHOPS.find((item) => item.id === body.coffeeShopId)?.name ?? "-",
      userName: user.name,
    };
    MOCK_CLAIMS.push(newClaim);
    return NextResponse.json(
      { success: true, data: newClaim },
      { status: 201 },
    );
  }

  const apiResponse = await fetch(`${env.apiUrl}/owner/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      coffeeShopId: body.coffeeShopId,
      notes: body.notes,
    }),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: OwnerClaim };
  return NextResponse.json(
    { success: true, data: payload.data },
    { status: 201 },
  );
}