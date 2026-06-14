# Phase 2 — Community

> Menghidupkan platform dengan interaksi pengguna: autentikasi, ulasan, favorit, dan profil.

## Tujuan

Mengubah direktori statis menjadi platform komunitas dengan:

1. **Autentikasi aman** — Token di httpOnly cookie, bukan localStorage.
2. **Ulasan pengguna** — Rating + komentar sebagai konten organik.
3. **Favorit personal** — Koleksi coffee shop favorit per user.
4. **Profil terpusat** — Informasi akun, ulasan saya, favorit saya.

## Status

| Kriteria | Status |
| --- | --- |
| Login & Register | ✅ |
| Token httpOnly cookie | ✅ |
| Form review dengan rating bintang | ✅ |
| Favorite toggle di card & detail | ✅ |
| Halaman profil | ✅ |
| Anti-duplikat review per user | ✅ |

## Fitur Inti

### 1. Autentikasi (`/login`, `/register`)

**Arsitektur keamanan**:

```
Browser ──POST /api/auth/login──▶ Next.js Route Handler
                                       │
                                       ├─▶ Backend NestJS (verify credentials)
                                       │
                                       └─▶ Set-Cookie: ngopi_token=<jwt>
                                             httpOnly: true
                                             secure: production only
                                             sameSite: lax
                                             maxAge: 7 hari
```

**Alur**:

- Token **tidak pernah** masuk ke JavaScript browser.
- Frontend memanggil Next route handler sendiri (`/api/auth/*`), bukan backend langsung.
- Route handler menerima respons dari backend, lalu set httpOnly cookie.
- Request berikutnya otomatis membawa cookie (credentials: same-origin).

**Akun mock**:

| Peran | Email | Kata Sandi |
| --- | --- | --- |
| Admin | `user@ngopijember.id` | `Password123` |
| Owner | `owner@ngopijember.id` | `Password123` |

**Komponen**: `LoginForm`, `RegisterForm`, `AuthProvider`, `AuthNav` (tombol di Navbar).

### 2. Ulasan (`/coffee-shops/[slug]#ulasan`)

Setiap halaman detail memiliki section "Ulasan Pengunjung" dengan tiga state:

| State Pengguna | Tampilan |
| --- | --- |
| Tamu (belum login) | List ulasan + CTA "Masuk untuk memberi ulasan" |
| Login, belum review | Form rating + komentar + list ulasan |
| Login, sudah review | "Anda sudah memberi ulasan" + list ulasan |

**Form review**:

- RatingInput: 5 bintang interaktif (klik untuk pilih).
- Textarea komentar: min 10 karakter, max 2000 karakter.
- Submit → invalidate cache → list ter-update.

**List ulasan**:

- Avatar inisial nama + nama + rating + waktu relatif ("3 hari lalu").
- Foto ulasan (jika ada) dalam grid thumbnail.
- Tombol retry jika error.

**Komponen**: `ReviewSection`, `ReviewForm`, `ReviewList`, `RatingInput`, `RatingStars`.

### 3. Favorit

**Toggle di dua lokasi**:

- **CoffeeShopCard** — Tombol Heart di pojok kanan atas card.
- **DetailInfoCard** — Baris "Tersimpan?" di sidebar detail.

**Perilaku**:

- Tamu klik → redirect ke `/login?next=/favorites`.
- Login klik → optimistic update (cache berubah instan), rollback jika gagal.
- Warna merah penuh saat favorited.

**Halaman `/favorites`**:

- Tamu → CTA login.
- Login kosong → empty state + link "Jelajahi coffee shop".
- Login dengan data → grid card dari intersection favorite IDs dengan coffee shop list.

**Komponen**: `FavoriteButton`, `FavoritesClient`.

### 4. Profil Pengguna (`/profile`)

Halaman profil menampilkan:

1. **Info akun**: Avatar inisial, nama, email, role badge.
2. **Form edit**: Klik "Edit profil" → inline input nama + tombol Simpan/Batal.
3. **Favorit saya**: Grid card favorit dengan link "Lihat semua" ke `/favorites`.
4. **Ulasan saya**: List ulasan + link ke detail coffee shop terkait.
5. **Tombol Keluar**: Link ke `/logout` (route handler hapus cookie + redirect ke `/`).

**Guard**: `ProfileClient` redirect tamu ke `/login?next=/profile` jika belum login.

**Komponen**: `ProfileClient`, `ProfileMyReviews`, `ProfileMyFavorites`.

## Alur Pengguna

### Registrasi & Review Pertama

1. Tamu buka `/coffee-shops/perasa-coffee-eatery`.
2. Scroll ke "Ulasan Pengunjung" → klik "Masuk untuk memberi ulasan".
3. Redirect ke `/login?next=/coffee-shops/perasa-coffee-eatery`.
4. Klik "Daftar" → isi nama, email, kata sandi (min 8, huruf besar+kecil+angka).
5. Submit → auto-login → redirect balik ke detail.
6. Section "Ulasan Pengunjung" sekarang menampilkan form.
7. Klik 4 bintang → ketik komentar → submit.
8. Ulasan muncul di atas list (sorted terbaru).

### Workflow Favorit

1. Login sebagai `user@ngopijember.id`.
2. Buka `/search?q=wifi`.
3. Klik Heart di card "Perasa Coffee & Eatery" → ikon jadi merah penuh.
4. Buka `/favorites` → card Perasa muncul.
5. Klik card → detail → tombol "Tersimpan?" juga merah.
6. Klik lagi → unfavorited, hilang dari `/favorites`.

### Edit Profil

1. Login → klik inisial di Navbar → `/profile`.
2. Klik "Edit profil" → input nama muncul.
3. Ubah "Test User" jadi "Budi Santoso" → Simpan.
4. Nama ter-update, invalidate cache `auth/me`.

## Endpoint API

### Autentikasi

| Metode | Path | Deskripsi |
| --- | --- | --- |
| POST | `/api/auth/login` | Login, set httpOnly cookie |
| POST | `/api/auth/register` | Register, auto-login, set cookie |
| GET | `/api/auth/me` | Ambil user dari cookie |
| POST | `/api/auth/logout` | Hapus cookie |
| PATCH | `/api/profile` | Update nama/avatar user |
| GET | `/api/profile/reviews` | List review milik user |

### Reviews

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/reviews?coffeeShopId=...` | List review per coffee shop |
| POST | `/api/reviews` | Buat review (auth, anti-duplikat per user) |
| PATCH | `/api/reviews/[id]` | Update review sendiri |
| DELETE | `/api/reviews/[id]` | Hapus review sendiri |

### Favorites

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/favorites` | List favorite IDs user |
| POST | `/api/favorites` | Tambah favorite |
| DELETE | `/api/favorites?coffeeShopId=...` | Hapus favorite |

## Struktur Data

### User

| Field | Tipe |
| --- | --- |
| id | UUID |
| name | String (3-100 karakter) |
| email | String (unique, valid email) |
| password_hash | Text |
| avatar_url | Text (nullable) |
| role | Enum: USER, OWNER, MODERATOR, ADMIN |

### Review

| Field | Tipe |
| --- | --- |
| id | UUID |
| user_id | UUID FK |
| coffee_shop_id | UUID FK |
| rating | Integer (1-5) |
| comment | Text (10-2000 karakter) |
| images | Array URL (max 4) |
| created_at | Timestamp |
| updated_at | Timestamp |

**Constraint unique**: `(user_id, coffee_shop_id)` — satu user = satu review per coffee shop.

### Favorite

| Field | Tipe |
| --- | --- |
| id | UUID |
| user_id | UUID FK |
| coffee_shop_id | UUID FK |
| created_at | Timestamp |

**Constraint unique**: `(user_id, coffee_shop_id)`.

## Keputusan Arsitektur

### Token di HttpOnly Cookie

**Kenapa bukan localStorage?**

- `localStorage` rentan XSS: skrip berbahaya di halaman bisa membaca token.
- `httpOnly cookie` tidak bisa dibaca JavaScript browser, hanya dikirim otomatis oleh browser ke server.

**Kenapa route handler Next, bukan langsung ke backend?**

- Browser butuh `Set-Cookie` header dari domain yang sama (same-origin) untuk cookie httpOnly bekerja.
- Jika frontend (Vercel) dan backend (Render) beda domain, browser menolak cookie cross-origin.
- Solusi: frontend proxy ke backend, backend mengembalikan token di body, route handler Next set cookie same-origin.

### Optimistic Update di Favorite

**Kenapa optimistic?**

- Toggle favorite harus terasa instan (< 100ms).
- Network round-trip bisa 200-500ms.

**Cara kerja**:

1. User klik Heart.
2. Cache `favorites` di-update sebelum request dikirim.
3. Request dikirim.
4. Jika berhasil → cache tetap.
5. Jika gagal → cache rollback ke state sebelumnya.

**Konsekuensi**: User bisa melihat state "favorited" meskipun server sebenarnya gagal. Ini trade-off UX vs konsistensi yang diterima.

### AuthProvider Context

Auth state (`user`, `isAuthenticated`, `login`, `logout`, `register`) di-expose lewat React Context. Kenapa bukan Zustand?

- Auth state global tapi jarang berubah (login sekali, logout sekali).
- Context lebih ringan, tanpa dependency tambahan.
- TanStack Query sudah handle caching user data via `queryKey: ["auth", "me"]`.

## Contoh Interaksi

### Login → Review → Logout

```
User flow:
1. GET /coffee-shops/perasa-coffee-eatery
2. Klik "Masuk untuk memberi ulasan"
3. POST /api/auth/login
   Body: { email: "user@ngopijember.id", password: "Password123" }
   Response: 200 OK, Set-Cookie: ngopi_token=xxx
4. Redirect ke /coffee-shops/perasa-coffee-eatery
5. Section "Ulasan" sekarang menampilkan form
6. POST /api/reviews
   Body: { coffeeShopId: "mock-01", rating: 5, comment: "Mantap!" }
   Response: 201 Created
   Cookie otomatis dibawa
7. Review muncul di list
8. Klik "Keluar" di /profile
9. POST /api/auth/logout
   Response: 200, Set-Cookie: ngopi_token= (hapus)
10. Redirect ke /
```

### Anti-Duplikat Review

```
1. User A sudah review coffee shop X
2. User A coba POST /api/reviews lagi untuk X
3. Backend cek: UNIQUE(user_id, coffee_shop_id) violated
4. Response: 409 Conflict
   Body: { success: false, message: "Anda sudah pernah memberi ulasan untuk coffee shop ini." }
5. Frontend tampilkan error di FormError component
```

## Catatan Implementasi

- **Rating stars** menggunakan Lucide `Star` dengan kelas `fill-warning` saat aktif.
- **Avatar inisial** diambil dari `user.name.charAt(0).toUpperCase()` dengan background aksen.
- **Waktu relatif** di-review: "hari ini", "kemarin", "X hari lalu", "X bulan lalu".
- **Upload foto review** di-scaffold (field `images: string[]`) tapi endpoint `/uploads` belum diimplementasi.
- **Password validation**: min 8 karakter, regex huruf kecil, huruf besar, angka.

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| Waktu login (submit → redirect) | < 2s | ~800ms (mock mode) |
| Favorite toggle responsiveness | < 100ms | Instan (optimistic) |
| Review submission success rate | > 95% | 100% (mock) |
| Session persistence | 7 hari | ✅ (maxAge cookie) |