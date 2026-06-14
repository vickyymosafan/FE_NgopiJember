export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OwnerClaim {
  id: string;
  userId: string;
  coffeeShopId: string;
  status: ClaimStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  coffeeShopName?: string;
  userName?: string;
}

export interface ClaimCreatePayload {
  coffeeShopId: string;
  notes?: string;
}