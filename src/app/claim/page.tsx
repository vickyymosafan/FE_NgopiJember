import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ClaimForm } from "@/features/claim/components/claim-form";

export const metadata: Metadata = {
  title: "Ajukan Klaim Coffee Shop",
  description: "Ajukan klaim kepemilikan atas coffee shop di NgopiJember.",
};

export default function ClaimPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 pb-24 md:pb-0">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Ajukan Klaim Coffee Shop
          </h1>
          <p className="text-sm text-muted-foreground">
            Isi formulir berikut untuk mengklaim kepemilikan coffee shop. Tim
            admin akan meninjau dalam 1-3 hari kerja.
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6">
          <Suspense fallback={null}>
            <ClaimForm />
          </Suspense>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}