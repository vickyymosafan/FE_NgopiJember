import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ngopijember.id";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NgopiJember · Discover Every Coffee Shop in Jember",
    template: "%s | NgopiJember",
  },
  description:
    "Platform terlengkap untuk mencari, menjelajahi, dan menemukan coffee shop di Jember. Cari berdasarkan lokasi, fasilitas, dan suasana.",
  keywords: [
    "coffee shop jember",
    "ngopi jember",
    "cafe jember",
    "sumbersari coffee",
    "kopi jember",
    "direktori coffee shop",
  ],
  authors: [{ name: "NgopiJember" }],
  creator: "NgopiJember",
  publisher: "NgopiJember",
  applicationName: "NgopiJember",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "NgopiJember",
    title: "NgopiJember · Discover Every Coffee Shop in Jember",
    description:
      "Platform terlengkap untuk mencari coffee shop di Jember berdasarkan lokasi, fasilitas, dan suasana.",
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: "NgopiJember" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NgopiJember · Discover Every Coffee Shop in Jember",
    description: "Temukan coffee shop terbaik di Jember.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};