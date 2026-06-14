import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { OwnerShell } from "@/features/owner/components/owner-shell";
import { OwnerPromotionList } from "@/features/owner/components/owner-promotion-list";

export const metadata: Metadata = {
  title: "Promosi",
  description: "Kelola promosi coffee shop Anda.",
};

export default function OwnerPromotionsPage() {
  return (
    <OwnerShell
      title="Promosi"
      description="Buat dan kelola promosi untuk coffee shop Anda."
      action={
        <Link
          href="/owner/promotions/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Promosi baru
        </Link>
      }
    >
      <OwnerPromotionList />
    </OwnerShell>
  );
}