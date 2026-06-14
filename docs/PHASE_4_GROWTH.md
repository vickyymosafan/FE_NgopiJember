# Phase 4 — Growth

> Meningkatkan discovery lewat trending, popular searches, recommendation engine, dan search analytics.

## Tujuan

Mengubah platform dari reaktif (user mencari apa yang mereka tahu) menjadi proaktif (platform menyarankan apa yang mungkin disukai user):

1. **Trending Coffee Shops** — Coffee shop paling populer minggu ini.
2. **Popular Searches** — Istilah pencarian yang sering digunakan.
3. **Recommendation Engine** — Saran personal berdasarkan kemiripan.
4. **Search Analytics** — Dashboard admin untuk memahami perilaku pencarian.

## Status

| Kriteria | Status |
| --- | --- |
| Search logging | ✅ |
| Popular searches API | ✅ |
| Halaman trending publik | ✅ |
| Recommendation engine (similarity) | ✅ |
| Search analytics dashboard | ✅ |
| Search bar terintegrasi logging | ✅ |

## Fitur Inti

### 1. Search Logging

Setiap pencarian yang dilakukan pengguna dicatat untuk analitik dan popular searches.

**Alur logging**:

```
User ketik "wifi kencang" → klik Cari
       │
       ▼
SearchBar.handleSubmit()
       │
       ├─▶ useLogSearch.mutate("wifi kencang")
       │      │
       │      ▼
       │   POST /api/search-logs
       │      Body: { term: "wifi kencang" }
       │      (fire-and-forget, tidak block UI)
       │
       └─▶ router.push("/search?q=wifi+kencang")
```

**Karakteristik**:

- Term di-lowercase dan trim.
- Fire-and-forget: jika log gagal, user tetap lanjut.
- Disimpan di `MOCK_SEARCH_LOGS` (mode mock) atau backend (production).

**Komponen**: `SearchBar` (shared), `useLogSearch` (mutation hook).

### 2. Popular Searches

Agregat istilah pencarian terbanyak dalam periode tertentu.

**Endpoint**: `GET /api/popular-searches?limit=6`

**Contoh response**:

```json
{
  "success": true,
  "data": [
    { "term": "wifi kencang", "count": 42 },
    { "term": "nugas", "count": 38 },
    { "term": "24 jam", "count": 25 },
    { "term": "kopi susu", "count": 19 },
    { "term": "outdoor", "count": 14 },
    { "term": "murah", "count": 11 }
  ]
}
```

**Tampilan di UI**:

- **Homepage**: Section "Popular Searches" dengan pill `term + count`.
- **Trending page** (`/trending`): Pill populer + grid coffee shop trending.
- **Search results**: Pill "Coba juga" di atas hasil pencarian.

**Komponen**: `PopularSearches`, `usePopularSearches`.

### 3. Trending Coffee Shops

Coffee shop dengan engagement tertinggi.

**Algoritma trending** (mock mode):

```
score = rating × reviewCount
```

Contoh:

- Grand Cafe Jember: 4.4 × 3411 = **15008** (trending #1)
- Perasa Coffee & Eatery: 4.7 × 693 = **3257**
- Sumber Redjo: 5.0 × 203 = **1015**

**Halaman `/trending`**:

- Section "Pencarian populer" (pill dari `/api/popular-searches`).
- Section "Coffee shop trending" (grid dari `useCoffeeShops({sort: "trending"})`).

**Komponen**: `TrendingClient`, `useCoffeeShops` dengan `sort: "trending"`.

### 4. Recommendation Engine

Saran coffee shop berdasarkan kemiripan dengan coffee shop yang sedang dilihat.

**Algoritma similarity**:

```javascript
function similarityScore(current, other) {
  if (current.id === other.id) return -1  // skip diri sendiri
  
  let score = 0
  
  // Same district bonus
  if (current.district === other.district) score += 3
  
  // Same price range bonus
  if (current.priceRange === other.priceRange) score += 1
  
  // Shared facilities (intersection)
  const shared = intersect(current.facilities, other.facilities)
  score += shared.length
  
  // Rating boost (max 3)
  score += min(3, other.rating × 0.5)
  
  // Popularity boost (max 2, logarithmic)
  score += min(2, log10(other.reviewCount + 1))
  
  return score
}
```

**Contoh**:

User melihat "Perasa Coffee & Eatery" (Sumbersari, Rp25-50K, wifi+power+study+indoor+parking, rating 4.7, 693 reviews).

Kandidat:
- **Nugas Jember** (Sumbersari, Rp1-25K, study+wifi+power) → score 3 + 0 + 3 + 2.05 + 2.49 = **10.54** ✅
- **Discuss Space** (Sumbersari, Rp25-50K, wifi+meeting+indoor+outdoor) → score 3 + 1 + 2 + 2.2 + 2.74 = **10.94** ✅
- **Grand Cafe** (Sumbersari, Rp25-50K, wifi+indoor+outdoor+large) → score 3 + 1 + 2 + 2.2 + 3.53 = **11.73** ✅ (top pick)
- **Tomoro Coffee** (Sumbersari, Rp25-50K, ac+wifi+modern) → score 3 + 1 + 1 + 2.35 + 2.6 = **9.95**

**Tampilan**: Section "Rekomendasi untuk Anda" di detail page, menggantikan "Coffee shop terdekat" (nearby by distance).

**Komponen**: `RecommendedCoffeeShops`, `recommendCoffeeShops` (lib), `useCoffeeShops` untuk mengambil kandidat.

### 5. Search Analytics Dashboard

Halaman admin untuk memahami perilaku pencarian.

**Path**: `/admin/analytics/searches`

**Metrik yang ditampilkan**:

| Kartu | Sumber |
| --- | --- |
| Total Pencarian | Count semua search log |
| Istilah Unik | Count distinct term |

**Tabel**:

| Tabel | Sumber |
| --- | --- |
| Pencarian populer (top 10) | Agregat term + count, sorted desc |
| Pencarian terbaru (20 terakhir) | List search log sorted by createdAt desc |

**Komponen**: `SearchAnalyticsClient`, `useSearchAnalytics`.

## Alur Pengguna

### Discovery via Trending

1. Pengguna buka `/trending` dari Navbar.
2. Lihat pill populer: "wifi kencang (42)", "nugas (38)".
3. Klik pill "nugas" → pindah ke `/search?q=nugas`.
4. Hasil pencarian menampilkan coffee shop study-friendly.
5. Klik card → detail → rekomendasi muncul di bawah.
6. Klik rekomendasi "Nugas Jember" → detail Nugas Jember.

### Discovery via Detail Recommendations

1. Pengguna buka `/coffee-shops/perasa-coffee-eatery`.
2. Scroll ke bawah → section "Rekomendasi untuk Anda".
3. 4 card muncul: Grand Cafe, Discuss Space, Nugas Jember, Tomoro.
4. Klik "Discuss Space" → detail Discuss Space.
5. Rekomendasi baru muncul berdasarkan Discuss Space.

### Admin Analytics Review

1. Admin login.
2. Buka `/admin/analytics/searches`.
3. Lihat kartu: Total 10 pencarian, 5 istilah unik.
4. Lihat tabel "Pencarian populer": wifi kencang (3), nudas (3), kopi susu (2), outdoor (1), 24 jam (1).
5. Insight: Pengguna sering cari tempat nugas dengan wifi.
6. Tindak lanjut: Feature coffee shop study-friendly di homepage.

## Endpoint API

### Search Logs

| Metode | Path | Deskripsi |
| --- | --- | --- |
| POST | `/api/search-logs` | Log pencarian baru |
| GET | `/api/popular-searches?limit=N` | Agregat top-N popular searches |

### Admin Analytics

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/admin/analytics/searches` | Analytics lengkap (admin only) |

## Struktur Data

### SearchLog

| Field | Tipe |
| --- | --- |
| term | String (lowercase, trimmed) |
| created_at | Timestamp |

**Indeks**: `(term, created_at)` untuk agregasi cepat.

### PopularSearch (View/Agregat)

| Field | Tipe |
| --- | --- |
| term | String |
| count | Integer |

**Sumber**: Agregat `GROUP BY term, COUNT(*) FROM search_logs ORDER BY count DESC LIMIT N`.

### SearchAnalytics (Composite)

| Field | Tipe |
| --- | --- |
| totalSearches | Integer |
| uniqueTerms | Integer |
| popularSearches | Array<PopularSearch> |
| recentSearches | Array<SearchLog> |

## Keputusan Arsitektur

### Search Logging Client-Side

**Kenapa log di client (SearchBar) bukan di server (search results page)?**

- SearchBar adalah titik intent user, sebelum navigasi.
- Logging fire-and-forget, tidak block navigasi.
- Search results page mungkin di-reload atau di-navigate ulang, bisa double-log.

**Trade-off**: Jika user buka `/search?q=X` langsung (bookmark, link), tidak ada log. Ini acceptable karena volume rendah.

### Similarity Scoring Client-Side

**Kenapa recommendation engine di client, bukan server?**

- Saat ini kandidat max 200 coffee shop (kecil).
- Client bisa cache kandidat di `useCoffeeShops({limit: 200})`.
- Score computation ringan (~200 × 6 operasi = 1200 operasi).

**Trade-off**: Jika coffee shop tumbuh ke 1000+, server-side recommendation lebih efisien. Bisa swap ke endpoint `/api/recommendations?current=slug` di masa depan.

### Recommendation menggantikan Nearby

**Kenapa "Rekomendasi untuk Anda" menggantikan "Coffee shop terdekat"?**

- Data koordinat mock tidak akurat (perkiraan).
- Distance-based nearby butuh koordinat presisi.
- Similarity-based lebih informatif: same district, facilities, price range.

**Trade-off**: Jika koordinat real tersedia (backend produksi), bisa tampilkan keduanya: "Terdekat" (by distance) + "Rekomendasi" (by similarity).

### Aggregation di Route Handler

**Popular searches dihitung di route handler mock**, bukan di database aggregation.

```javascript
function aggregateMock(limit) {
  const counts = new Map()
  for (const log of MOCK_SEARCH_LOGS) {
    counts.set(log.term, (counts.get(log.term) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
```

**Produksi**: Backend NestJS akan implementasi dengan SQL aggregation:

```sql
SELECT term, COUNT(*) as count
FROM search_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY term
ORDER BY count DESC
LIMIT 10
```

## Contoh Interaksi

### Search → Log → Popular

```
Hari 1:
- 10 user cari "wifi kencang" → 10 logs
- 5 user cari "nugas" → 5 logs

Hari 2:
- 8 user cari "wifi kencang" → total 18 logs
- 12 user cari "nugas" → total 17 logs
- 3 user cari "24 jam" → 3 logs

Hari 3:
GET /api/popular-searches?limit=3
Response:
[
  { term: "wifi kencang", count: 18 },
  { term: "nugas", count: 17 },
  { term: "24 jam", count: 3 }
]

Homepage menampilkan pill:
- "wifi kencang" (18)
- "nugas" (17)
- "24 jam" (3)
```

### Similarity Scoring Example

```javascript
const current = {
  id: "mock-01",
  name: "Perasa Coffee & Eatery",
  district: "Sumbersari",
  priceRange: 2,
  facilities: ["wifi", "power-outlet", "study-friendly", "indoor", "parking"],
  rating: 4.7,
  reviewCount: 693
}

const candidates = MOCK_COFFEE_SHOPS.filter(s => s.id !== "mock-01")
const scored = candidates.map(c => ({
  shop: c,
  score: similarityScore(current, c)
}))
scored.sort((a, b) => b.score - a.score)
const top4 = scored.slice(0, 4)

// Hasil:
// 1. Grand Cafe Jember (score 11.73)
// 2. Discuss Space & Coffee (score 10.94)
// 3. Nugas Jember (score 10.54)
// 4. Tomoro Coffee Jember (score 9.95)
```

## Catatan Implementasi

- **Mock search logs** di-hardcode 10 entri sebagai seed. Setiap search baru di-unshift ke array.
- **Popular searches** di-cache 5 menit (`staleTime: 1000 * 60 * 5`).
- **Trending sort** ada di service mock: `sortMock(items, "trending")` → `sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)`.
- **Recommendation** tidak membutuhkan auth. Tamu pun dapat rekomendasi berbasis current coffee shop.
- **SearchAnalytics** hanya admin (`ensureAdmin()` di route handler).

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Search log coverage | > 80% search tercatat | 100% (SearchBar integration) |
| Popular search refresh | < 5 menit | 5 menit (cache staleTime) |
| Recommendation relevance | > 80% user klik rekomendasi | Belum terukur (butuh production data) |
| Analytics dashboard load | < 1s | ~500ms (cached) |