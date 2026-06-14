import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { FavoritesClient } from "@/features/favorite/components/favorites-client";

export const metadata: Metadata = {
  title: "Favorit",
  description: "Daftar coffee shop favorit Anda.",
};

export default function FavoritesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 pb-24 md:pb-0">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Favorit
          </h1>
          <p className="text-sm text-muted-foreground">
            Coffee shop yang Anda simpan untuk dikunjungi nanti.
          </p>
        </div>
        <FavoritesClient />
      </main>
      <BottomNav />
    </div>
  );
}