import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { EventsClient } from "@/features/event/components/events-client";

export const metadata: Metadata = {
  title: "Event Kopi",
  description: "Jadwal event kopi di Jawa Timur.",
};

export default function EventsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-h3">
            Event Kopi
          </h1>
          <p className="text-sm text-muted-foreground">
            Festival, kompetisi, dan meetup pecinta kopi.
          </p>
        </div>
        <EventsClient />
      </main>
      <BottomNav />
    </div>
  );
}