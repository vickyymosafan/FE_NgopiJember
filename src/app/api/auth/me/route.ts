import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_USERS } from "@/features/auth/constants/mock-users";
import type { AuthUser } from "@/features/auth/types/auth.types";

const COOKIE_NAME = "ngopi_token";

export async function GET() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (env.useMock) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Belum login." },
        { status: 401 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Ok",
      data: MOCK_USERS[0] as AuthUser,
    });
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login." },
      { status: 401 },
    );
  }

  const apiResponse = await fetch(`${env.apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!apiResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Sesi kedaluwarsa." },
      { status: apiResponse.status },
    );
  }

  const payload = (await apiResponse.json()) as { data: AuthUser };
  return NextResponse.json({ success: true, data: payload.data });
}