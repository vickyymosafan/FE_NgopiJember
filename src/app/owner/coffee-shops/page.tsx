import type { Metadata } from "next";
import { OwnerShell } from "@/features/owner/components/owner-shell";
import { OwnerCoffeeShopTable } from "@/features/owner/components/owner-coffee-shop-table";

export const metadata: Metadata = {
  title: "Coffee Shop Saya",
  description: "Daftar coffee shop yang Anda kelola.",
};

export default function OwnerCoffeeShopsPage() {
  return (
    <OwnerShell
      title="Coffee Shop Saya"
      description="Kelola informasi coffee shop yang telah Anda klaim."
    >
      <OwnerCoffeeShopTable />
    </OwnerShell>
  );
}