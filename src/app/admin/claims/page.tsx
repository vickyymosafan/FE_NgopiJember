import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { AdminClaimList } from "@/features/claim/components/admin-claim-list";

export const metadata: Metadata = {
  title: "Klaim Coffee Shop",
  description: "Tinjau klaim kepemilikan coffee shop.",
};

export default function AdminClaimsPage() {
  return (
    <AdminShell
      title="Klaim Coffee Shop"
      description="Tinjau dan putuskan klaim kepemilikan yang diajukan pengguna."
    >
      <AdminClaimList />
    </AdminShell>
  );
}