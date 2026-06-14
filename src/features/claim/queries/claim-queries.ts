"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveClaim,
  createClaim,
  listAdminClaims,
  listMyClaims,
  rejectClaim,
} from "@/features/claim/services/claim.service";
import type { ClaimCreatePayload } from "@/features/claim/types/claim.types";

export const claimKeys = {
  mine: ["claims", "mine"] as const,
  admin: ["claims", "admin"] as const,
};

export function useMyClaims() {
  return useQuery({
    queryKey: claimKeys.mine,
    queryFn: listMyClaims,
    staleTime: 1000 * 60,
  });
}

export function useAdminClaims() {
  return useQuery({
    queryKey: claimKeys.admin,
    queryFn: listAdminClaims,
    staleTime: 1000 * 60,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClaimCreatePayload) => createClaim(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: claimKeys.mine });
    },
  });
}

export function useApproveClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveClaim(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: claimKeys.admin });
      void queryClient.invalidateQueries({ queryKey: ["coffee-shops"] });
    },
  });
}

export function useRejectClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectClaim(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: claimKeys.admin });
    },
  });
}