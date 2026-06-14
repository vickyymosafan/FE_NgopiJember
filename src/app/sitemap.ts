import type { MetadataRoute } from "next";
import { MOCK_COFFEE_SHOPS } from "@/features/coffee-shop/constants/mock-coffee-shops";
import { DISTRICTS } from "@/constants/districts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ngopijember.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/map`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const coffeeShopPages: MetadataRoute.Sitemap = MOCK_COFFEE_SHOPS.map((shop) => ({
    url: `${SITE_URL}/coffee-shops/${shop.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const districtPages: MetadataRoute.Sitemap = DISTRICTS.filter(
    (district) => district.shopCount > 0,
  ).map((district) => ({
    url: `${SITE_URL}/search?district=${encodeURIComponent(district.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...coffeeShopPages, ...districtPages];
}