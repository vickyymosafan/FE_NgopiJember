"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useMyClaims } from "@/features/claim/queries/claim-queries";

interface ClaimButtonProps {
  coffeeShopId: string;
  isVerified: boolean;
}

export function ClaimButton({ coffeeShopId, isVerified }: ClaimButtonProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: claims } = useMyClaims();

  const hasPending = useMemo(() => {
    if (!claims) return false;
    return claims.some(
      (claim) =>
        claim.coffeeShopId === coffeeShopId && claim.status === "PENDING",
    );
  }, [claims, coffeeShopId]);

  if (isVerified) {
    return null;
  }

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/claim?coffeeShopId=${coffeeShopId}`)}`}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
      >
        <ShieldCheck className="size-4" aria-hidden="true" />
        Klaim coffee shop ini
      </Link>
    );
  }

  if (hasPending) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Klaim sedang ditinjau
      </span>
    );
  }

  return (
    <Link
      href={`/claim?coffeeShopId=${coffeeShopId}`}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
    >
      <ShieldCheck className="size-4" aria-hidden="true" />
      Klaim coffee shop ini
    </Link>
  );
}