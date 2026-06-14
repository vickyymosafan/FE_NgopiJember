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

function filterMock(coffeeShopId: string) {
  return MOCK_REVIEWS.filter((review) => review.coffeeShopId === coffeeShopId)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const coffeeShopId = url.searchParams.get("coffeeShopId");

  if (!coffeeShopId) {
    return NextResponse.json(
      { success: false, message: "coffeeShopId wajib." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    return NextResponse.json({
      success: true,
      data: filterMock(coffeeShopId),
    });
  }

  const apiResponse = await fetch(
    `${env.apiUrl}/coffee-shops/${coffeeShopId}/reviews`,
  );
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
    rating?: number;
    comment?: string;
    images?: string[];
  };

  if (!body.coffeeShopId) {
    return NextResponse.json(
      { success: false, message: "coffeeShopId wajib." },
      { status: 400 },
    );
  }
  if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { success: false, message: "Rating tidak valid." },
      { status: 400 },
    );
  }
  if (!body.comment || body.comment.trim().length < 10) {
    return NextResponse.json(
      { success: false, message: "Komentar minimal 10 karakter." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const user = MOCK_USERS[0];
    const existing = MOCK_REVIEWS.find(
      (review) =>
        review.coffeeShopId === body.coffeeShopId &&
        review.author.id === user.id,
    );
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda sudah pernah memberi ulasan untuk coffee shop ini.",
        },
        { status: 409 },
      );
    }
    const newReview: Review = {
      id: `review-${Date.now()}`,
      coffeeShopId: body.coffeeShopId,
      rating: body.rating,
      comment: body.comment,
      images: body.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: null,
      author: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
    MOCK_REVIEWS.unshift(newReview);
    return NextResponse.json(
      { success: true, data: newReview },
      { status: 201 },
    );
  }

  const apiResponse = await fetch(`${env.apiUrl}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      coffeeShopId: body.coffeeShopId,
      rating: body.rating,
      comment: body.comment,
      images: body.images ?? [],
    }),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: Review };
  return NextResponse.json(
    { success: true, data: payload.data },
    { status: 201 },
  );
}