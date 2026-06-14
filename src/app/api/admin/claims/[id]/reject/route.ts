import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_CLAIMS } from "@/features/claim/constants/mock-claims";

const COOKIE_NAME = "ngopi_token";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function ensureAdmin(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = await ensureAdmin();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  if (env.useMock) {
    const index = MOCK_CLAIMS.findIndex((claim) => claim.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Klaim tidak ditemukan." },
        { status: 404 },
      );
    }
    const claim = MOCK_CLAIMS[index];
    claim.status = "REJECTED";
    claim.updatedAt = new Date().toISOString();
    return NextResponse.json({ success: true, data: claim });
  }

  const apiResponse = await fetch(`${env.apiUrl}/admin/claims/${id}/reject`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = await apiResponse.json();
  return NextResponse.json({ success: true, data: payload.data ?? payload });
}