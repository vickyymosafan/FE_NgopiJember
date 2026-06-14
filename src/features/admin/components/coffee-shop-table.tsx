"use client";

import Link from "next/link";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { CoffeeShop } from "@/features/coffee-shop/types/coffee-shop.types";
import { useAdminDeleteCoffeeShop } from "@/features/admin/queries/admin-queries";

interface CoffeeShopTableProps {
  shops: CoffeeShop[];
}

export function CoffeeShopTable({ shops }: CoffeeShopTableProps) {
  const deleteMutation = useAdminDeleteCoffeeShop();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      setConfirmId(null);
    } catch {
      // error handled by toast-less UI below
    }
  }

  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <AlertCircle className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">Belum ada coffee shop.</p>
        <Link
          href="/admin/coffee-shops/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Tambah coffee shop
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Distrik</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Harga</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{shop.name}</div>
                <div className="text-xs text-muted-foreground">{shop.slug}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{shop.district}</td>
              <td className="px-4 py-3">{shop.rating.toFixed(1)}</td>
              <td className="px-4 py-3 text-muted-foreground">{shop.priceLabel}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/coffee-shops/${shop.id}/edit`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    aria-label={`Edit ${shop.name}`}
                  >
                    <Pencil className="inline size-3.5" aria-hidden="true" /> Edit
                  </Link>
                  {confirmId === shop.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(shop.id)}
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
                      onClick={() => setConfirmId(shop.id)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-danger hover:bg-muted"
                      aria-label={`Hapus ${shop.name}`}
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
      {deleteMutation.isError ? (
        <p className="px-4 py-2 text-sm text-danger">
          Gagal menghapus. Coba lagi.
        </p>
      ) : null}
    </div>
  );
}