import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { MapView } from "@/features/map/components/map-view";

export const metadata: Metadata = {
  title: "Peta Coffee Shop",
  description: "Jelajahi sebaran coffee shop di Jember lewat peta interaktif.",
};

export default function MapPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={null}>
          <MapView />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}