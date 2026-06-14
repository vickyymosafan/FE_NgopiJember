import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { SearchView } from "@/features/search/components/search-view";

export const metadata: Metadata = {
  title: "Jelajah Coffee Shop",
  description: "Cari dan filter coffee shop di Jember.",
};

export default function SearchPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={null}>
          <SearchView />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}