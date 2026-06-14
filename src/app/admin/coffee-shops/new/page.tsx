import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { CoffeeShopForm } from "@/features/admin/components/coffee-shop-form";

export const metadata: Metadata = {
  title: "Tambah Coffee Shop",
  description: "Tambah coffee shop baru ke platform.",
};

export default function NewCoffeeShopPage() {
  return (
    <AdminShell
      title="Tambah Coffee Shop"
      description="Isi data coffee shop baru. Akan muncul di platform setelah disimpan."
    >
      <div className="rounded-card border border-border bg-surface p-6">
        <CoffeeShopForm />
      </div>
    </AdminShell>
  );
}