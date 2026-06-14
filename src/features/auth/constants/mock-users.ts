import type { AuthUser } from "@/features/auth/types/auth.types";

export const MOCK_USERS: AuthUser[] = [
  {
    id: "mock-user-01",
    name: "Test User",
    email: "user@ngopijember.id",
    avatarUrl: null,
    role: "ADMIN",
  },
  {
    id: "mock-user-02",
    name: "Owner Perasa",
    email: "owner@ngopijember.id",
    avatarUrl: null,
    role: "OWNER",
  },
];

export const MOCK_PASSWORD = "Password123";

export const MOCK_TOKEN = "mock-access-token-dev-only";