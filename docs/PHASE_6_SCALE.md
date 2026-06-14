# Phase 6 — Scale

> Ekspansi dari Jember ke kota-kota lain di Jawa Timur, dengan fitur event dan komunitas kopi.

## Tujuan

Mempersiapkan platform untuk pertumbuhan geografis dan engagement komunitas:

1. **Multi-city Support** — Struktur data yang mendukung banyak kota.
2. **City Landing Pages** — Halaman per kota dengan coffee shop, event, komunitas.
3. **Event Listings** — Jadwal festival, kompetisi, meetup kopi.
4. **Coffee Communities** — Daftar komunitas pecinta kopi per kota.

## Status

| Kriteria | Status |
| --- | --- |
| Struktur `cityId` di coffee shop | ✅ |
| Mock 4 kota (Jember, Malang, Surabaya, Banyuwangi) | ✅ |
| Halaman `/cities` | ✅ |
| Halaman `/cities/[slug]` | ✅ |
| Event listings (`/events`, `/events/[slug]`) | ✅ |
| Community listings (`/communities`, `/communities/[slug]`) | ✅ |
| Filter kota di `/search` | ✅ |
| Sitemap include kota | ✅ |

## Fitur Inti

### 1. Multi-city Data Model

**Struktur baru**:

```
City
├── id: UUID
├── slug: String (unique)
├── name: String
├── province: String
├── description: Text
└── coffeeShopCount: Integer (denormalized)

CoffeeShop (ditambah field)
├── ... (existing fields)
└── cityId: UUID FK → City
```

**Mock cities**:

| Slug | Nama | Provinsi | Coffee Shops |
| --- | --- | --- | --- |
| jember | Jember | Jawa Timur | 19 |
| malang | Malang | Jawa Timur | 0 (placeholder) |
| surabaya | Surabaya | Jawa Timur | 0 (placeholder) |
| banyuwangi | Banyuwangi | Jawa Timur | 0 (placeholder) |

**Migrasi data existing**:

- Semua 19 coffee shop Sumbersari di-set `cityId: "city-jember"`.
- `MOCK_CITIES[0].coffeeShopCount = 19`.
- Kota lain `coffeeShopCount = 0` (placeholder ekspansi).

### 2. City Landing Pages

**Halaman `/cities`** — Grid card kota:

- Card menampilkan nama, provinsi, deskripsi, jumlah coffee shop.
- Klik → pindah ke `/cities/[slug]`.

**Halaman `/cities/[slug]`** — Detail kota dengan 3 section:

1. **Coffee shop di [city]** — Grid card, filter `cityId`.
2. **Event mendatang** — Grid card event di kota ini.
3. **Komunitas kopi** — Grid card komunitas di kota ini.

**SEO**: `generateMetadata` dinamis → title "Coffee Shop di [city]", description dari `city.description`.

**Komponen**: `CitiesClient`, `CityDetailClient`, `CityCard`.

### 3. Event Listings

**Struktur data**:

```
CoffeeEvent
├── id: UUID
├── slug: String (unique)
├── title: String
├── description: Text
├── cityId: UUID FK → City
├── coffeeShopId: UUID FK → CoffeeShop (nullable, untuk event di cafe tertentu)
├── startDate: Date
├── endDate: Date
└── coverImage: Text (nullable)
```

**Mock events**:

| Slug | Judul | Kota | Coffee Shop | Periode |
| --- | --- | --- | --- | --- |
| jember-coffee-fest-2026 | Jember Coffee Fest 2026 | Jember | - | 12-14 Juli 2026 |
| latte-art-competition | Latte Art Competition | Jember | Perasa | 28 Juni 2026 |
| surabaya-brew-meetup | Surabaya Brew Meetup | Surabaya | - | 5 Juli 2026 |

**Halaman `/events`** — List semua event, sorted by startDate ascending.

**Halaman `/events/[slug]`** — Detail event:

- Judul besar.
- Periode (format: "12 Juli 2026" atau "12-14 Juli 2026" jika multi-day).
- Lokasi (kota + coffee shop jika ada).
- Deskripsi lengkap.
- Tombol "Kembali ke semua event".

**Komponen**: `EventsClient`, `EventDetailClient`, `EventCard`.

### 4. Coffee Communities

**Struktur data**:

```
CoffeeCommunity
├── id: UUID
├── slug: String (unique)
├── name: String
├── description: Text
├── cityId: UUID FK → City
├── memberCount: Integer
└── coverImage: Text (nullable)
```

**Mock communities**:

| Slug | Nama | Kota | Anggota |
| --- | --- | --- | --- |
| jember-coffee-lovers | Jember Coffee Lovers | Jember | 482 |
| barista-jember | Barista Jember | Jember | 128 |
| surabaya-manual-brew | Surabaya Manual Brew | Surabaya | 210 |

**Halaman `/communities`** — Grid card komunitas.

**Halaman `/communities/[slug]`** — Detail komunitas:

- Nama besar.
- Kota + jumlah anggota.
- Deskripsi lengkap.

**Komponen**: `CommunitiesClient`, `CommunityDetailClient`, `CommunityCard`.

### 5. Filter Kota di Search

**Dropdown "Kota"** ditambahkan di `FilterPanel` (sebelum dropdown Distrik):

- Opsi: "Semua kota" + list dari `useCities()`.
- Saat dipilih, filter `cityId` ditambahkan ke `CoffeeShopQuery`.
- URL parameter: `?cityId=city-jember&district=Sumbersari`.

**Alur filter**:

1. User buka `/search`.
2. Dropdown "Kota" default "Semua kota" (semua 19 coffee shop Jember muncul).
3. Pilih "Surabaya" → hasil kosong (belum ada coffee shop Surabaya).
4. Pilih "Jember" → kembali ke 19 coffee shop.
5. Tambah filter distrik "Sumbersari" → 19 coffee shop (semua memang di Sumbersari).

**Komponen**: `FilterPanel` (updated), `useCities` (hook), `FilterPatch.cityId` (type).

## Alur Pengguna

### Jelajah Kota

1. User buka `/cities` dari Navbar.
2. Lihat 4 card kota: Jember (19), Malang (0), Surabaya (0), Banyuwangi (0).
3. Klik "Jember" → pindah ke `/cities/jember`.
4. Section "Coffee shop di Jember": 19 card muncul.
5. Section "Event mendatang": 2 card (Jember Coffee Fest, Latte Art).
6. Section "Komunitas kopi": 2 card (Jember Coffee Lovers, Barista Jember).
7. Klik event "Jember Coffee Fest" → detail event.
8. Klik komunitas "Jember Coffee Lovers" → detail komunitas.

### Filter by City

1. User buka `/search`.
2. Klik dropdown "Kota" → pilih "Jember".
3. Hasil: 19 coffee shop Jember.
4. Tambah filter "Rating 4.5+" → hasil: 11 coffee shop.
5. URL: `/search?cityId=city-jember&rating=4.5`.
6. Chip aktif muncul di bawah search bar: "Kota terpilih", "Rating 4.5+".
7. Klik chip "Kota terpilih" → filter kota dihapus → kembali ke "Semua kota".

### Event Discovery

1. User buka `/events`.
2. List 3 event muncul, sorted by tanggal:
   - Latte Art Competition (28 Juni)
   - Surabaya Brew Meetup (5 Juli)
   - Jember Coffee Fest (12-14 Juli)
3. Klik "Latte Art Competition" → detail.
4. Lihat: "28 Juni 2026 · Jember · Perasa Coffee & Eatery".
5. Klik "Semua event" → kembali ke list.

## Endpoint API

### Cities

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/cities` | List semua kota |
| GET | `/api/cities/[slug]` | Detail kota |

### Events

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/events?cityId=...` | List event (filter opsional) |
| GET | `/api/events/[slug]` | Detail event |

### Communities

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/communities?cityId=...` | List komunitas (filter opsional) |
| GET | `/api/communities/[slug]` | Detail komunitas |

## Struktur Data

### City

| Field | Tipe |
| --- | --- |
| id | UUID |
| slug | String (unique, lowercase) |
| name | String |
| province | String |
| description | Text |
| coffeeShopCount | Integer (denormalized, auto-update via trigger) |

**Indeks**: `slug` (unique).

### CoffeeEvent

| Field | Tipe |
| --- | --- |
| id | UUID |
| slug | String (unique) |
| title | String |
| description | Text |
| cityId | UUID FK → City |
| coffeeShopId | UUID FK → CoffeeShop (nullable) |
| startDate | Date |
| endDate | Date |
| coverImage | Text (nullable) |
| createdAt | Timestamp |

**Constraint check**: `end_date >= start_date`.

**Indeks**: `(cityId, startDate)`.

### CoffeeCommunity

| Field | Tipe |
| --- | --- |
| id | UUID |
| slug | String (unique) |
| name | String |
| description | Text |
| cityId | UUID FK → City |
| memberCount | Integer |
| coverImage | Text (nullable) |
| createdAt | Timestamp |

**Indeks**: `cityId`.

## Keputusan Arsitektur

### Denormalized `coffeeShopCount`

**Kenapa `coffeeShopCount` di `City`, bukan `COUNT(*)` query?**

- Performance: `SELECT * FROM cities` tanpa JOIN.
- Simpler query di list page.
- Trade-off: perlu update saat coffee shop ditambah/dihapus.

**Implementasi**:

- Mock mode: hardcode `coffeeShopCount: 19` untuk Jember.
- Production: PostgreSQL trigger atau application-level update:

```sql
CREATE OR REPLACE FUNCTION update_city_coffee_shop_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cities
  SET coffee_shop_count = (
    SELECT COUNT(*) FROM coffee_shops WHERE city_id = NEW.city_id
  )
  WHERE id = NEW.city_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_city_count
AFTER INSERT OR DELETE OR UPDATE OF city_id ON coffee_shops
FOR EACH ROW EXECUTE FUNCTION update_city_coffee_shop_count();
```

### City Filter di Search (Dropdown, bukan Pill)

**Kenapa dropdown, bukan pill seperti Distrik?**

- Jumlah kota bisa banyak (puluhan).
- Pill horizontal scroll tidak praktis.
- Dropdown lebih compact.

**Trade-off**: Kurang discoverable dibanding pill. User harus klik untuk lihat opsi.

### Event & Community CRUD di Admin (Future)

**Saat ini event dan community hanya di-mock**. Belum ada UI admin untuk CRUD.

**Roadmap**:

- `/admin/events` — Tabel event + form tambah/edit.
- `/admin/communities` — Tabel komunitas + form tambah/edit.
- Guard: hanya admin yang bisa CRUD.

**Untuk sekarang**: Tambah event/community baru = edit `MOCK_EVENTS` / `MOCK_COMMUNITIES`.

### Sitemap Include Kota

**Sitemap dinamis** di-update untuk include:

- `/cities` (priority 0.7)
- `/cities/[slug]` per kota (priority 0.6)
- `/events` (priority 0.6)
- `/communities` (priority 0.6)

**Total URL**: 6 static + 19 coffee shops + 1 district + 4 cities = **30 URLs**.

## Contoh Interaksi

### City Detail Page Data Flow

```
1. User klik card "Jember" di /cities
2. Navigate ke /cities/jember
3. CityDetailClient render:
   a. useCity("jember") → fetch /api/cities/jember
      Response: { id: "city-jember", name: "Jember", ... }
   
   b. useCoffeeShops({ cityId: "city-jember", limit: 200 })
      → fetch /api/coffee-shops?cityId=city-jember&limit=200
      Response: { items: [19 shops], meta: {...} }
   
   c. useEvents("city-jember") → fetch /api/events?cityId=city-jember
      Response: [2 events]
   
   d. useCommunities("city-jember") → fetch /api/communities?cityId=city-jember
      Response: [2 communities]

4. Render 3 section:
   - Coffee shop di Jember (19 cards)
   - Event mendatang (2 cards)
   - Komunitas kopi (2 cards)
```

### Filter Kota + Distrik

```
URL: /search?cityId=city-jember&district=Sumbersari&rating=4.5

useSearchFilters() parse:
{
  cityId: "city-jember",
  district: "Sumbersari",
  rating: 4.5
}

useCoffeeShops(query) → fetch /api/coffee-shops?cityId=city-jember&district=Sumbersari&rating=4.5

Mock service filter:
1. Filter cityId === "city-jember" → 19 shops (semua)
2. Filter district === "Sumbersari" → 19 shops (semua)
3. Filter rating >= 4.5 → 11 shops

Result: 11 cards

Active chips:
- "Kota terpilih" (clear: cityId undefined)
- "Sumbersari" (clear: district undefined)
- "Rating 4.5+" (clear: rating undefined)
```

## Catatan Implementasi

- **Mock city-jember** sudah ada 19 coffee shop. Kota lain 0.
- **Event `coffeeShopId` nullable**: Event bisa tidak terikat coffee shop tertentu (festival kota).
- **Format tanggal** event menggunakan `toLocaleDateString("id-ID", { day, month, year })`.
- **City detail page** menggunakan `notFound()` jika slug tidak ditemukan (404 page).
- **Filter kota** di-search hanya filter by `cityId`, bukan by nama kota. Backend mock tidak support search by city name.

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Kota terdukung | > 5 kota | 4 (1 aktif, 3 placeholder) |
| Event per kota (aktif) | > 2 | 2 (Jember), 1 (Surabaya) |
| Komunitas per kota | > 1 | 2 (Jember), 1 (Surabaya) |
| City page load time | < 1s | ~500ms (cached) |
| Sitemap URLs | > 30 | 30 URLs |

## Roadmap Ekspansi

### Bulan 1-2: Tambah Kota

1. Onboard Malang: 50 coffee shop, 3 event, 2 komunitas.
2. Onboard Surabaya: 100 coffee shop, 5 event, 4 komunitas.
3. Onboard Banyuwangi: 30 coffee shop, 2 event, 1 komunitas.

**Total**: 199 coffee shop, 13 event, 10 komunitas.

### Bulan 3-4: Fitur Lanjutan

1. **Event RSVP** — User bisa daftar ikut event.
2. **Community join** — User bisa join komunitas.
3. **City-specific trending** — Trending per kota, bukan global.
4. **Multi-city AI** — AI assistant support pertanyaan lintas kota.

### Bulan 5-6: Jawa Timur Penuh

1. Tambah 10 kota lain: Kediri, Blitar, Madiun, Probolinggo, Pasuruan, Mojokerto, Gresik, Sidoarjo, Lamongan, Tuban.
2. Total: ~500 coffee shop, 50+ event, 30+ komunitas.
3. Rebranding: "NgopiJatim" (opsional).

## Catatan Teknis

- **City slug** harus unique dan URL-friendly (lowercase, hyphenated).
- **Event date validation** di Zod schema: `endDate >= startDate`.
- **Community memberCount** dummy (hardcode). Future: track real joins.
- **Cover image** event/community belum diimplementasi (null). Butuh endpoint `/uploads` (Phase 2 polish).