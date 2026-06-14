import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { HeroSection } from "@/features/home/components/hero-section";
import { CategorySection } from "@/features/home/components/category-section";
import { TrendingSection } from "@/features/home/components/trending-section";
import { DistrictSection } from "@/features/home/components/district-section";
import { MapPreviewSection } from "@/features/home/components/map-preview-section";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <HeroSection />
        <CategorySection />
        <TrendingSection />
        <DistrictSection />
        <MapPreviewSection />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
