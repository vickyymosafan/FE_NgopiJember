import type { CoffeeShopDetail } from "@/features/coffee-shop/types/coffee-shop.types";

interface CoffeeShopJsonLdProps {
  shop: CoffeeShopDetail;
}

export function CoffeeShopJsonLd({ shop }: CoffeeShopJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ngopijember.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: shop.name,
    description:
      shop.description ??
      `${shop.name} di ${shop.address}, Kec. ${shop.district}.`,
    url: `${siteUrl}/coffee-shops/${shop.slug}`,
    image: shop.gallery.length > 0 ? shop.gallery : shop.imageUrl ? [shop.imageUrl] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: "Jember",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    geo:
      shop.latitude !== null && shop.longitude !== null
        ? {
            "@type": "GeoCoordinates",
            latitude: shop.latitude,
            longitude: shop.longitude,
          }
        : undefined,
    telephone: shop.phone ?? undefined,
    priceRange: shop.priceLabel,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: shop.rating,
      reviewCount: shop.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    openingHours: shop.isOpen24Hours
      ? "Mo-Su 00:00-24:00"
      : shop.openingTime && shop.closingTime
      ? `Mo-Su ${shop.openingTime}-${shop.closingTime}`
      : undefined,
    sameAs: [
      shop.instagram
        ? `https://instagram.com/${shop.instagram.replace("@", "")}`
        : null,
      shop.website,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}