import type { Metadata } from "next";
import { OwnerShell } from "@/features/owner/components/owner-shell";
import { PromotionForm } from "@/features/owner/components/promotion-form";

export const metadata: Metadata = {
  title: "Buat Promosi Baru",
  description: "Buat promosi baru untuk coffee shop Anda.",
};

export default function NewPromotionPage() {
  return (
    <OwnerShell
      title="Buat Promosi Baru"
      description="Isi detail promosi untuk coffee shop Anda."
    >
      <div className="rounded-card border border-border bg-surface p-6">
        <PromotionForm />
      </div>
    </OwnerShell>
  );
}