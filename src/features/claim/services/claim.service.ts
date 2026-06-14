import { ApiError } from "@/types/api";
import type {
  ClaimCreatePayload,
  OwnerClaim,
} from "@/features/claim/types/claim.types";

const USER_BASE = "/api/claims";
const ADMIN_BASE = "/api/admin/claims";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
  const text = await response.text();
  let payload:
    | { success?: boolean; message?: string; data?: T }
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
      payload?.message ?? "Permintaan gagal.",
      response.status,
    );
  }
  return (payload?.data ?? payload) as T;
}

export async function listMyClaims(): Promise<OwnerClaim[]> {
  return call<OwnerClaim[]>(USER_BASE);
}

export async function createClaim(
  payload: ClaimCreatePayload,
): Promise<OwnerClaim> {
  return call<OwnerClaim>(USER_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function listAdminClaims(): Promise<OwnerClaim[]> {
  return call<OwnerClaim[]>(ADMIN_BASE);
}

export async function approveClaim(id: string): Promise<OwnerClaim> {
  return call<OwnerClaim>(`${ADMIN_BASE}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectClaim(id: string): Promise<OwnerClaim> {
  return call<OwnerClaim>(`${ADMIN_BASE}/${id}/reject`, { method: "POST" });
}

export const claimService = {
  listMyClaims,
  createClaim,
  listAdminClaims,
  approveClaim,
  rejectClaim,
};