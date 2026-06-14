import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ClaimList } from "@/features/claim/components/claim-list";

export const metadata: Metadata = {
  title: "Klaim Saya",
  description: "Daftar klaim coffee shop yang pernah Anda ajukan.",
};

export default function ClaimsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 pb-24 md:pb-0">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
              Klaim Saya
            </h1>
            <p className="text-sm text-muted-foreground">
              Pantau status klaim kepemilikan coffee shop Anda.
            </p>
          </div>
          <Link
            href="/claim"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden="true" />
            Klaim baru
          </Link>
        </div>
        <Suspense fallback={null}>
          <ClaimList />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}