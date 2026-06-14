import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  MOCK_PASSWORD,
  MOCK_TOKEN,
  MOCK_USERS,
} from "@/features/auth/constants/mock-users";
import type {
  AuthUser,
  LoginPayload,
} from "@/features/auth/types/auth.types";

const COOKIE_NAME = "ngopi_token";

async function proxyLogin(body: LoginPayload) {
  const apiResponse = await fetch(`${env.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return apiResponse;
}

async function mockLogin(body: LoginPayload) {
  const user = MOCK_USERS.find(
    (item) => item.email.toLowerCase() === body.email.toLowerCase(),
  );
  if (!user || body.password !== MOCK_PASSWORD) {
    return NextResponse.json(
      {
        success: false,
        message: "Email atau kata sandi salah.",
      },
      { status: 401 },
    );
  }
  return NextResponse.json({
    success: true,
    message: "Login berhasil.",
    data: { accessToken: MOCK_TOKEN, user },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;
  const apiResponse = env.useMock
    ? await mockLogin(body)
    : await proxyLogin(body);

  if (!apiResponse.ok) {
    return apiResponse;
  }

  const session = (await apiResponse.json()) as {
    data: { accessToken: string; user: AuthUser };
  };
  const store = await cookies();
  store.set(COOKIE_NAME, session.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    success: true,
    message: "Login berhasil.",
    data: { user: session.data.user },
  });
}