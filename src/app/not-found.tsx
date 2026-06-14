import type { Metadata } from "next";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 pb-20 md:pb-0">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Coffee className="size-8" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-h2">
            404
          </h1>
          <p className="text-muted-foreground">
            Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Kembali ke beranda
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Jelajah coffee shop
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}