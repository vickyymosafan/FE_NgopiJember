import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { TrendingClient } from "@/features/growth/components/trending-client";

export const metadata: Metadata = {
  title: "Trending",
  description: "Coffee shop trending dan pencarian populer di NgopiJember.",
};

export default function TrendingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[1280px] flex-1 space-y-8 px-6 py-10 pb-24 md:pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Trending di NgopiJember
          </h1>
          <p className="text-sm text-muted-foreground">
            Coffee shop paling banyak dikunjungi dan pencarian populer minggu
            ini.
          </p>
        </div>
        <TrendingClient />
      </main>
      <BottomNav />
    </div>
  );
}