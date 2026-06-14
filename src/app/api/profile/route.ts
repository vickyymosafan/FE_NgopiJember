import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import type { AuthUser } from "@/features/auth/types/auth.types";

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
      data: MOCK_USERS[0] as AuthUser,
    });
  }

  const apiResponse = await fetch(`${env.apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak valid." },
      { status: 401 },
    );
  }
  const payload = (await apiResponse.json()) as { data: AuthUser };
  return NextResponse.json({ success: true, data: payload.data });
}

export async function PATCH(request: Request) {
  const token = await ensureAuth();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    name?: string;
    avatarUrl?: string | null;
  };

  if (!body.name || body.name.trim().length < 3) {
    return NextResponse.json(
      { success: false, message: "Nama minimal 3 karakter." },
      { status: 400 },
    );
  }

  if (env.useMock) {
    const user = MOCK_USERS[0];
    user.name = body.name;
    if (body.avatarUrl !== undefined) {
      user.avatarUrl = body.avatarUrl;
    }
    return NextResponse.json({ success: true, data: user });
  }

  const apiResponse = await fetch(`${env.apiUrl}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: body.name, avatarUrl: body.avatarUrl }),
  });
  if (!apiResponse.ok) {
    const text = await apiResponse.text();
    return new NextResponse(text, {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = (await apiResponse.json()) as { data: AuthUser };
  return NextResponse.json({ success: true, data: payload.data });
}