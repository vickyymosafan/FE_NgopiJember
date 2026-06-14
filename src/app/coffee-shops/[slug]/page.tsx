import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CoffeeShopDetailView } from "@/features/coffee-shop/components/coffee-shop-detail-view";
import { getCoffeeShopBySlug } from "@/features/coffee-shop/services/coffee-shop.service";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const shop = await getCoffeeShopBySlug(slug);
    return {
      title: shop.name,
      description:
        shop.description ??
        `${shop.name} di ${shop.address}, Kec. ${shop.district}. Rating ${shop.rating}.`,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { title: "Coffee shop tidak ditemukan" };
    }
    return { title: "Detail Coffee Shop" };
  }
}

export default async function CoffeeShopDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <CoffeeShopDetailView slug={slug} />
      </main>
      <BottomNav />
    </div>
  );
}