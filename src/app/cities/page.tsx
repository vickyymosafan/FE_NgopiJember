import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CitiesClient } from "@/features/city/components/cities-client";

export const metadata: Metadata = {
  title: "Jelajah Kota",
  description: "Temukan coffee shop di berbagai kota di Jawa Timur.",
};

export default function CitiesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Jelajah Kota
          </h1>
          <p className="text-sm text-muted-foreground">
            Pilih kota untuk melihat daftar coffee shop di sana.
          </p>
        </div>
        <CitiesClient />
      </main>
      <BottomNav />
    </div>
  );
}