import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { AdminDashboardClient } from "@/features/admin/components/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin",
  description: "Dashboard admin NgopiJember.",
};

export default function AdminPage() {
  return (
    <AdminShell
      title="Dashboard Admin"
      description="Kelola daftar coffee shop yang tampil di platform."
      action={
        <Link
          href="/admin/coffee-shops/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Tambah
        </Link>
      }
    >
      <AdminDashboardClient />
    </AdminShell>
  );
}