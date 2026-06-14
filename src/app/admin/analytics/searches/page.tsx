import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { SearchAnalyticsClient } from "@/features/growth/components/search-analytics-client";

export const metadata: Metadata = {
  title: "Search Analytics",
  description: "Analitik pencarian di NgopiJember.",
};

export default function AdminSearchAnalyticsPage() {
  return (
    <AdminShell
      title="Search Analytics"
      description="Pantau apa yang dicari pengguna untuk memahami kebutuhan mereka."
    >
      <SearchAnalyticsClient />
    </AdminShell>
  );
}