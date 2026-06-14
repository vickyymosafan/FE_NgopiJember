"use client";

import Link from "next/link";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useOwnerDeletePromotion,
  useOwnerPromotions,
} from "@/features/owner/queries/owner-queries";

export function OwnerPromotionList() {
  const { data, isPending, isError } = useOwnerPromotions();
  const deleteMutation = useOwnerDeletePromotion();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      setConfirmId(null);
    } catch {
      // handled via isError state
    }
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Gagal memuat daftar promosi.
        </p>
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
        <p className="text-muted-foreground">
          Anda belum memiliki promosi apa pun.
        </p>
        <Link
          href="/owner/promotions/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Buat promosi
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Coffee Shop</th>
            <th className="px-4 py-3 font-medium">Periode</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((promo) => (
            <tr key={promo.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{promo.title}</div>
                {promo.description ? (
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {promo.description}
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {promo.coffeeShopName ?? "-"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {promo.startDate} - {promo.endDate}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {confirmId === promo.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(promo.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-full bg-danger px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "..." : "Hapus"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(promo.id)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-danger hover:bg-muted"
                    >
                      <Trash2 className="inline size-3.5" aria-hidden="true" /> Hapus
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}