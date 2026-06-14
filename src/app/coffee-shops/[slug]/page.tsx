import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { CoffeeShopDetailView } from "@/features/coffee-shop/components/coffee-shop-detail-view";
import { getCoffeeShopBySlug } from "@/features/coffee-shop/services/coffee-shop.service";
import { ApiError } from "@/types/api";
import { CoffeeShopJsonLd } from "@/features/seo/components/coffee-shop-json-ld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ngopijember.id";
  try {
    const shop = await getCoffeeShopBySlug(slug);
    const description =
      shop.description ??
      `${shop.name} di ${shop.address}, Kec. ${shop.district}. Rating ${shop.rating}.`;
    const url = `${siteUrl}/coffee-shops/${slug}`;
    return {
      title: shop.name,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        url,
        title: `${shop.name} · NgopiJember`,
        description,
        locale: "id_ID",
        images: shop.imageUrl
          ? [{ url: shop.imageUrl, width: 1200, height: 630, alt: shop.name }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${shop.name} · NgopiJember`,
        description,
      },
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
  const shop = await getCoffeeShopBySlug(slug);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <CoffeeShopDetailView slug={slug} />
      </main>
      <BottomNav />
      <CoffeeShopJsonLd shop={shop} />
    </div>
  );
}