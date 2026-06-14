import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { MOCK_TOKEN, MOCK_USERS } from "@/features/auth/constants/mock-users";
import type {
  AuthUser,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

const COOKIE_NAME = "ngopi_token";

interface RegisteredUser extends RegisterPayload {
  id: string;
}

const MOCK_REGISTERED: RegisteredUser[] = [];

async function proxyRegister(body: RegisterPayload) {
  return fetch(`${env.apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function mockRegister(body: RegisterPayload) {
  const exists =
    MOCK_USERS.some(
      (item) => item.email.toLowerCase() === body.email.toLowerCase(),
    ) ||
    MOCK_REGISTERED.some(
      (item) => item.email.toLowerCase() === body.email.toLowerCase(),
    );
  if (exists) {
    return NextResponse.json(
      { success: false, message: "Email sudah terdaftar." },
      { status: 409 },
    );
  }
  const newUser: RegisteredUser = {
    id: `mock-user-${String(MOCK_REGISTERED.length + 10).padStart(2, "0")}`,
    name: body.name,
    email: body.email,
    password: body.password,
  };
  MOCK_REGISTERED.push(newUser);
  const user: AuthUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatarUrl: null,
    role: "USER",
  };
  return NextResponse.json({
    success: true,
    message: "Registrasi berhasil.",
    data: { accessToken: MOCK_TOKEN, user },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterPayload;
  const apiResponse = env.useMock
    ? await mockRegister(body)
    : await proxyRegister(body);

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
    message: "Registrasi berhasil.",
    data: { user: session.data.user },
  });
}