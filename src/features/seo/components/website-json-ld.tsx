export function WebsiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ngopijember.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NgopiJember",
    url: siteUrl,
    description: "Platform terlengkap untuk mencari coffee shop di Jember.",
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={query}`,
      "query-input": "required name=query",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}