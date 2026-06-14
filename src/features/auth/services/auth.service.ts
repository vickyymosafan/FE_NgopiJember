import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import { ApiError } from "@/types/api";

async function postRoute<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });

  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T; errors?: string[] }
    | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Autentikasi gagal.",
      response.status,
      payload?.errors ?? [],
    );
  }

  return (payload?.data ?? payload) as T;
}

export async function loginService(payload: LoginPayload): Promise<AuthUser> {
  const data = await postRoute<{ user: AuthUser }>("/login", payload);
  return data.user;
}

export async function registerService(
  payload: RegisterPayload,
): Promise<AuthUser> {
  const data = await postRoute<{ user: AuthUser }>("/register", payload);
  return data.user;
}

export async function meService(): Promise<AuthUser> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "same-origin",
  });
  const text = await response.text();
  let payload: { data?: AuthUser; message?: string } | null = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (response.status === 401) {
    throw new ApiError(payload?.message ?? "Belum login.", 401);
  }
  if (!response.ok) {
    throw new ApiError(payload?.message ?? "Gagal memuat sesi.", response.status);
  }
  if (!payload?.data) {
    throw new ApiError("Sesi tidak valid.", 401);
  }
  return payload.data;
}

export async function logoutService(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
}

export const authService = {
  login: loginService,
  register: registerService,
  me: meService,
  logout: logoutService,
};