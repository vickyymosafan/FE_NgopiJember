# Phase 1 — Directory & Discovery

> MVP: Fondasi platform direktori coffee shop dengan pencarian, filter, detail, dan peta.

## Tujuan

Membangun fondasi direktori yang memungkinkan pengguna:

1. Menemukan coffee shop di Jember berdasarkan nama, lokasi, atau fasilitas.
2. Melihat detail lengkap setiap coffee shop.
3. Menjelajah lewat peta interaktif.
4. Mendapatkan pengalaman mobile-first yang cepat.

Fase ini menetapkan arsitektur frontend (feature-driven, layered) dan pola integrasi API yang akan digunakan di seluruh fase selanjutnya.

## Status

| Kriteria | Status |
| --- | --- |
| 19 coffee shop terdata | ✅ |
| Search berfungsi | ✅ |
| Filter multi-kriteria | ✅ |
| Detail page | ✅ |
| Peta interaktif | ✅ |
| Responsive mobile-first | ✅ |

## Fitur Inti

### 1. Homepage

Beranda dirancang sebagai "gateway" dengan 5 section berurutan:

1. **Hero Search** — Search bar rounded dengan placeholder jelas dan pill pencarian populer.
2. **Popular Categories** — Pill horizontal: Wifi, Outdoor, 24 Hours, Study Friendly, Cheap, Premium.
3. **Trending Coffee Shops** — Grid 4 kolom berisi coffee shop dengan skor trending tertinggi (rating × review count).
4. **Explore by District** — Card grid distrik (Sumbersari, Patrang, Kaliwates, Ajung) dengan jumlah coffee shop.
5. **Map Preview** — Snapshot peta statis dengan CTA "Buka peta".

**Komponen terkait**: `HeroSection`, `CategorySection`, `TrendingSection`, `DistrictSection`, `MapPreviewSection`.

### 2. Halaman Pencarian (`/search`)

Layout split-screen di desktop (sidebar filter tetap di kiri + hasil di kanan) dan bottom-sheet filter di mobile.

**Filter yang didukung**:

| Filter | Tipe | Contoh |
| --- | --- | --- |
| Kata kunci pencarian | Teks bebas | "wifi kencang" |
| Kota | Dropdown (single) | "Jember" |
| Distrik | Pill (single) | "Sumbersari" |
| Buka 24 jam | Toggle | on/off |
| Rating minimal | Pill | 4.0+, 4.5+ |
| Kisaran harga | Pill | Rp1K-25K, Rp25K-50K |
| Fasilitas | Checklist | Wifi, Power Outlet, Indoor |
| Urutan | Select | Trending, Rating, Reviews, Terbaru |

**Active filter chips**: Setiap filter aktif ditampilkan sebagai chip di bawah search bar dengan tombol X untuk menghapus.

**Komponen terkait**: `SearchView`, `FilterPanel`, `FilterSheet` (mobile), `SortSelect`, `SearchResults`, `ActiveFilterChips`.

### 3. Detail Coffee Shop (`/coffee-shops/[slug]`)

Halaman detail menampilkan informasi lengkap dengan layout dua kolom:

**Kolom utama**:
- Galeri foto (grid dengan foto hero besar + 4 foto tambahan)
- Header: nama, badge "Terverifikasi", rating, jumlah ulasan
- Deskripsi (jika ada)
- Fasilitas (grid icon + label)
- Section "Ulasan Pengunjung" (ditambahkan di Phase 2)
- Coffee shop terdekat / rekomendasi

**Sidebar**:
- Status buka/tutup real-time
- Jam buka
- Alamat & distrik
- Telepon
- Kisaran harga
- Link Instagram & website
- Peta lokasi dengan tombol "Petunjuk arah"
- Tombol "Tersimpan?" untuk favorite

**Komponen terkait**: `CoffeeShopDetailView`, `DetailGallery`, `DetailInfoCard`, `DetailMap`, `FacilityList`.

### 4. Peta Interaktif (`/map`)

Halaman peta dengan layout split:

- **Desktop**: Daftar coffee shop di sidebar kiri (280px), peta di kanan.
- **Mobile**: Daftar di bawah (sheet), peta di atas.

Fitur:

- Tile OpenStreetMap
- Marker cluster (react-leaflet-cluster)
- Custom div-icon marker dengan pin aksen
- Marker aktif (dipilih) berwarna primary dengan scale 1.25x
- Fly-to animation saat item dipilih
- Popup dengan nama, alamat, dan link "Lihat detail"
- Filter pencarian & kota tersinkron dengan URL

**Komponen terkait**: `MapView`, `MapCanvas` (dynamic import, `ssr: false`), `MapListItem`.

### 5. Navigasi

**Desktop** (`Navbar`): Logo, search bar, link Jelajah/Peta/Distrik/Kota/Event/Komunitas, tombol Favorit, AuthNav (Masuk atau inisial user).

**Mobile** (`BottomNav`): 5 slot tetap di bawah layar — Home, Search, Map, Favorites, Profile (atau Masuk jika tamu).

## Alur Pengguna

### Tamu

1. Buka beranda → lihat trending & kategori populer.
2. Klik search bar → ketik "wifi" → submit → pindah ke `/search?q=wifi`.
3. Filter lebih lanjut dengan sidebar (desktop) atau tombol "Filter" (mobile).
4. Klik card → detail page → klik "Petunjuk arah" → Google Maps.
5. Jika ingin menyimpan atau mengulas → CTA "Masuk" muncul.

### Pengguna Mobile

1. BottomNav menyediakan akses cepat ke 5 area utama.
2. Filter muncul sebagai bottom-sheet yang bisa di-drag.
3. Peta full-screen dengan list tersembunyi di sheet bawah.

## Endpoint API

| Metode | Path | Deskripsi | Auth |
| --- | --- | --- | --- |
| GET | `/api/v1/coffee-shops` | Daftar dengan query (page, limit, search, cityId, district, rating, facility, openNow, priceRange, sort) | Tidak |
| GET | `/api/v1/coffee-shops/:slug` | Detail berdasarkan slug | Tidak |
| GET | `/api/v1/facilities` | Daftar fasilitas master | Tidak |

**Catatan**: Di mode mock, frontend memanggil route handler sendiri di `/api/*` yang membaca dari `MOCK_COFFEE_SHOPS`. Saat backend NestJS siap, hanya env `NEXT_PUBLIC_USE_MOCK=false` dan `NEXT_PUBLIC_API_URL` yang perlu diubah.

## Struktur Data

### Coffee Shop

| Field | Tipe | Keterangan |
| --- | --- | --- |
| id | UUID | Primary key |
| name | String | Nama coffee shop |
| slug | String | URL-friendly identifier (unique) |
| description | Text | Deskripsi (nullable) |
| address | Text | Alamat lengkap |
| district | String | Kecamatan |
| cityId | String | Referensi kota |
| latitude | Decimal | Koordinat (nullable) |
| longitude | Decimal | Koordinat (nullable) |
| phone | String | Telepon (nullable) |
| instagram | String | Handle Instagram (nullable) |
| website | String | URL website (nullable) |
| openingTime | Time | Jam buka HH:mm (nullable) |
| closingTime | Time | Jam tutup HH:mm (nullable) |
| isOpen24Hours | Boolean | Flag 24 jam |
| priceRange | Integer | 1-4 |
| rating | Decimal | Rating rata-rata |
| reviewCount | Integer | Jumlah ulasan |
| verified | Boolean | Diverifikasi admin/owner |
| ownerId | UUID | Pemilik yang telah mengklaim (nullable) |
| views | Integer | Jumlah tampilan |

### Facility

Master data fasilitas: `wifi`, `power-outlet`, `study-friendly`, `indoor`, `outdoor`, `parking`, `meeting-area`, `air-conditioning`, `large-capacity`, `modern-interior`, `grab-and-go`.

## Keputusan Arsitektur

### Feature-Driven Structure

Setiap fitur (coffee-shop, search, map, home) adalah modul self-contained. Ini memudahkan:

- Menambah fitur baru tanpa mengganggu modul lain.
- Menjalankan code splitting otomatis per route.
- Mengisolasi test per fitur.

### Server Components by Default

Halaman dan komponen yang tidak membutuhkan state atau browser API di-render sebagai Server Component untuk performance dan SEO. Client Component hanya digunakan saat:

- Event handler (onClick, onChange)
- State (useState, useReducer)
- Browser API (window, localStorage)
- Hooks (useEffect, useRef)

### API Client Layer

Semua panggilan ke backend melalui `lib/api-client.ts`. Komponen tidak pernah memanggil `fetch` langsung. Pola ini memungkinkan:

- Error handling konsisten.
- Token refresh terpusat.
- Caching layer di masa depan.

### Mock-First Development

Setiap service memiliki cabang `if (env.useMock)`. Ini memungkinkan:

- Development frontend tanpa menunggu backend siap.
- Demo tanpa infrastruktur backend.
- Unit test yang deterministik.

## Contoh Interaksi

### Pencarian Multi-Filter

Pengguna: "Saya butuh cafe di Sumbersari yang buka 24 jam dengan wifi."

Alur sistem:

1. SearchBar mengirim ke `/search?q=cafe`.
2. Pengguna memilih pill "Sumbersari", toggle "Buka 24 jam", checkbox "Wifi".
3. URL menjadi `/search?q=cafe&district=Sumbersari&openNow=true&facility=wifi`.
4. `useSearchFilters` menerjemahkan ke `CoffeeShopQuery`.
5. `useCoffeeShops(query)` memanggil route handler.
6. Route handler (mock) memfilter `MOCK_COFFEE_SHOPS`.
7. Hasil: "Perasa Coffee & Eatery", "Nugas Jember", "Kopi Samidjoyo" (3 hasil).

### Peta dengan Cluster

Pengguna membuka `/map` dan zoom out:

1. 19 marker dikelompokkan dalam 3 cluster:
   - Cluster "Jawa-Sumatra" (8 marker)
   - Cluster "Karimata" (4 marker)
   - Cluster "Mastrip" (4 marker)
2. Klik cluster → peta zoom in → cluster terpecah menjadi marker individu.
3. Klik marker → marker berubah warna primary, item list ter-highlight, fly-to koordinat marker.
4. Popup muncul dengan nama, alamat, dan link detail.

## Catatan Implementasi

- **Trending score**: `rating × reviewCount`. Coffee shop dengan rating 4.7 dan 3411 ulasan (Grand Cafe) mengalahkan rating 5.0 dengan 203 ulasan (Sumber Redjo).
- **Open now logic**: Fungsi `isOpenNow()` menangani shift overnight (contoh: 07:00 - 03:00).
- **Map SSR**: Leaflet mengakses `window`, sehingga `MapCanvas` di-import via `next/dynamic` dengan `ssr: false`.
- **Koordinat mock**: 19 koordinat perkiraan di area Sumbersari (-8.16 hingga -8.19, 113.70 hingga 113.72).

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Coffee shop terdata | 100 | 19 (Sumbersari saja, kota lain 0) |
| First Contentful Paint | < 1.5s | ~1.2s (Next.js static prerender) |
| Mobile responsive | 100% halaman | ✅ |
| Aksesibilitas keyboard | Tab-order logis | ✅ |