"use client";

import Link from "next/link";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMyClaims,
} from "@/features/claim/queries/claim-queries";
import type { ClaimStatus } from "@/features/claim/types/claim.types";

const STATUS_STYLE: Record<ClaimStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
};

const STATUS_LABEL: Record<ClaimStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export function ClaimList() {
  const { data, isPending, isError, refetch } = useMyClaims();

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Gagal memuat klaim.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-16 w-full animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <ShieldCheck className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          Anda belum mengajukan klaim apa pun.
        </p>
        <Link
          href="/claim"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Ajukan klaim baru
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((claim) => (
        <li
          key={claim.id}
          className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {claim.coffeeShopName ?? "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              Diajukan{" "}
              {new Date(claim.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {claim.notes ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {claim.notes}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "w-fit rounded-full px-3 py-1 text-xs font-medium",
              STATUS_STYLE[claim.status],
            )}
          >
            {STATUS_LABEL[claim.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}