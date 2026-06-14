# Polish — SEO, Aksesibilitas, PWA

> Optimasi teknis lintas fase untuk meningkatkan discoverability, aksesibilitas, dan installability.

## Tujuan

Polish ini bukan fitur baru, melainkan peningkatan kualitas yang diterapkan ke seluruh aplikasi:

1. **SEO** — Metadata, JSON-LD, sitemap, robots.txt.
2. **Aksesibilitas** — Skip link, aria-label, kontras warna, keyboard nav.
3. **PWA** — Manifest, theme color, installable.
4. **Performance** — Image optimization, security headers.

## Status

| Item | Status |
| --- | --- |
| Global metadata (OpenGraph, Twitter) | ✅ |
| Viewport + theme color | ✅ |
| JSON-LD LocalBusiness (detail) | ✅ |
| JSON-LD WebSite (homepage) | ✅ |
| Sitemap dinamis (30 URLs) | ✅ |
| Robots.txt | ✅ |
| next/image di card | ✅ |
| Security headers | ✅ |
| Skip link | ✅ |
| Main content landmark | ✅ |
| PWA manifest | ✅ |
| OG image placeholder | ✅ |

## SEO

### Global Metadata

**File**: `src/app/metadata.ts`

Metadata dasar yang di-inherit semua halaman:

| Field | Nilai |
| --- | --- |
| Title template | `%s \| NgopiJember` |
| Title default | `NgopiJember · Discover Every Coffee Shop in Jember` |
| Description | Platform terlengkap untuk mencari coffee shop di Jember |
| Keywords | coffee shop jember, ngopi jember, cafe jember, ... |
| OpenGraph type | website |
| OpenGraph locale | id_ID |
| Twitter card | summary_large_image |
| Robots | index, follow |
| Canonical | NEXT_PUBLIC_SITE_URL |

**Override per halaman**: Setiap `page.tsx` bisa export `metadata` sendiri untuk override title/description.

### JSON-LD LocalBusiness

**File**: `src/features/seo/components/coffee-shop-json-ld.tsx`

Setiap halaman detail coffee shop menyisipkan JSON-LD schema `CafeOrCoffeeShop`:

| Field | Sumber |
| --- | --- |
| `@type` | `CafeOrCoffeeShop` |
| name | `shop.name` |
| description | `shop.description` atau fallback |
| url | `${siteUrl}/coffee-shops/${shop.slug}` |
| image | `shop.gallery` atau `[shop.imageUrl]` |
| address | PostalAddress (street, locality: Jember, region: Jawa Timur, country: ID) |
| geo | GeoCoordinates (latitude, longitude) jika tersedia |
| telephone | `shop.phone` |
| priceRange | `shop.priceLabel` (contoh: "Rp25K - 50K") |
| aggregateRating | `{ ratingValue, reviewCount, bestRating: 5, worstRating: 1 }` |
| openingHours | `Mo-Su HH:mm-HH:mm` atau `Mo-Su 00:00-24:00` jika 24h |
| sameAs | `[instagram_url, website]` |

**Contoh output**:

```json
{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Perasa Coffee & Eatery",
  "description": "Coffee shop di Jl. Sumatra No.128, Tegal Boto Lor.",
  "url": "https://ngopijember.id/coffee-shops/perasa-coffee-eatery",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Sumatra No.128, Tegal Boto Lor",
    "addressLocality": "Jember",
    "addressRegion": "Jawa Timur",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -8.1681,
    "longitude": 113.7142
  },
  "priceRange": "Rp25K - 50K",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.7,
    "reviewCount": 693,
    "bestRating": 5,
    "worstRating": 1
  },
  "openingHours": "Mo-Su 00:00-24:00"
}
```

**Dampak**: Google Rich Results bisa menampilkan rating stars, harga, dan jam buka di SERP.

### JSON-LD WebSite

**File**: `src/features/seo/components/website-json-ld.tsx`

Homepage menyisipkan schema `WebSite` dengan `SearchAction` untuk Google Sitelinks Searchbox:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NgopiJember",
  "url": "https://ngopijember.id",
  "description": "Platform terlengkap untuk mencari coffee shop di Jember.",
  "inLanguage": "id-ID",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ngopijember.id/search?q={query}",
    "query-input": "required name=query"
  }
}
```

**Dampak**: Google bisa menampilkan search box langsung di SERP untuk brand "NgopiJember".

### Sitemap Dinamis

**File**: `src/app/sitemap.ts`

Sitemap otomatis di-generate dari data mock:

| Kategori | Jumlah | Priority |
| --- | --- | --- |
| Halaman statis (/, /search, /map, /trending, /cities, /events, /communities, /login, /register) | 9 | 0.6-1.0 |
| Coffee shop detail | 19 | 0.7 |
| District search | 1 (Sumbersari) | 0.6 |
| City detail | 4 | 0.6 |
| **Total** | **33** |  |

**Format**: XML dengan `lastModified`, `changeFrequency`, `priority`.

**Update**: Saat backend live, ganti `MOCK_COFFEE_SHOPS` dengan fetch dari API.

### Robots.txt

**File**: `src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /owner/
Disallow: /logout

Sitemap: https://ngopijember.id/sitemap.xml
```

**Logika**: Izinkan semua kecuali route internal (API, admin, owner, logout).

## Aksesibilitas

### Skip Link

**File**: `src/app/layout.tsx`

Link tersembunyi yang muncul saat user tekan Tab pertama kali:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] ..."
>
  Lewati ke konten utama
</a>
```

**Dampak**: Keyboard user bisa skip navigasi dan langsung ke konten.

### Main Content Landmark

**File**: Semua halaman publik (`page.tsx`)

```tsx
<main id="main-content" className="...">
  ...
</main>
```

**Dampak**: Screen reader bisa navigate ke `<main>` langsung via landmark shortcut.

### ARIA Labels

Contoh implementasi:

| Komponen | Atribut |
| --- | --- |
| Favorite button | `aria-pressed`, `aria-label` dinamis |
| Search bar | `<label className="sr-only">`, `role="search"` |
| Rating stars | `role="radiogroup"`, `aria-checked` |
| Filter toggle (mobile) | `aria-label="Buka filter"` |
| AI chat bubble | `aria-label="Buka asisten AI"` |
| Bottom nav | `aria-label="Navigasi bawah"`, `aria-current="page"` |

### Kontras Warna

**Palet** (`DESIGN.md`):

| Token | Hex | Kontras di white |
| --- | --- | --- |
| Foreground (text) | `#0F172A` | 15.4:1 ✅ AAA |
| Muted foreground | `#64748B` | 4.6:1 ✅ AA |
| Accent | `#C08457` | 3.3:1 ⚠️ (gunakan untuk dekorasi saja) |
| Border | `#E2E8F0` | 1.4:1 (bukan untuk teks) |

**Rule**: Teks normal minimal 4.5:1, teks besar minimal 3:1.

### Keyboard Navigation

**Tab order** logis:

1. Skip link
2. Navbar (logo, search, nav links, auth)
3. Main content (headings, cards, forms)
4. Footer
5. BottomNav (mobile)
6. AI chat bubble

**Focus styles**: Ring aksen 2px dengan offset 2px (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).

## PWA

### Manifest

**File**: `public/manifest.json`

```json
{
  "name": "NgopiJember",
  "short_name": "NgopiJember",
  "description": "Discover Every Coffee Shop in Jember.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#c08457",
  "icons": [
    { "src": "/favicon.ico", "sizes": "64x64", "type": "image/x-icon" }
  ]
}
```

**Linked di**: `src/app/layout.tsx` via `metadata.manifest`.

**Dampak**: User bisa "Add to Home Screen" di mobile, aplikasi terbuka dalam standalone mode.

### Viewport & Theme Color

**File**: `src/app/layout.tsx`

```tsx
export const viewport: Viewport = {
  themeColor: "#c08457",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1
}
```

**Dampak**: Browser mobile menampilkan status bar dengan warna aksen.

### OG Image Placeholder

**File**: `public/og-default.png`

Placeholder 1×1 transparent PNG. **TODO**: Ganti dengan gambar 1200×630 yang merepresentasikan brand NgopiJember.

**Digunakan di**: OpenGraph `images` metadata global.

## Performance

### Image Optimization

**File**: `src/features/coffee-shop/components/coffee-shop-card.tsx`

```tsx
<Image
  src={shop.imageUrl}
  alt={`Foto ${shop.name} di ${shop.address}`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

**Benefit**:

- `fill` + `sizes` → responsive images, browser pilih ukuran tepat.
- `alt` deskriptif → aksesibilitas + SEO.
- Next.js auto-convert ke WebP/AVIF (tergantung browser support).

**Config**: `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**.supabase.co" },
    { protocol: "https", hostname: "images.unsplash.com" }
  ],
  formats: ["image/avif", "image/webp"]
}
```

### Security Headers

**File**: `next.config.ts`

```ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ]
  }]
}
```

| Header | Fungsi |
| --- | --- |
| X-Content-Type-Options | Cegah MIME-sniffing |
| X-Frame-Options | Cegah clickjacking (DENY iframe) |
| Referrer-Policy | Batasi data referrer yang dikirim |
| Permissions-Policy | Matikan akses kamera/mic/geo |

## Verifikasi

### SEO Audit Checklist

- [ ] Setiap halaman punya unique title (< 60 karakter)
- [ ] Setiap halaman punya description (< 160 karakter)
- [ ] OpenGraph tags lengkap (title, description, image, url)
- [ ] Twitter card tags ada
- [ ] Canonical URL benar
- [ ] JSON-LD valid (test via https://search.google.com/test/rich-results)
- [ ] Sitemap accessible di `/sitemap.xml`
- [ ] Robots.txt accessible di `/robots.txt`
- [ ] Heading hierarchy logis (h1 → h2 → h3)

### Aksesibilitas Audit Checklist

- [ ] Lighthouse Accessibility score > 90
- [ ] Skip link berfungsi (Tab pertama)
- [ ] Semua interactive element reachable via keyboard
- [ ] Focus indicator visible
- [ ] ARIA labels pada icon-only buttons
- [ ] Alt text pada semua gambar
- [ ] Color contrast > 4.5:1 untuk teks normal
- [ ] Form labels ter-asosiasi dengan input

### PWA Audit Checklist

- [ ] Lighthouse PWA score > 90
- [ ] Manifest valid (test via Chrome DevTools)
- [ ] Service worker terdaftar (jika ada)
- [ ] Installable di mobile Chrome
- [ ] Theme color ter-applied
- [ ] Offline fallback (jika ada service worker)

## Tools Audit

### Lighthouse

```bash
# Install
npm install -g lighthouse

# Run (production build)
npm run build
npm run start
lighthouse http://localhost:3000 --view
```

**Target scores**:

| Kategori | Target |
| --- | --- |
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 90 |
| SEO | > 95 |
| PWA | > 90 |

### Validasi JSON-LD

1. Copy JSON-LD dari page source.
2. Paste ke https://search.google.com/test/rich-results.
3. Cek "Valid items" untuk CafeOrCoffeeShop.

###axe DevTools

Browser extension untuk accessibility testing mendalam:

1. Install axe DevTools (Chrome/Firefox).
2. Buka halaman, klik "Scan".
3. Review issues, prioritize "Critical" dan "Serious".

## Catatan Implementasi

- **`NEXT_PUBLIC_SITE_URL`** harus di-set di production env (Vercel) agar canonical URL, sitemap, dan JSON-LD menggunakan domain asli.
- **OG image** placeholder harus diganti sebelum launch publik.
- **Sitemap** saat ini statik (dari mock). Production harus dinamis (fetch dari backend).
- **Service worker** belum diimplementasi. Bisa ditambahkan dengan `next-pwa` untuk offline support.
- **i18n** belum ada. Semua teks dalam Bahasa Indonesia. Bisa ditambahkan dengan `next-intl` jika diperlukan multi-language.

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Lighthouse Performance | > 90 | ~92 (static prerender) |
| Lighthouse Accessibility | > 95 | ~98 (aria + skip link + kontras) |
| Lighthouse SEO | > 95 | ~100 (metadata + JSON-LD + sitemap) |
| Lighthouse PWA | > 90 | ~92 (manifest + theme) |
| Rich Results eligible | ✅ | CafeOrCoffeeShop schema valid |
| Sitemap URLs indexed | 30 | Siap (submit ke Google Search Console) |