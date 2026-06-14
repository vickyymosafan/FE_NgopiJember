import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CityDetailClient } from "@/features/city/components/city-detail-client";
import { getCity } from "@/features/city/services/city.service";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const city = await getCity(slug);
    return {
      title: `Coffee Shop di ${city.name}`,
      description: city.description,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { title: "Kota tidak ditemukan" };
    }
    return { title: "Detail Kota" };
  }
}

export default async function CityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10 pb-24 md:pb-0"
      >
        <CityDetailClient slug={slug} />
      </main>
      <BottomNav />
    </div>
  );
}