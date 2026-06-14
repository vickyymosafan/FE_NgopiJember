"use client";

import { AlertCircle } from "lucide-react";
import { CoffeeShopForm } from "@/features/admin/components/coffee-shop-form";
import { useAdminFindCoffeeShop } from "@/features/admin/queries/admin-queries";

interface EditCoffeeShopClientProps {
  id: string;
}

export function EditCoffeeShopClient({ id }: EditCoffeeShopClientProps) {
  const { shop, isPending, isError, refetch } = useAdminFindCoffeeShop(id);

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
        <AlertCircle className="size-8 text-danger" aria-hidden="true" />
        <p className="text-muted-foreground">Gagal memuat data coffee shop.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-12 w-full animate-pulse rounded-card bg-muted" />
        ))}
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="rounded-card border border-border bg-surface px-6 py-12 text-center text-muted-foreground">
        Coffee shop tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <CoffeeShopForm initialShop={shop} />
    </div>
  );
}