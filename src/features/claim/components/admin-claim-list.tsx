"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminClaims,
  useApproveClaim,
  useRejectClaim,
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

export function AdminClaimList() {
  const { data, isPending, isError, refetch } = useAdminClaims();
  const approveMutation = useApproveClaim();
  const rejectMutation = useRejectClaim();

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
      <p className="rounded-card border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
        Belum ada klaim yang diajukan.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Coffee Shop</th>
            <th className="px-4 py-3 font-medium">Pemohon</th>
            <th className="px-4 py-3 font-medium">Catatan</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((claim) => {
            const canAct = claim.status === "PENDING";
            return (
              <tr
                key={claim.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {claim.coffeeShopName ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {claim.userName ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {claim.notes ? (
                    <span className="line-clamp-2 block max-w-xs">
                      {claim.notes}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      STATUS_STYLE[claim.status],
                    )}
                  >
                    {STATUS_LABEL[claim.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {canAct ? (
                      <>
                        <button
                          type="button"
                          onClick={() => approveMutation.mutate(claim.id)}
                          disabled={approveMutation.isPending}
                          className="rounded-full bg-success px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Setuju
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectMutation.mutate(claim.id)}
                          disabled={rejectMutation.isPending}
                          className="rounded-full border border-danger px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 disabled:opacity-50"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}