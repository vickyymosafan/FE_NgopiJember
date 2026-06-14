import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { OwnerShell } from "@/features/owner/components/owner-shell";
import { AnalyticsCards } from "@/features/owner/components/analytics-cards";
import { OwnerCoffeeShopTable } from "@/features/owner/components/owner-coffee-shop-table";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  description: "Dashboard pemilik coffee shop di NgopiJember.",
};

export default function OwnerDashboardPage() {
  return (
    <OwnerShell
      title="Owner Dashboard"
      description="Ringkasan performa coffee shop milik Anda."
      action={
        <Link
          href="/owner/promotions/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Store className="size-4" aria-hidden="true" />
          Promosi baru
        </Link>
      }
    >
      <AnalyticsCards />
      <OwnerCoffeeShopTable />
    </OwnerShell>
  );
}