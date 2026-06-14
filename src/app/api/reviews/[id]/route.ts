import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_REVIEWS } from "@/features/review/constants/mock-reviews";
import type { Review } from "@/features/review/types/review.types";

const COOKIE_NAME = "ngopi_token";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function ensureAuth(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    rating?: number;
    comment?: string;
    images?: string[];
  };

  if (env.useMock) {
    const index = MOCK_REVIEWS.findIndex((review) => review.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Ulasan tidak ditemukan." },
        { status: 404 },
      );
    }
    MOCK_REVIEWS[index] = {
      ...MOCK_REVIEWS[index],
      rating: body.rating ?? MOCK_REVIEWS[index].rating,
      comment: body.comment ?? MOCK_REVIEWS[index].comment,
      images: body.images ?? MOCK_REVIEWS[index].images,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data: MOCK_REVIEWS[index] });
  }

  const apiResponse = await fetch(`${env.apiUrl}/reviews/${id}`, {
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
  const payload = (await apiResponse.json()) as { data: Review };
  return NextResponse.json({ success: true, data: payload.data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const index = MOCK_REVIEWS.findIndex((review) => review.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Ulasan tidak ditemukan." },
        { status: 404 },
      );
    }
    MOCK_REVIEWS.splice(index, 1);
    return NextResponse.json({ success: true, message: "Dihapus." });
  }

  const apiResponse = await fetch(`${env.apiUrl}/reviews/${id}`, {
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