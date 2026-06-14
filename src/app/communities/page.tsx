import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CommunitiesClient } from "@/features/community/components/communities-client";

export const metadata: Metadata = {
  title: "Komunitas Kopi",
  description: "Komunitas pecinta kopi di Jawa Timur.",
};

export default function CommunitiesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Komunitas Kopi
          </h1>
          <p className="text-sm text-muted-foreground">
            Bergabung dengan komunitas pecinta kopi di kotamu.
          </p>
        </div>
        <CommunitiesClient />
      </main>
      <BottomNav />
    </div>
  );
}