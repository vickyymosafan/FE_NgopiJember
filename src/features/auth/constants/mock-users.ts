import type { AuthUser } from "@/features/auth/types/auth.types";

export const MOCK_USERS: AuthUser[] = [
  {
    id: "mock-user-01",
    name: "Test User",
    email: "user@ngopijember.id",
    avatarUrl: null,
    role: "ADMIN",
  },
];

export const MOCK_PASSWORD = "Password123";

export const MOCK_TOKEN = "mock-access-token-dev-only";