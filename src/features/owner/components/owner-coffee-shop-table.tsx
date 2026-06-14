"use client";

import Link from "next/link";
import { AlertCircle, Pencil, Plus } from "lucide-react";
import { useOwnerCoffeeShops } from "@/features/owner/queries/owner-queries";

export function OwnerCoffeeShopTable() {
  const { data, isPending, isError } = useOwnerCoffeeShops();

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Gagal memuat daftar coffee shop Anda.
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
            className="h-12 w-full animate-pulse rounded-card bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
        <p className="text-muted-foreground">
          Anda belum memiliki coffee shop. Ajukan klaim terlebih dahulu.
        </p>
        <Link
          href="/claim"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Ajukan klaim
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
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Ulasan</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((shop) => (
            <tr key={shop.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{shop.name}</div>
                <div className="text-xs text-muted-foreground">
                  {shop.address}
                </div>
              </td>
              <td className="px-4 py-3">{shop.rating.toFixed(1)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {shop.reviewCount.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {(shop.views ?? 0).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/owner/coffee-shops/${shop.id}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Pencil className="inline size-3.5" aria-hidden="true" /> Edit
                  </Link>
                  <Link
                    href={`/coffee-shops/${shop.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Lihat
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}