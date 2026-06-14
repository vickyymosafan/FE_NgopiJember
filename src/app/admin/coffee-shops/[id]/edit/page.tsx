import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { EditCoffeeShopClient } from "@/features/admin/components/edit-coffee-shop-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Coffee Shop",
  description: "Edit data coffee shop.",
};

export default async function EditCoffeeShopPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AdminShell
      title="Edit Coffee Shop"
      description="Ubah informasi coffee shop yang sudah terdaftar."
    >
      <EditCoffeeShopClient id={id} />
    </AdminShell>
  );
}