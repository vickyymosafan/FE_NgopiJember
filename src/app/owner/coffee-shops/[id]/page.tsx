import type { Metadata } from "next";
import { OwnerShell } from "@/features/owner/components/owner-shell";
import { OwnerCoffeeShopEditClient } from "@/features/owner/components/owner-coffee-shop-edit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Coffee Shop",
  description: "Edit informasi coffee shop Anda.",
};

export default async function OwnerCoffeeShopEditPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <OwnerShell
      title="Edit Coffee Shop"
      description="Perbarui informasi coffee shop Anda."
    >
      <OwnerCoffeeShopEditClient id={id} />
    </OwnerShell>
  );
}