# Phase 3 — Business

> Memberdayakan pemilik coffee shop untuk mengklaim, mengelola, dan mempromosikan bisnis mereka.

## Tujuan

Membuka jalur monetisasi dan engagement dengan pemilik coffee shop melalui:

1. **Claim Coffee Shop** — Pemilik mengajukan kepemilikan, admin verifikasi.
2. **Owner Dashboard** — CRUD coffee shop yang telah di-claim.
3. **Promotions** — Pemilik membuat promosi dengan rentang tanggal.
4. **Basic Analytics** — Views, rating rata-rata, jumlah ulasan.

## Status

| Kriteria | Status |
| --- | --- |
| Alur klaim (user → admin approve) | ✅ |
| Owner dashboard | ✅ |
| Edit coffee shop oleh owner | ✅ |
| CRUD promosi | ✅ |
| Analytics card | ✅ |
| Guard role OWNER/ADMIN | ✅ |

## Fitur Inti

### 1. Klaim Coffee Shop

**Alur klaim**:

```
User                  Frontend                  Admin
 │                        │                        │
 ├─ Klik "Klaim coffee    │                        │
 │  shop ini"             │                        │
 │                        │                        │
 ├─ Isi form klaim        │                        │
 │  (pilih coffee shop +  │                        │
 │   catatan bukti)       │                        │
 │                        │                        │
 ├─ Submit ──────────────▶│                        │
 │                        │──POST /api/claims──────▶│
 │                        │                        │
 │                        │◀─201 Created────────────│
 │                        │                        │
 │◀─Redirect /claims──────│                        │
 │                        │                        │
 │   (status: Menunggu)   │                        │
 │                        │                        │
 │                        │     ┌───────────────────│
 │                        │     │ Admin buka        │
 │                        │     │ /admin/claims     │
 │                        │     │                   │
 │                        │     │ Klik "Setuju"     │
 │                        │     │                   │
 │                        │◀────PATCH /api/admin/   │
 │                        │     claims/:id/approve──│
 │                        │                        │
 │                        │──▶ Set ownerId di       │
 │                        │    coffee shop          │
 │                        │    verified = true      │
 │                        │                        │
 │   Refresh /claims      │                        │
 │◀─Status: Disetujui─────│                        │
```

**Halaman terkait**:

- `/claim` — Form pengajuan klaim (pilih coffee shop + catatan).
- `/claims` — Daftar klaim user dengan status pill (Menunggu/Disetujui/Ditolak).
- `/admin/claims` — Tabel admin dengan tombol Setuju/Tolak.

**Tombol "Klaim coffee shop ini"** di detail page:

- Muncul jika `!shop.verified`.
- Tamu → CTA "Masuk untuk klaim".
- User dengan klaim pending → pill "Klaim sedang ditinjau".
- User tanpa klaim → tombol aksen "Klaim coffee shop ini".

**Komponen**: `ClaimButton`, `ClaimForm`, `ClaimList`, `AdminClaimList`.

### 2. Owner Dashboard (`/owner`)

**Guard**: Hanya role `OWNER` atau `ADMIN` yang bisa akses. Lainnya redirect ke `/`.

**Halaman**:

| Path | Deskripsi |
| --- | --- |
| `/owner` | Dashboard dengan 4 kartu analytics + tabel coffee shop |
| `/owner/coffee-shops` | Daftar coffee shop milik owner |
| `/owner/coffee-shops/[id]` | Form edit detail coffee shop |
| `/owner/promotions` | Daftar promosi |
| `/owner/promotions/new` | Form buat promosi baru |

**Analytics cards**:

| Kartu | Sumber Data |
| --- | --- |
| Coffee Shop | Count coffee shop dengan ownerId = user |
| Total Ulasan | Count review untuk coffee shop milik user |
| Rating Rata-rata | Avg rating coffee shop milik user |
| Total Views | Sum views coffee shop milik user |

**Tabel coffee shop**: Nama, rating, ulasan, views, tombol Edit, tombol "Lihat" ke detail publik.

**Komponen**: `OwnerShell`, `OwnerGuard`, `AnalyticsCards`, `OwnerCoffeeShopTable`, `OwnerCoffeeShopForm`.

### 3. Promosi

**Form buat promosi**:

- Select coffee shop (hanya milik owner).
- Judul (min 1, max 120).
- Deskripsi (max 500).
- Tanggal mulai (YYYY-MM-DD).
- Tanggal selesai (YYYY-MM-DD, harus ≥ tanggal mulai).

**List promosi**:

- Tabel: judul, coffee shop, periode, aksi Hapus.
- Konfirmasi 2-tahap untuk hapus (klik Hapus → konfirmasi → klik Hapus lagi).

**Komponen**: `PromotionForm`, `OwnerPromotionList`.

### 4. Admin CRUD Coffee Shop

Admin memiliki akses penuh CRUD coffee shop (bahkan yang bukan milik owner manapun).

**Halaman admin** (`/admin`):

| Path | Deskripsi |
| --- | --- |
| `/admin` | Dashboard + tabel coffee shop |
| `/admin/coffee-shops/new` | Form tambah |
| `/admin/coffee-shops/[id]/edit` | Form edit |
| `/admin/claims` | Review klaim |
| `/admin/analytics/searches` | Search analytics (Phase 4) |

**Form tambah/edit** menggunakan skema Zod yang sama dengan owner form, plus field `verified` toggle.

**Komponen**: `AdminShell`, `CoffeeShopTable`, `CoffeeShopForm`.

## Alur Pengguna

### Pemilik Coffee Shop (End-to-End)

1. **Daftar akun** sebagai `owner@ngopijember.id`.
2. **Buka detail** coffee shop miliknya (Perasa Coffee & Eatery).
3. **Klik "Klaim coffee shop ini"** → isi catatan: "Saya pemilik sah, ini NPWP usaha: 01.234.567.8-910.000".
4. **Submit** → redirect ke `/claims` → status "Menunggu".
5. **Tunggu admin approve** (di sisi admin: buka `/admin/claims`, klik "Setuju").
6. **Refresh `/claims`** → status "Disetujui".
7. **Login sebagai owner** → buka `/owner`.
8. **Coffee shop muncul** di tabel dengan tombol "Edit".
9. **Edit**: ubah deskripsi, tambah fasilitas "Live Music", simpan.
10. **Buat promosi**: `/owner/promotions/new`, isi "Diskon 20% setiap Selasa", periode 1-31 Juli 2026.
11. **Lihat analytics**: views 1200, rating 4.7, 2 ulasan.

### Admin Verifikasi Klaim

1. Login sebagai `user@ngopijember.id` (role ADMIN).
2. Buka `/admin/claims`.
3. Lihat tabel: Nama coffee shop, Pemohon, Catatan, Status, Aksi.
4. Klik "Setuju" → row berubah jadi "Disetujui" (pill hijau).
5. Cek `/coffee-shops/perasa-coffee-eatery` → badge "Terverifikasi" muncul.
6. Cek `/owner` (login sebagai owner) → coffee shop muncul di tabel.

## Endpoint API

### Klaim (User)

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/claims` | List klaim milik user yang login |
| POST | `/api/claims` | Ajukan klaim baru |

### Klaim (Admin)

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/admin/claims` | List semua klaim |
| POST | `/api/admin/claims/[id]/approve` | Setujui klaim (set ownerId + verified) |
| POST | `/api/admin/claims/[id]/reject` | Tolak klaim |

### Owner

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/owner/coffee-shops` | List coffee shop milik owner |
| PATCH | `/api/owner/coffee-shops/[id]` | Update coffee shop (guard ownerId) |
| GET | `/api/owner/promotions` | List promosi milik owner |
| POST | `/api/owner/promotions` | Buat promosi baru |
| PATCH | `/api/owner/promotions/[id]` | Update promosi |
| DELETE | `/api/owner/promotions/[id]` | Hapus promosi |
| GET | `/api/owner/analytics` | Aggregat analytics owner |

### Admin CRUD

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/admin/coffee-shops` | List semua coffee shop |
| POST | `/api/admin/coffee-shops` | Tambah coffee shop |
| PATCH | `/api/admin/coffee-shops/[id]` | Edit coffee shop |
| DELETE | `/api/admin/coffee-shops/[id]` | Hapus coffee shop |

## Struktur Data

### OwnerClaim

| Field | Tipe |
| --- | --- |
| id | UUID |
| user_id | UUID FK |
| coffee_shop_id | UUID FK |
| status | Enum: PENDING, APPROVED, REJECTED |
| notes | Text (nullable, max 500) |
| created_at | Timestamp |
| updated_at | Timestamp |

**Constraint unique**: `(user_id, coffee_shop_id)` — satu user = satu klaim per coffee shop.

### Promotion

| Field | Tipe |
| --- | --- |
| id | UUID |
| coffee_shop_id | UUID FK |
| title | String (max 120) |
| description | Text (nullable, max 500) |
| start_date | Date |
| end_date | Date |
| created_at | Timestamp |

**Constraint check**: `end_date >= start_date`.

## Keputusan Arsitektur

### Ownership via Field, bukan Tabel Terpisah

**Kenapa `ownerId` di `coffee_shops`, bukan tabel `coffee_shop_owners`?**

- Sederhana: satu coffee shop = satu owner (saat ini).
- Query cepat: `WHERE owner_id = user.id` tanpa JOIN.
- Cukup untuk kebutuhan saat ini.

**Trade-off**: Jika di masa depan butuh multi-owner (tim manajemen), perlu refactor ke tabel pivot.

### Role-Based Guard di Client & Server

**Client-side guard** (`OwnerGuard`, `AdminGuard`) untuk UX cepat:

- Cek `user.role` dari context.
- Redirect instan tanpa network call.

**Server-side guard** di route handler untuk keamanan:

- Re-check role via cookie → backend `/auth/me`.
- Return 401 jika belum login, 403 jika role tidak cukup.

**Defense in depth**: client guard bukan pengganti server guard.

### Optimistic Claim Status

Tidak ada optimistic update untuk klaim karena:

- Klaim adalah proses approval (user → admin).
- State "Menunggu" tidak bisa diubah user setelah submit.
- Admin action (approve/reject) tidak perlu instan.

## Contoh Interaksi

### Klaim Berhasil Disetujui

```
1. Owner login sebagai owner@ngopijember.id
2. POST /api/claims
   Body: { coffeeShopId: "mock-01", notes: "Saya pemilik" }
   Response: 201 Created
   Data: { id: "claim-123", status: "PENDING", ... }

3. Admin login sebagai user@ngopijember.id
4. GET /api/admin/claims
   Response: 200
   Data: [{ id: "claim-123", status: "PENDING", coffeeShopName: "Perasa..." }]

5. POST /api/admin/claims/claim-123/approve
   Response: 200
   Efek: 
   - claim-123.status = "APPROVED"
   - coffee-shop mock-01.ownerId = "mock-user-02"
   - coffee-shop mock-01.verified = true

6. Owner refresh /claims → status pill hijau "Disetujui"
7. Owner buka /owner → coffee shop "Perasa" muncul di tabel
```

### Guard Role

```
1. User A (role USER) login
2. Akses /owner
3. OwnerGuard cek: user.role !== "OWNER" && user.role !== "ADMIN"
4. Redirect ke /
5. Coba POST /api/owner/coffee-shops (manual via curl)
6. Route handler cek role dari cookie → backend
7. Response: 403 Forbidden
   Body: { success: false, message: "Bukan pemilik." }
```

## Catatan Implementasi

- **Mock owner**: `MOCK_USERS[1]` adalah `owner@ngopijember.id` dengan role `OWNER`.
- **Mock verified shop**: Perasa Coffee & Eatery (`mock-01`) sudah di-set `ownerId = "mock-user-02"` dan `verified = true` untuk demo.
- **Promosi belum tampil di publik**: Promosi disimpan tapi belum ada UI publik untuk menampilkannya di detail page. Ini scope Phase 6 atau polish berikutnya.
- **Analytics owner** hanya menghitung dari data yang ada (rating, views, review count di coffee shop). Belum ada tracking "views" yang sebenarnya — field `views` di coffee shop adalah dummy `1200` untuk Perasa.

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Waktu approval klaim | < 24 jam (SLA admin) | Tergantung admin |
| Owner bisa edit dalam 3 klik | ✅ | Claim → Approve → Edit |
| Promosi terpublikasi | > 10 di bulan pertama | Siap (UI tersedia) |
| Dashboard load time | < 1s | ~500ms (cached) |